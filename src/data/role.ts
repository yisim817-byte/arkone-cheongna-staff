import type { Role, RoleFigure, StripCell } from "./role-types";

/**
 * 이 사이트의 첫 화면 데이터 (A · 아크원푸르지오청라.site · 역할: 청약·공급·일정).
 * 세 저장소에서 이 파일만 내용이 다르다. 숫자와 일정은 사실 원장에 있는 값만 쓴다.
 */

/**
 * 10월 15일·23일 일정의 1차 출처(사업주체 공지 또는 입주자모집공고)를 총괄 PM이 확인하면 true로 바꾼다.
 * false인 동안에는 달력의 날짜 표시와 일정 띠의 일자를 화면에 올리지 않는다.
 * 입주자모집공고가 나오면 아래 띠의 값을 공고문 값으로 바꾼다.
 */
export const SCHEDULE_CONFIRMED: boolean = true;

const FIGURE_CONFIRMED: RoleFigure = {
  kind: "calendar",
  year: 2026,
  month: 10,
  marks: [
    { day: 15, style: "fill", label: "15일(목) 입주자모집공고 예정" },
    { day: 23, style: "ring", label: "23일(금) GRAND OPEN 예정" },
  ],
  alt: "2026년 10월 달력. 15일 입주자모집공고 예정, 23일 GRAND OPEN 예정",
};

const FIGURE_PENDING: RoleFigure = {
  kind: "month",
  year: 2026,
  month: 10,
  status: "OPEN 예정",
  note: "일정은 사업주체 사정에 따라 변경될 수 있습니다.",
  alt: "2026년 10월 OPEN 예정",
};

const STRIP_CONFIRMED: StripCell[] = [
  {
    no: "1",
    label: "입주자모집공고",
    chip: { kind: "soon", text: "예정" },
    value: "10.15",
    unit: "목",
    desc: "사업주체 사정에 따라 변경될 수 있습니다.",
  },
  {
    no: "2",
    label: "GRAND OPEN",
    chip: { kind: "soon", text: "예정" },
    value: "10.23",
    unit: "금",
    desc: "견본주택 청라동 87-1번지",
  },
  {
    no: "3",
    label: "청약 접수",
    chip: { kind: "tbd", text: "공고 후 확정" },
    value: "공고 후 안내",
    desc: "특별공급과 일반공급",
  },
  {
    no: "4",
    label: "당첨자 발표·계약",
    chip: { kind: "tbd", text: "공고 후 확정" },
    value: "공고 후 안내",
    desc: "입주자모집공고와 청약홈 기준",
  },
];

const STRIP_PENDING: StripCell[] = [
  {
    label: "입주자모집공고",
    chip: { kind: "soon", text: "예정" },
    value: "공고 전",
    desc: "일정은 사업주체 사정에 따라 변경될 수 있습니다.",
  },
  {
    label: "GRAND OPEN",
    chip: { kind: "soon", text: "예정" },
    value: "10월",
    desc: "견본주택 청라동 87-1번지",
  },
  {
    label: "청약 접수",
    chip: { kind: "tbd", text: "공고 후 확정" },
    value: "공고 후 안내",
    desc: "특별공급과 일반공급",
  },
  {
    label: "당첨자 발표·계약",
    chip: { kind: "tbd", text: "공고 후 확정" },
    value: "공고 후 안내",
    desc: "입주자모집공고와 청약홈 기준",
  },
];

export const ROLE: Role = {
  tone: "paper",
  h1: ["청라 아크원 푸르지오", "청약 일정·공급 안내"],
  heroLink: { to: "/changeinfo", label: "청약안내 보기" },
  figure: SCHEDULE_CONFIRMED ? FIGURE_CONFIRMED : FIGURE_PENDING,
  strip: SCHEDULE_CONFIRMED ? STRIP_CONFIRMED : STRIP_PENDING,
  stripSource: [
    { k: "최종 기준", v: "입주자모집공고, 청약홈" },
    { k: "안내", v: "예정 일정이며 확정 일정이 아닙니다." },
  ],
  main: {
    kind: "subscription",
    title: ["청약 전에", "확인할 세 가지"],
    lead: "최종 자격과 기준은 입주자모집공고와 청약홈을 따릅니다.",
  },
  sections: ["overview", "location", "premium", "contact"],
};
