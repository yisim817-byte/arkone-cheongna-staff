# 코워크 작업지시서 — 청라 3사이트 1단계 반영 후속 작업 전부 (Search Console · IndexNow · 모니터링 · 재측정 준비)

작성 2026-10-04 10:45 KST(개정 1) · 근거: `CODE_운영반영_보고_20261004.md`(1단계 운영 반영 완료 · 확인 10항목×3사이트 통과)
대표 결정값: D1=Y(1단계 반영 완료) · D2=N(2단계 PR #2 보류) · **남은 작업은 전부 코워크가 수행** · **필요한 인증·권한은 시작 전에 한 번에 요청**
역할 분담: **코워크 = 남은 작업 전부**(Search Console 속성·소유확인·sitemap·색인 요청 · IndexNow 제출 · 운영 화면 육안 확인 · 후속 모니터링 · 재측정 준비) / Code = 병합·배포·확인(완료, 추가 작업 없음)

---

## 붙여넣을 지시문 (코워크 세션)

> 아래 「코워크 작업지시서」가 이번 작업의 유일한 기준이다. 먼저 「시작 전 인증·권한 요청」 표의 항목을 전부 한 번에 대표에게 요청하고, 모두 받은 뒤 0단계부터 6단계까지 순서대로 실행하라. 중간에 인증을 다시 묻느라 멈추지 마라. 청라 3사이트 1단계 운영 반영은 끝났고(2026-10-04 10:27 KST), 세 사이트 홈에 google-site-verification 메타와 sitemap.xml·robots.txt·IndexNow 키 파일이 올라가 있다. Google 계정은 대표 계정 하나만 쓴다. Search Console 소유확인은 「HTML 태그」만 쓰고, 화면 코드가 지시서 코드와 다르면 그 사이트만 멈추고 기록한 뒤 다음 사이트로 가라(DNS·파일 업로드 방식으로 바꾸지 마라). IndexNow는 사이트당 1회만 보내고 응답 코드를 기록하라. 사이트 코드·DNS·Vercel 설정은 건드리지 마라. 네이버 서치어드바이저는 범위 밖이다. 문의 양식은 제출하지 마라. 끝나면 결과를 `COWORK_SearchConsole_보고_20261004.md`로 저장하고, 후속 점검 일정(10-05 · 10-07 · 10-18)을 예약하거나 대표에게 알림을 요청한 뒤 5줄 요약으로 마쳐라.

---

## 1줄 결론

세 사이트에 URL 접두어 속성을 만들어 HTML 태그로 소유확인하고 sitemap 제출·역할 페이지 색인 요청(10 URL)·IndexNow 제출(3건)까지 끝내면, 2026-10-18 재측정의 기준선이 생기고 Code 쪽 남은 일은 없어집니다.

## 시작 전 인증·권한 요청 (첫 메시지에서 한 번에)

코워크는 작업을 시작하기 전에 아래 표를 그대로 대표에게 보내 **전부 한 번에** 받습니다. 하나라도 빠지면 그 항목이 필요한 단계에서 멈추게 되므로, 받기 전에는 1단계로 들어가지 않습니다.

| # | 필요한 것 | 어디에 쓰나 | 대표에게 요청할 문구 |
|---|---|---|---|
| 1 | Google 대표 계정 로그인(브라우저) | Search Console 속성 추가·소유확인·sitemap·URL 검사 | 「소유확인 코드를 발급받은 Google 계정으로 브라우저에 로그인해 주십시오. 다른 계정이면 코드가 달라 확인이 실패합니다.」 |
| 2 | 2단계 인증(OTP·휴대폰 확인) 대기 | 로그인 중 Google이 추가 확인을 요구할 때 | 「로그인 중 OTP·휴대폰 확인이 뜨면 바로 승인해 주십시오. 작업 시작 직후 1회 필요할 수 있습니다.」 |
| 3 | 셸 명령 실행 권한 + `api.indexnow.org` 네트워크 허용 | 4단계 IndexNow POST 3건 | 「curl 명령 3개를 실행할 터미널(또는 코워크 로컬 실행 권한)과 api.indexnow.org 접속 허용이 필요합니다.」 코워크 환경에 셸이 없으면: 「명령 3개를 대표 터미널에서 실행하고 응답 코드 3개를 알려 주십시오」로 대체 요청 |
| 4 | 보고서·스크린샷 저장 위치 | 6단계 보고서, 캡처 파일 | 「보고서와 스크린샷을 저장할 폴더(또는 저장소 브랜치)를 지정해 주십시오. 지정이 없으면 작업 폴더 루트에 저장합니다.」 |
| 5 | 후속 점검 예약 권한 | 10-05 · 10-07 · 10-18 재점검 | 「코워크 예약 실행(스케줄) 기능 사용을 허용해 주십시오. 없으면 세 날짜에 코워크를 다시 실행해 달라는 알림으로 대체합니다.」 |

Search Console 외 다른 서비스 로그인(Vercel·GitHub·네이버)은 이번 작업에 필요하지 않으므로 요청하지 않습니다.

## 대상

| 코드 | 속성 URL(URL 접두어, 이 값 그대로 입력) | 한글 도메인 | google-site-verification(홈 `<head>`에 반영 중) | sitemap | 역할 페이지(색인 요청 대상) | IndexNow 키 |
|---|---|---|---|---|---|---|
| S1 | `https://www.xn--oi2b90bo0vusdbte57o.site/` | www.푸르지오청라.site | `TfTytsz2e4bDSPQ4gKBUt30vHIk68OFJEHuYbUtt5Bk` | `sitemap.xml` (3 URL) | `/` · `/location` · `/contact` | `c05a05dafb41834b740c5ddaaa062749` |
| S2 | `https://xn--2w2b25ugxct7o.site/` | 푸르지오.site (www 없음) | `NvrPz-qoa4YWNDb033ep9P5Bz5c6MN_L2D9MIWzqcxg` | `sitemap.xml` (3 URL) | `/` · `/overview` · `/brand` | `b70969d3638b1673378865e1045cc759` |
| S3 | `https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site/` | www.아크원푸르지오청라.site | `VyWMGzSGyRh9Cc4HnybaKVy8wEM2L9StUzVoTF50HIs` | `sitemap.xml` (4 URL) | `/` · `/changeinfo` · `/docspecial` · `/docnormal` | `959c86105879d5c0fb0f058d1ca59dee` |

- 속성은 **URL 접두어**로 만듭니다(도메인 속성은 DNS 변경이 필요해 범위 밖). 입력값은 canonical과 같은 punycode 형태입니다. Search Console이 한글로 바꿔 보여 줘도 그대로 둡니다.
- S2는 www 없는 호스트가 정규 호스트입니다. `https://www.xn--2w2b25ugxct7o.site/`로 만들지 않습니다.
- 역할 페이지 외의 경로(/register, /premium, /news 등)는 `noindex`이므로 색인 요청하지 않습니다.
- IndexNow 키 파일은 `<속성 URL><키>.txt`에 올라가 있고 내용 = 키임을 Code가 확인했습니다.

## 금지

- Google 계정 2개 이상 사용, 다른 사람 계정 사용
- 소유확인 방법을 HTML 태그 외(DNS 레코드·HTML 파일 업로드·Google 애널리틱스·태그 관리자)로 바꾸는 것
- 사이트 코드·Vercel·DNS·도메인 설정 변경 (코드가 다르면 기록만 하고 Code에 넘김)
- Search Console 「삭제」 도구(URL 삭제 요청) 사용
- noindex 페이지 색인 요청, 하루 할당량(속성당 약 10건)을 넘기는 반복 요청
- IndexNow 사이트당 2회 이상 전송(실패 시 재시도 1회까지)
- 네이버 서치어드바이저·Bing 웹마스터 등록 (대표가 따로 결정하기 전까지 보류)
- 문의 양식(/register) 실제 제출
- PR #2 병합·브랜치 조작 (D2=N)

---

## 0단계. 사전 확인 (변경 없음)

| 확인 | 방법 | 기준 | 다르면 |
|---|---|---|---|
| Google 로그인 계정 | search.google.com/search-console 접속 후 우상단 프로필 | 대표 계정 | 「시작 전 인증」 #1 재요청 후 진행 |
| 운영 화면 3곳 | 각 사이트 홈을 모바일 폭(약 390px)과 데스크톱으로 열기 | Hero 아래 「한눈에 보기」 문단과 「출처: 사업주체 공개자료(arkone-prugio.com) · 기준일 2026.09.17」 줄이 보임, 전화번호 S1 1666-6799 · S2 1533-9014 · S3 1666-4250 | 스크린샷 저장 후 기록, 계속 진행 |
| 소유확인 메타 노출 | 각 홈에서 페이지 소스 보기 → `google-site-verification` 검색 | 위 표의 코드와 일치 | 그 사이트 1단계 보류·기록 |
| sitemap·robots·키 파일 | `<속성 URL>sitemap.xml`, `robots.txt`, `<키>.txt` 열기 | sitemap은 역할 페이지 URL 목록, robots는 `Allow: /` + Sitemap 줄, 키 파일 내용 = 키 | 기록 후 계속 |

스크린샷은 사이트별 홈(모바일) 1장씩 저장합니다. 파일명 `s1_home_m.png` 형식.

## 1단계. S1 등록

1-a 속성 추가
- Search Console 좌상단 속성 선택 → 「속성 추가」 → **URL 접두어** → `https://www.xn--oi2b90bo0vusdbte57o.site/` 입력 → 계속.

1-b 소유확인(HTML 태그)
- 확인 방법 중 「HTML 태그」 펼치기 → 표시된 `<meta name="google-site-verification" content="…">`의 content 값을 위 표의 S1 코드와 **글자 단위로 비교**.
- 같으면 → 「확인」 클릭 → 「소유권이 확인되었습니다」 확인 → 스크린샷 `s1_verify.png`.
- 다르면 → 「확인」을 누르지 말고 화면 코드를 기록하고 S1은 1-c 이하를 건너뜁니다(새 코드 반영은 Code가 PR로 처리). S2·S3는 계속 진행합니다.
- 「확인에 실패했습니다」가 나오면 → 1회만 재시도(배포 직후 캐시 지연 가능). 두 번째도 실패하면 오류 문구를 기록하고 다음 사이트로 갑니다.

1-c sitemap 제출
- 좌측 「Sitemaps」 → 「새 사이트맵 추가」에 `sitemap.xml` 입력 → 제출.
- 상태가 「성공」이면 「발견된 URL」 수 기록(3이어야 함). 「가져올 수 없음」·「대기 중」이면 그대로 기록하고 다음 단계로 갑니다(5단계 재점검에서 다시 확인).

1-d URL 검사·색인 요청 (역할 페이지만)
- 상단 검색창에 역할 페이지 URL을 하나씩 입력 → 「URL이 Google에 등록되어 있지 않음」 확인(신규 속성이라 정상) → 「실제 URL 테스트」 → 「색인 생성 요청」 → 「색인 생성 요청됨」 확인.
- S1은 3 URL: `https://www.xn--oi2b90bo0vusdbte57o.site/`, `…/location`, `…/contact`.
- 실제 URL 테스트 결과의 「페이지 가져오기: 성공」, 「색인 생성 허용: 예」를 함께 기록합니다. 「아니요」가 나오면 캡처 후 기록(Code 전달 사항).

1-e 기준선 기록
- 「실적」 보고서는 신규 속성이라 비어 있습니다. 「기준선: 노출 0 · 클릭 0 · 속성 신설 2026-10-04」로 기록합니다.
- 「설정 → robots.txt」 보고서가 보이면 가져오기 상태를 기록합니다(배포 직후에는 비어 있을 수 있음).

## 2단계. S2 등록
1단계와 같은 순서로 `https://xn--2w2b25ugxct7o.site/`, 코드 `NvrPz-qoa4YWNDb033ep9P5Bz5c6MN_L2D9MIWzqcxg`, 역할 페이지 `/` · `/overview` · `/brand`(3 URL).

## 3단계. S3 등록
1단계와 같은 순서로 `https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site/`, 코드 `VyWMGzSGyRh9Cc4HnybaKVy8wEM2L9StUzVoTF50HIs`, 역할 페이지 `/` · `/changeinfo` · `/docspecial` · `/docnormal`(4 URL).

## 4단계. IndexNow 제출 (코워크 필수)

Code 세션은 네트워크 정책으로 `api.indexnow.org`에 닿지 못해 미제출입니다. 코워크가 아래 3개를 **사이트당 1회만** 실행하고 응답 코드를 기록합니다. 200 또는 202 = 성공, 403 = 키 파일 불일치, 422 = host·URL 불일치. 실패 시 재시도는 1회까지. 셸이 없으면 「시작 전 인증」 #3의 대체 요청으로 대표가 실행한 응답 코드를 받아 기록합니다. 어느 쪽이든 보고서에 「실행 주체」를 적습니다.

```bash
# S1
curl -sS -o /dev/null -w "IndexNow S1 %{http_code}\n" -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host":"www.xn--oi2b90bo0vusdbte57o.site","key":"c05a05dafb41834b740c5ddaaa062749","keyLocation":"https://www.xn--oi2b90bo0vusdbte57o.site/c05a05dafb41834b740c5ddaaa062749.txt","urlList":["https://www.xn--oi2b90bo0vusdbte57o.site","https://www.xn--oi2b90bo0vusdbte57o.site/location","https://www.xn--oi2b90bo0vusdbte57o.site/contact"]}'
# S2
curl -sS -o /dev/null -w "IndexNow S2 %{http_code}\n" -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host":"xn--2w2b25ugxct7o.site","key":"b70969d3638b1673378865e1045cc759","keyLocation":"https://xn--2w2b25ugxct7o.site/b70969d3638b1673378865e1045cc759.txt","urlList":["https://xn--2w2b25ugxct7o.site","https://xn--2w2b25ugxct7o.site/overview","https://xn--2w2b25ugxct7o.site/brand"]}'
# S3
curl -sS -o /dev/null -w "IndexNow S3 %{http_code}\n" -X POST https://api.indexnow.org/indexnow \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host":"www.xn--oi2b90bg5twzasy72k38fc1ipxj.site","key":"959c86105879d5c0fb0f058d1ca59dee","keyLocation":"https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site/959c86105879d5c0fb0f058d1ca59dee.txt","urlList":["https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site","https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site/changeinfo","https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site/docspecial","https://www.xn--oi2b90bg5twzasy72k38fc1ipxj.site/docnormal"]}'
```

## 5단계. 후속 모니터링 예약 (코워크)

| 시점 | 할 일 | 기록 |
|---|---|---|
| D+1 · 2026-10-05 | 세 속성 Sitemaps 상태 재확인(「성공」·발견 URL 3·3·4) | 상태·발견 수 |
| D+3 · 2026-10-07 | 역할 페이지 10개 URL 검사 → 「Google에 등록됨」 여부, 「페이지 색인 생성」 보고서의 색인 수 | 등록된 URL 수 |
| 수시 | 사업주체 사이트(arkone-prugio.com) 공고·일정 메뉴 확인 → 입주자모집공고 게시 여부 | 게시되면 「반영됨 · 근거 미확인」 문구(10.15 공고일 · 10.23 GRAND OPEN · 3개동 44층 · /docnormal 비규제지역)와 공고문을 대조한 표 작성 → 대표·Code 보고(수정은 Code가 PR) |
| D+14 · 2026-10-18 | 재측정: 속성별 실적(노출·클릭·주요 쿼리) · 색인 생성된 페이지 수 · sitemap 발견/색인 수 · 역할 페이지 10개 등록 여부 | 기준선(10-04)과 비교표 |

예약 실행 기능이 있으면 세 날짜에 「COWORK_작업지시서_SearchConsole_20261004.md 5단계 실행」으로 예약합니다. 없으면 보고서 끝에 「대표가 10-05 · 10-07 · 10-18에 코워크를 다시 실행해 주십시오」를 적습니다.

## 6단계. 보고서

`COWORK_SearchConsole_보고_20261004.md`에 아래를 남깁니다.

1. 1줄 결론
2. 인증·권한 수령 표: 요청 시각 · 수령 시각 · 미수령 항목
3. 사이트별 표: 속성 URL · 소유확인 결과(성공/실패/코드 불일치, 시각) · sitemap 상태와 발견된 URL 수 · 색인 요청 URL 수 · 「색인 생성 허용」 값 · 스크린샷 파일명
4. IndexNow 표: 사이트 · URL 수 · 응답 코드 · 실행 주체(코워크/대표)
5. 멈춘 사이트가 있으면 사유와 화면 문구·캡처
6. 기준선: 사이트별 노출·클릭(모두 0 예상) · 기록 시각 · 후속 점검 예약 결과(10-05 · 10-07 · 10-18)
7. VERIFIED / SUPPORTED / INFERRED / UNKNOWN 구분

## 통과 기준

| 항목 | 기준 |
|---|---|
| 인증 | 시작 전 요청 1회로 전부 수령, 중간 재요청 0회 |
| 속성 | 3개 모두 URL 접두어 · punycode 호스트 · S2는 www 없음 |
| 소유확인 | 3개 모두 HTML 태그로 「확인됨」 (코드 불일치는 기록·보고) |
| sitemap | 3개 모두 제출됨. 「성공」이면 발견 URL 3·3·4 |
| 색인 요청 | 총 10 URL 「색인 생성 요청됨」, 「색인 생성 허용: 예」 |
| IndexNow | 3건 모두 200/202, 사이트당 전송 1회(재시도 포함 최대 2회) |
| 스크린샷 | 홈(모바일) 3장 + 소유확인 3장 이상 |
| 후속 예약 | 10-05 · 10-07 · 10-18 예약 등록 또는 대표 알림 요청 명시 |

## WHAT IF

- 소유확인·sitemap·색인 요청·IndexNow가 끝나면 Google은 두 갈래(sitemap + 색인 요청), Bing·네이버 계열은 IndexNow로 역할 페이지 10개를 발견하는 경로가 열립니다. 신규 속성은 색인까지 보통 수일이 걸리므로 10-18 재측정에서 「색인 생성됨」 여부와 첫 노출 쿼리를 보는 것이 목표입니다. 노출·순위를 보장하는 작업은 아닙니다.
- 소유확인이 되면 수동 조치·색인 오류 알림이 대표 계정으로 오므로 운영 리스크 대응 속도가 올라갑니다.

## RISK

| 리스크 | 내용 | 대응 |
|---|---|---|
| 소유확인 코드 불일치 | 사이트에 넣은 코드는 특정 Google 계정에서 발급된 값. 다른 계정으로 로그인하면 화면 코드가 달라 확인 실패 | 시작 전 인증 #1에서 계정 특정. 불일치면 기록 후 Code가 새 코드 반영 PR |
| 인증 지연 | OTP·로그인 승인이 늦으면 작업이 멈춤 | 시작 전 한 번에 요청, 대표 대기 시간 확보 |
| 사실 근거 | 역할 페이지 「한눈에 보기」에 「반영됨 · 근거 미확인」 문구가 색인 요청 대상에 포함 | 대표 승인 범위. 5단계 공고 대조로 후속 |
| 할당량 | URL 검사 색인 요청은 속성당 하루 약 10건 | 역할 페이지만 요청, 반복 클릭 금지 |
| sitemap 지연 | 제출 직후 「가져올 수 없음」·「대기 중」이 뜰 수 있음 | 오류로 보지 말고 기록, D+1 재점검 |
| IndexNow 중복 | 재시도 반복 시 과다 전송 | 사이트당 1회, 재시도 1회 한도 |
| 범위 이탈 | 네이버·Bing 등록, DNS 변경 유혹 | 금지 항목 준수, 필요하면 대표 별도 결정 |

## ASK (대표)

1. 코워크 세션에 위 「붙여넣을 지시문」과 이 문서를 넣어 실행해 주십시오.
2. 코워크가 첫 메시지로 보내는 「시작 전 인증·권한 요청」 5개를 한 번에 처리해 주십시오(Google 대표 계정 로그인 · OTP 승인 · 셸/네트워크 또는 대표 실행 · 저장 위치 · 예약 권한).
3. 코워크 보고서가 오면 Code에 전달해 주십시오. 코드 불일치·「색인 생성 허용: 아니요」가 있으면 Code가 수정 PR을 준비합니다.
