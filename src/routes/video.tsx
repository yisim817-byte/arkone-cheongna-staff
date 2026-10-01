import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SourceNote, SubHero, pageHead } from "@/components/layout";

export const Route = createFileRoute("/video")({
  head: () => pageHead("홍보영상"),
  component: Page,
});

const YT = "_wAuOJSTLek";

function Page() {
  const [play, setPlay] = useState(false);
  return (
    <Shell>
      <SubHero en="MEDIA" title="홍보영상" crumbs="홍보센터 / 홍보영상" />
      <article className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-sm leading-6 text-muted">
          공식 목록 카드의 제목과 날짜는 비어 있었습니다. 유튜브에 올라간 제목은 「구라의 팩트체크 in 청라 아크원 푸르지오 ㅣ 임우일의 긴급 인터뷰! 청라의 미래는?!」이고, 채널명은 청라 아크원 푸르지오입니다. 빈 카드 제목과 유튜브 제목을 같은 것으로 두지 않습니다.
        </p>
        <div className="mt-8 aspect-video bg-ink">
          {play ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${YT}?autoplay=1&rel=0&playsinline=1`}
              title="청라 아크원 홍보영상"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button type="button" className="relative h-full w-full" onClick={() => setPlay(true)}>
              <img
                src={`https://img.youtube.com/vi/${YT}/maxresdefault.jpg`}
                alt="영상 썸네일"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 grid place-items-center bg-ink/30 text-sm text-paper">재생</span>
            </button>
          )}
        </div>
        <p className="mt-4 text-sm text-muted">홈 화면의 폴백 주소는 youtu.be/{YT} 입니다. 영상 권리와 AI 제작 여부는 이 카드만으로 확인되지 않았습니다.</p>
      </article>
      <SourceNote />
    </Shell>
  );
}
