import type { Role, RoleFigure, StripCell } from "./role-types";

/**
 * 이 사이트의 첫 화면 데이터 (A · 아크원푸르지오청라.site · 역할: 청약·공급·일정).
 * 세 저장소에서 이 파일만 내용이 다르다. 숫자와 일정은 사실 원장에 있는 값만 쓴다.
 */

/**
 * 2026.10.22(목) 입주자모집공고 게시(주택관리번호 2026000496)로 일정이 확정되어 true.
 * 띠와 달력의 값은 공고문 1·4면 기준이다. 일정이 바뀌면 공고문 값으로 고친다.
 */
export const SCHEDULE_CONFIRMED: boolean = true;

const FIGURE_CONFIRMED: RoleFigure = {
  kind: "calendar",
  year: 2026,
  month: 10,
  marks: [
    { day: 22, style: "fill", label: "입주자모집공고 게시 10.22(목)" },
    { day: 30, style: "ring", label: "GRAND OPEN 10.30(금) 예정" },
  ],
  alt: "2026년 10월. 입주자모집공고 게시 10.22(목) · 견본주택 GRAND OPEN 10.30(금) 예정",
};

const FIGURE_PENDING: RoleFigure = FIGURE_CONFIRMED;

const STRIP_CONFIRMED: StripCell[] = [
  {
    no: "1",
    label: "입주자모집공고",
    chip: { kind: "done", text: "게시" },
    value: "10.22",
    desc: "주택관리번호 2026000496",
  },
  {
    no: "2",
    label: "GRAND OPEN",
    chip: { kind: "soon", text: "예정" },
    value: "10.30",
    desc: "견본주택 청라동 87-1번지",
  },
  {
    no: "3",
    label: "청약 접수",
    chip: { kind: "soon", text: "공고 기준" },
    value: "11.02~11.04",
    desc: "특별공급 11.02(월) · 1순위 11.03(화) · 2순위 11.04(수)",
  },
  {
    no: "4",
    label: "당첨자 발표·계약",
    chip: { kind: "soon", text: "공고 기준" },
    value: "11.10",
    desc: "서류접수 11.12(목)~11.16(월) · 계약 11.22(일)~11.24(화)",
  },
];

const STRIP_PENDING: StripCell[] = STRIP_CONFIRMED;

export const ROLE: Role = {
  tone: "paper",
  h1: ["청라 아크원 푸르지오", "청약 일정·공급 안내"],
  heroLink: { to: "/changeinfo", label: "청약안내 보기" },
  figure: SCHEDULE_CONFIRMED ? FIGURE_CONFIRMED : FIGURE_PENDING,
  strip: SCHEDULE_CONFIRMED ? STRIP_CONFIRMED : STRIP_PENDING,
  stripSource: [
    { k: "최종 기준", v: "입주자모집공고, 청약홈" },
    { k: "안내", v: "입주자모집공고 기준이며, 일정이 바뀌면 공고문이 우선합니다." },
  ],
  main: {
    kind: "subscription",
    title: ["청약 전에", "확인할 세 가지"],
    lead: "최종 자격과 기준은 입주자모집공고와 청약홈을 따릅니다.",
  },
  sections: ["overview", "location", "premium", "contact"],
  story: {
    title: "청약·일정 요약",
    paras: [
      "청라 아크원 푸르지오(APT) 입주자모집공고가 2026.10.22(목) 게시되었습니다. 특별공급 11.02(월), 일반공급 1순위 11.03(화), 2순위 11.04(수), 당첨자 발표 11.10(화), 당첨자 서류접수 11.12(목)~11.16(월), 계약 11.22(일)~11.24(화)이며, 견본주택(청라동 87-1번지) GRAND OPEN은 2026.10.30(금) 예정입니다.",
      "청약은 특별공급과 일반공급으로 나뉩니다. 특별공급은 기관추천·경제자유구역·다자녀·신혼부부·생애최초·신생아·노부모부양 유형이 있고, 일반공급은 청약 자격, 통장 가입기간과 예치금, 가점제·추첨제 비율을 확인해야 합니다.",
      "신생아 특별공급 신설, 배우자 통장 가입기간 합산 등 바뀐 제도는 변경된 청약제도 페이지에 정리했습니다.",
      "최종 자격과 기준은 입주자모집공고문과 청약홈을 따르며, 일정이 바뀌면 공고문이 우선합니다.",
    ],
  },
};
