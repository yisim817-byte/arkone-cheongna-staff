import { createFileRoute } from "@tanstack/react-router";
import { Shell, pageHead } from "@/components/layout";
import { RoleHome } from "@/components/role";

export const Route = createFileRoute("/")({
  head: () => pageHead("청라 아크원 푸르지오", "/"),
  component: Home,
});

/** 홈 화면. 사이트마다 다른 내용은 src/data/role.ts 에서 온다. */
function Home() {
  return (
    <Shell>
      {/* 작업지시서 31: 첫 팝업은 /ark-popup-wo30.js. OtPopups 파일은 두고 렌더만 끈다. */}
      <RoleHome />
    </Shell>
  );
}
