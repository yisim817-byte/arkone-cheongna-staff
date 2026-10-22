import { createFileRoute } from "@tanstack/react-router";
import { NoticePlans } from "@/components/notice-sections";
import { Shell, SourceNote, SubHero, pageHead } from "@/components/layout";

// PM 지시(2026-10-22): 평면도와 공급금액을 한 페이지에서. 평면 2장 → 바로 아래 공급금액표(/changeinfo 와 같은 내용).
export const Route = createFileRoute("/plans")({
  head: () => pageHead("평면·분양가"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="PLANS" title="평면·분양가" crumbs="평면·분양가" />
      <NoticePlans />
      <SourceNote />
    </Shell>
  );
}
