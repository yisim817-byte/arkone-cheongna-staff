import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { loadVisitConfig, VISIT_SLOT_LABEL, type VisitOption } from "@/lib/visit-config";

// 작업지시서 13: 모델하우스 방문예약 전용 페이지. 사전고객등록과 별개로 /api/visit 에 접수한다.
// 날짜는 arkone-visit-config 가 주는 목록만. 설정이 꺼졌거나 함수가 실패하면 날짜·시간대를 숨기고 전화 확인으로 안내한다.
const TITLE = "모델하우스 방문예약";
const CONSENT_VERSION = "visit-2026-10-22-v1";
const SLOTS = ["AM", "PM", "ANY"] as const;
type Slot = (typeof SLOTS)[number];
const INTERESTS = ["아파트", "오피스텔", "상가"] as const;

export const Route = createFileRoute("/visit")({
  head: () => pageHead(TITLE),
  component: Page,
});

type Done = { receiptNo: string; duplicate: boolean; dateLabel: string; slotLabel: string };

function Page() {
  const [cfg, setCfg] = useState<"loading" | "ok" | "off">("loading");
  const [dates, setDates] = useState<VisitOption[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState<Slot>("ANY");
  const [interest, setInterest] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    let live = true;
    loadVisitConfig().then((c) => {
      if (!live) return;
      setDates(c ? c.dates : []);
      setCfg(c ? "ok" : "off");
    });
    return () => { live = false; };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 1) return setError("이름을 입력해 주세요.");
    if (!/^010\d{8}$/.test(phone.replace(/\D/g, ""))) return setError("휴대폰번호는 010으로 시작하는 11자리입니다.");
    if (cfg === "ok" && !visitDate) return setError("방문 희망일을 선택해 주세요.");
    if (!consent) return setError("개인정보 수집·이용에 동의해야 신청할 수 있습니다.");
    setPending(true);
    try {
      const q = new URLSearchParams(window.location.search);
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name, phone,
          visit_date: cfg === "ok" ? visitDate : "",
          visit_slot: cfg === "ok" ? visitSlot : "ANY",
          interest,
          consent_privacy: true,
          consent_version: CONSENT_VERSION,
          page: "/visit",
          utm_source: q.get("utm_source") || "",
          utm_medium: q.get("utm_medium") || "",
          utm_campaign: q.get("utm_campaign") || "",
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; receiptNo?: string; duplicate?: boolean; dateLabel?: string; slotLabel?: string } | null;
      if (!res.ok || !body?.ok || !body.receiptNo) {
        setError(body?.error || "접수하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setDone({ receiptNo: body.receiptNo, duplicate: Boolean(body.duplicate), dateLabel: body.dateLabel || "", slotLabel: body.slotLabel || "" });
    } catch {
      setError("접수하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell>
      <SubHero en="VISIT" title={TITLE} crumbs={TITLE} />
      <main className="ak-wrap ak-page">
        <div className="vr max-w-lg">
          <p className="vr__desc">방문 희망 날짜를 남겨 주시면, 담당자가 확인 후 방문 시간을 전화로 안내해 드립니다.</p>
          <p className="vr__loc">견본주택 위치 · 인천광역시 서해구 청라동 87-1 · 별도 공지 시까지 운영</p>
          {done ? (
            <div className="vr__done" role="status">
              <h2 className="vr__title">{done.duplicate ? "이미 접수된 방문예약입니다" : "접수 완료"}</h2>
              <p>
                {`방문예약 신청이 접수되었습니다.${done.dateLabel ? ` ${done.dateLabel}` : ""}${done.dateLabel && done.slotLabel ? ` ${done.slotLabel}` : ""} · 담당자가 확인 후 전화로 방문 시간을 안내해 드립니다.`}
              </p>
              <p className="vr__receipt">접수번호 <strong>{done.receiptNo}</strong></p>
              <Link to="/register" className="vr__submit">사전고객등록도 하기</Link>
            </div>
          ) : (
            <form className="vr__form" onSubmit={onSubmit} noValidate>
              <input type="text" name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
              <label className="vr__field">
                <span>이름 <em>(필수)</em></span>
                <input required maxLength={20} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </label>
              <label className="vr__field">
                <span>휴대폰번호 <em>(필수)</em></span>
                <input required inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="01012345678" />
              </label>
              {cfg === "off" ? (
                <div className="vr__off">
                  <p>방문 일정은 담당자가 전화로 확인합니다.</p>
                  <a href={PROJECT_PHONE_TEL} className="vr__tel">전화 예약 {PROJECT_PHONE_DISPLAY}</a>
                </div>
              ) : (
                <>
                  <label className="vr__field">
                    <span>방문 희망일 <em>(필수)</em></span>
                    <select name="visit_date" required value={visitDate} onChange={(e) => setVisitDate(e.target.value)} disabled={cfg === "loading"}>
                      <option value="">{cfg === "loading" ? "날짜를 불러오는 중" : "날짜 선택"}</option>
                      {dates.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </label>
                  <fieldset className="vr__field">
                    <legend>방문 희망 시간대</legend>
                    <div className="vr__choices">
                      {SLOTS.map((s) => (
                        <label key={s}>
                          <input type="radio" name="visit_slot" value={s} checked={visitSlot === s} onChange={() => setVisitSlot(s)} />
                          <span>{VISIT_SLOT_LABEL[s]}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
              <fieldset className="vr__field">
                <legend>관심 상품 <em>(선택)</em></legend>
                <div className="vr__choices">
                  {INTERESTS.map((i) => (
                    <label key={i}>
                      <input type="radio" name="interest" value={i} checked={interest === i} onChange={() => setInterest(interest === i ? "" : i)} />
                      <span>{i}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="vr__consent">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  <b>[필수] 개인정보 수집·이용에 동의합니다.</b><span className="mt-1 block font-medium">개인정보 수집·이용 안내</span><span className="mt-1 block text-[13px] leading-5">청라 아크원 푸르지오 분양 상담 담당은 견본주택 방문예약 접수 및 안내를 위하여 다음과 같이 개인정보를 수집·이용합니다.</span><span className="mt-1 block text-[13px] leading-5">1. 개인정보 수집·이용 주체 : 청라 아크원 푸르지오 분양 상담 담당(문의 {PROJECT_PHONE_DISPLAY})</span><span className="mt-1 block text-[13px] leading-5">2. 개인정보 수집·이용 항목 : 이름, 휴대폰번호, 방문 희망일·시간대, 관심 상품 / (자동 수집) 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 불량이용 기록, 기기정보</span><span className="mt-1 block text-[13px] leading-5">3. 개인정보 수집·이용 목적 : 견본주택 방문 일정 안내, 청라 아크원 푸르지오 분양정보 제공 및 마케팅 활용(마케팅 활용은 광고성 정보 수신에 동의한 경우에 한함)</span><span className="mt-1 block text-[13px] leading-5">4. 개인정보 보유·이용 기간 : 사전고객등록과 같은 기간(분양 종료 시 파기)이며, 동의 철회 또는 이용 목적 달성 시에도 지체 없이 파기합니다.</span><span className="mt-1 block text-[13px] leading-5">5. 개인정보 처리 위탁 및 제공 : 등록 사실을 이 사이트 담당자에게 알리는 경우 외에는 제3자에게 제공하지 않습니다.</span><span className="mt-1 block text-[13px] leading-5">6. 동의 거부 권리 : 고객님께서는 개인정보 수집·이용 동의를 거부하실 수 있으며, 거부하실 경우 방문예약 신청이 제한됩니다. 전화 예약({PROJECT_PHONE_DISPLAY})은 동의 없이 이용하실 수 있습니다.</span> <Link to="/privacy" className="underline">처리방침</Link>
                </span>
              </label>
              {error ? <p className="vr__error" role="alert">{error}</p> : null}
              <button type="submit" disabled={pending} className="vr__submit">{pending ? "접수 중" : "방문예약 신청"}</button>
            </form>
          )}
          <div className="vr__notes">
            <p>※ 방문 시간은 담당자가 전화로 확정 안내합니다.</p>
            <p>※ 방문예약은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>
            <p>
              ※ 방문예약은 사전고객등록과 별개입니다. 백화점 상품권·코스트코 회원권 이벤트는 사전고객등록을 한 분이 대상입니다.{" "}
              <Link to="/register" className="vr__link">사전고객등록 하기</Link>
            </p>
          </div>
        </div>
      </main>
    </Shell>
  );
}
