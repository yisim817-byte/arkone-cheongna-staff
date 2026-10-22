import { getSql, dbSource } from "@/lib/db";
import { SITE_ID } from "@/data/content";
import { checkVisit } from "@/lib/visit.server";

// 작업지시서 13: 모델하우스 방문예약 접수(/api/visit). 사전고객등록(leads)과 따로 visit_reservations 에 쓴다.
// - 휴대폰 010 11자리. 방문 희망일은 arkone-visit-config 목록 안의 날짜만(밖이면 날짜만 비우고 접수).
// - 같은 번호·같은 날짜를 10분 안에 다시 보내면 새로 쓰지 않고 이미 접수로 응답.
// - 운영(Neon)이 아니면 is_test=true(Preview 는 PGLite). 운영에서 Neon 이 없으면 접수하지 않는다.
const SLOTS = new Set(["AM", "PM", "ANY"]);
const SLOT_LABEL: Record<string, string> = { AM: "오전", PM: "오후", ANY: "시간 상관없음" };
const INTERESTS = new Set(["", "아파트", "오피스텔", "상가"]);
export const VISIT_CONSENT_VERSION = "visit-2026-10-22-v1";

type Body = Record<string, unknown>;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[<>]/g, "").trim().slice(0, max) : "");

function receiptNo() {
  const k = new Date(Date.now() + 9 * 3600 * 1000);
  const mmdd = `${String(k.getUTCMonth() + 1).padStart(2, "0")}${String(k.getUTCDate()).padStart(2, "0")}`;
  return `VIS-${mmdd}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

export async function handleVisitSubmit(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length > 4000) return json(413, { ok: false, error: "요청이 너무 깁니다." });
  let b: Body;
  try { b = JSON.parse(raw) as Body; } catch { return json(400, { ok: false, error: "잘못된 요청입니다." }); }
  if (typeof b.hp === "string" && b.hp) return json(400, { ok: false, error: "접수하지 못했습니다." });
  const name = text(b.name, 20);
  if (name.length < 1) return json(400, { ok: false, error: "이름을 입력해 주세요." });
  if (/(\d{6}\s*-?\s*[1-8]\d{6})|(\d{13})/.test(String(b.name ?? ""))) return json(400, { ok: false, error: "주민등록번호는 입력하지 않습니다." });
  const phone = typeof b.phone === "string" ? b.phone.replace(/\D/g, "") : "";
  if (!/^010\d{8}$/.test(phone)) return json(400, { ok: false, error: "휴대폰번호는 010으로 시작하는 11자리입니다." });
  if (b.consent_privacy !== true) return json(400, { ok: false, error: "개인정보 수집·이용에 동의해 주세요." });
  const slot = typeof b.visit_slot === "string" && SLOTS.has(b.visit_slot) ? b.visit_slot : "ANY";
  const interest = text(b.interest, 10);
  if (!INTERESTS.has(interest)) return json(400, { ok: false, error: "관심 상품을 다시 선택해 주세요." });

  const production = process.env.VERCEL_ENV === "production";
  if (production && dbSource !== "neon") {
    console.error("[visit] durable store unavailable");
    return json(503, { ok: false, error: "지금은 접수를 저장할 수 없습니다. 잠시 후 다시 시도해 주세요." });
  }
  const test = !production || dbSource !== "neon";
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  const pick = await checkVisit(text(b.visit_date, 10) || undefined, slot, `https://${host}`);
  const visitDate = pick ? pick.date : null;
  const dateLabel = pick ? pick.label.slice(0, pick.label.length - SLOT_LABEL[pick.slot].length).trim() : "";

  try {
    const sql = await getSql();
    const dup = await sql<{ receipt_no: string }>`
      select receipt_no from visit_reservations
      where site_id = ${SITE_ID} and phone = ${phone} and is_test = ${test}
        and created_at >= now() - interval '10 minutes'
        and visit_date is not distinct from ${visitDate}::date
      order by created_at desc limit 1
    `;
    if (dup[0]) {
      return json(200, { ok: true, duplicate: true, receiptNo: dup[0].receipt_no, visitDate, dateLabel, slotLabel: SLOT_LABEL[slot], isTest: test });
    }
    let receipt = receiptNo();
    for (let i = 0; i < 4; i++) {
      const clash = await sql<{ id: number }>`select id from visit_reservations where receipt_no = ${receipt} limit 1`;
      if (!clash[0]) break;
      receipt = receiptNo();
    }
    await sql`
      insert into visit_reservations
        (receipt_no, site_id, site_host, page, name, phone, visit_date, visit_slot, interest, consent_privacy, consent_version,
         utm_source, utm_medium, utm_campaign, is_test, notify_status)
      values
        (${receipt}, ${SITE_ID}, ${host}, ${text(b.page, 100) || "/visit"}, ${name}, ${phone}, ${visitDate}::date, ${slot}, ${interest || null}, true,
         ${text(b.consent_version, 60) || VISIT_CONSENT_VERSION}, ${text(b.utm_source, 60) || null}, ${text(b.utm_medium, 60) || null},
         ${text(b.utm_campaign, 80) || null}, ${test}, 'pending')
    `;
    let notify = { status: "failed", detail: "notify exception" };
    try {
      const { sendVisitAlert } = await import("./kakao.server");
      notify = await sendVisitAlert({
        receiptNo: receipt,
        createdAt: new Date().toISOString(),
        name,
        phone,
        when: `${dateLabel || "날짜 미선택(전화 확인)"} · ${SLOT_LABEL[slot]}`,
        interest: interest || null,
        site: host,
        test,
      });
    } catch {
      console.error("[visit] notify failed after save", receipt);
    }
    try {
      await sql`update visit_reservations set notify_status = ${notify.status}, notify_detail = ${notify.detail}, notify_at = now() where receipt_no = ${receipt}`;
    } catch {
      console.error("[visit] notify status update failed", receipt);
    }
    return json(200, { ok: true, duplicate: false, receiptNo: receipt, visitDate, dateLabel, slotLabel: SLOT_LABEL[slot], isTest: test, dateDropped: Boolean(text(b.visit_date, 10) && !pick) });
  } catch {
    console.error("[visit] save failed");
    return json(500, { ok: false, error: "저장하지 못했습니다. 잠시 후 다시 시도해 주세요." });
  }
}
