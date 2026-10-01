import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL, SOURCE_DATE, img } from "@/data/content";

export function Photo({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className={`grid place-items-center bg-forest px-6 text-center text-sm text-paper ${className}`}>
        {alt}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setOk(false)} />;
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link to="/" className="shrink-0" aria-label="청라 아크원 푸르지오 홈">
          <Photo
            src={img("/resources/img/common/logotype.svg")}
            alt="PRUGIO"
            className="h-6 w-auto"
          />
        </Link>
        <nav className="hidden flex-1 items-center justify-end gap-5 lg:flex" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <div key={item.en} className="group relative">
              <Link to={item.href} className="text-sm font-medium tracking-wide">
                {item.label}
              </Link>
              {item.children && item.children.length > 1 ? (
                <div className="invisible absolute right-0 top-full z-50 min-w-40 border border-line bg-paper py-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link key={child.href + child.label} to={child.href} className="block px-4 py-2 text-sm hover:bg-line">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
          <a href={PROJECT_PHONE_TEL} className="text-right font-serif text-sm text-forest" title="대표번호">
            <span className="block text-[10px] font-sans tracking-normal text-muted">대표번호</span>
            {PROJECT_PHONE_DISPLAY}
          </a>
        </nav>
        <button
          type="button"
          className="ml-auto grid h-11 w-11 place-items-center border border-line lg:hidden"
          aria-label={open ? "메뉴 닫기" : "전체 메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line bg-paper px-4 py-4 lg:hidden">
          {NAV.map((item) => (
            <div key={item.en} className="border-b border-line py-3">
              <p className="text-xs tracking-[0.18em] text-muted">{item.en}</p>
              {(item.children ?? [{ label: item.label, href: item.href }]).map((child) => (
                <Link
                  key={child.href + child.label}
                  to={child.href}
                  className="mt-2 block text-base"
                  onClick={() => setOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <a href={PROJECT_PHONE_TEL} className="mt-4 block font-serif text-lg text-forest">
            <span className="block font-sans text-xs text-muted">대표번호</span>
            {PROJECT_PHONE_DISPLAY}
          </a>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[180px_1fr]">
        <Photo src={img("/resources/img/common/logotype.svg")} alt="PRUGIO" className="h-6 w-auto" />
        <div className="space-y-3 text-sm leading-6 text-muted">
          <p>이 사이트의 운영·개인정보 처리자: HUMANE 운영자. 대표번호 {PROJECT_PHONE_DISPLAY}. 사업자등록번호와 주소는 확인된 자료가 없어 적지 않습니다.</p>
          <p>
            아래는 {SOURCE_DATE} 공식 홈페이지에 적힌 사업 주체이며, 이 사이트를 운영한다는 뜻이 아닙니다. 시행 ㈜청라스마트시티 · 시공 대우건설.
          </p>
          <p>CG·이미지·일부 영상은 이해를 돕기 위한 것이며 실제와 다를 수 있습니다. 개발계획은 관계기관 사정으로 변경·취소될 수 있습니다. 공식 홈페이지는 일부 이미지·영상이 AI로 제작되었다고 고지했습니다.</p>
          <p>행정구역은 공식 문안의 「서해구」 표기를 그대로 옮겼습니다. 실제 구역명과 다를 수 있어 계약 전 확인이 필요합니다.</p>
          <div className="flex flex-wrap gap-4 pt-2 text-ink">
            <Link to="/privacy" className="underline">개인정보처리방침</Link>
            <Link to="/register" className="underline">관심고객등록</Link>
            <Link to="/admin" search={{ receipt: "" }} className="underline">접수 관리</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SubHero({ en, title, crumbs }: { en: string; title: string; crumbs: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Photo
        src={img("/resources/img/common/sub_visual_img.v4.jpg")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/45" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-paper md:py-24">
        <p className="text-xs tracking-[0.28em]">{en}</p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-paper/80">{crumbs}</p>
      </div>
    </section>
  );
}

export function SourceNote({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="mx-auto max-w-6xl px-4 py-8 text-sm leading-6 text-muted">
      <p>기준일 {SOURCE_DATE}. 공식 홈페이지 공개 문안이며 변경될 수 있습니다. 분양가·입주 연도는 그 페이지에 숫자로 없습니다.</p>
      {children}
    </aside>
  );
}

export function pageHead(title: string) {
  return {
    meta: [
      { title: `${title} | 청라 아크원 푸르지오` },
      { name: "robots", content: "noindex, nofollow" },
    ],
  };
}
