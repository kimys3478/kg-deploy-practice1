# 김윤선 포트폴리오

키글(Kigle)에서 동요 음원 기획과 다국어(KR · JA · PT) 번역·더빙을 맡고 있는 김윤선의 업무 소개 페이지예요.
빌드 과정이 없는 정적 사이트(HTML · CSS · JS · 이미지)예요. Wrangler로 Cloudflare Workers에 배포하고(공유용 주소 **https://portfolio.kimys3478.workers.dev**), 같은 리포가 Vercel에도 자동 배포돼요. 노래 미리듣기(R2)와 하트(D1)는 Cloudflare 주소에서만 동작해요.

## 파일 구성

| 파일 | 역할 | 이럴 때 고쳐요 |
| --- | --- | --- |
| `data.js` | 페이지 텍스트 대부분: 업무 폴더 6개 상세, COLLABORATION 카드, 노래 목록, 플레이어 곡, 오늘의 언어 가사, 도구 아이콘 링크, AI MAP, 메일 주소, "Claude에게 묻기" 질문 | 문구 · 곡 · 링크를 바꿀 때 (대부분 여기만) |
| `index.html` | 페이지 뼈대와 고정 문구: 첫 화면 소개, 업무 6개 카드, 섹션 제목, about-yoonsun.txt, 하단 이름 · 직함 | 섹션 제목, 소개 글, 하단 문구 |
| `styles.css` | 디자인 (색, 글꼴, 배치, 모바일 화면) | 모양을 바꿀 때 |
| `script.js` | 동작 (위젯 드래그, 시계, 플레이어, 폴더 창, 겹쳐 쌓이는 폴더로 이동하는 링크, 마우스 오버 안내) | 동작을 바꿀 때 |
| `assets/` | 이미지 (폴더 아이콘, 앨범 커버, 노래 썸네일, The Lab 화면) | 이미지 교체 |
| `tools/build_share.py` | 위 파일들을 메일로 보내기 좋은 HTML 하나(`dist/김윤선_포트폴리오.html`)로 묶는 스크립트 | 공유용 파일이 필요할 때 |
| `src/worker.js` | Cloudflare Worker: `/preview/파일명`은 R2에서 30초 음원을, `/api/likes`는 D1에서 하트 수를 꺼내 줘요. 나머지 경로는 정적 파일 그대로 | 미리듣기·하트 동작을 바꿀 때 |
| `src/schema.sql` | 하트 표(`likes`) 구조 | 새 D1에 표를 만들 때 |
| `wrangler.jsonc` | Cloudflare 배포 설정 (Worker 이름 `portfolio`, R2 `portfolio-songs`, D1 `portfolio-likes`) | 바인딩을 추가할 때 |
| `.assetsignore` · `.vercelignore` | 각각 Cloudflare · Vercel에 올리지 않을 파일 목록 (설정 파일, Worker 코드, README 등) | 루트에 새 설정 파일을 만들 때 둘 다 |
| `CLAUDE.md` | 배포·로컬 확인 명령과 주의사항 (Claude Code가 참고) | 배포 방식이 바뀔 때 |

- 프로필 사진은 `assets/profile.jpg`라는 이름으로 넣으면 첫 화면과 The Lab 카드에 나타나요. (아직 없음)

## 페이지 구성

1. **첫 화면 (데스크톱):** 세계 시계, 미팅 캘린더(누르면 Google 캘린더 예약 페이지), 노래 플레이어, 오늘의 언어, 업무 폴더 01~06, 내가 쓰는 도구, 소개 문장과 Claude · ChatGPT에게 묻기 · 메일 버튼 (메일은 주소 복사 + Gmail/메일 앱 선택)
2. **하단 독:** 처음으로 · 업무 · 작업 · YOONSUN's LAB · 소개 · 메일
3. **이런 일을 하고 있어요:** 업무 6개
4. **COLLABORATION:** 함께 일하는 팀과 파트너 (IN-HOUSE · PARTNER)
5. **겹쳐 쌓이는 폴더:** 노래 아카이브 → YOONSUN's LAB → AI MAP
6. **about-yoonsun.txt:** THEN · NOW · THE FUTURE
7. **하단:** 김윤선 · Content Manager, Global Team, Kigle

## 로컬에서 보기

```bash
python -m http.server 8765
```

리포 맨 위 폴더에서 실행한 뒤 브라우저로 `http://localhost:8765`를 열어요.

## 배포

### Cloudflare Workers (주 배포, Wrangler)

```bash
npm run deploy
```

- 주소: **https://portfolio.kimys3478.workers.dev** · 계정 kimys3478@gmail.com · Worker 이름 `portfolio`
- Wrangler는 이 프로젝트 안에만 설치돼 있어요(`npm i -D wrangler`). 처음 쓰는 PC에서는 `npm install` 후 `npx wrangler login`.
- 로컬 확인: `npm run preview -- --persist-to "$env:TEMP\wrangler-portfolio-state"` → `http://localhost:8787`. (`--persist-to` 없이 띄우면 프로젝트 안 `.wrangler/state` 변경을 감지해 끝없이 재시작해요.)
- 미리듣기 음원은 R2 버킷 `portfolio-songs`에 있어요. 올리기: `npx wrangler r2 object put portfolio-songs/<파일명> --file <경로> --content-type audio/mpeg --remote`
- 하트 수는 D1 `portfolio-likes`에 있어요. 보기: `npx wrangler d1 execute portfolio-likes --remote --command "SELECT * FROM likes"`
- 순서: 파일 수정 → 배포 → 커밋 → push. 자세한 명령은 `CLAUDE.md`.

### Vercel (자동, 보조)

- GitHub `main`에 push하면 자동 재배포돼요(`https://kg-deploy-practice1.vercel.app`).
- Worker·R2·D1이 없어서 미리듣기는 소리 없이 타이머만 돌고, 하트는 자동으로 숨겨져요. 화면·문구는 Cloudflare와 같아요.
- Vercel은 리포 전체를 공개하므로 `.vercelignore`로 `src`·설정 파일을 제외해요.

## 버전 기록

| 버전 | 날짜 | 바꾼 내용 |
| --- | --- | --- |
| 30 | 2026-10-11 | `.vercelignore` 추가 — Vercel 주소에서 `/src/worker.js` 등 서버 코드·설정 파일이 열리던 것 차단. README 배포 안내를 Cloudflare Workers(Wrangler) 기준으로 갱신 |
| 29 | 2026-10-11 | 첫 화면 플레이어를 헬로 코코비 한 곡으로. 30초가 끝나면 다음 곡 대신 멈추고 0:00으로, 이전/다음은 같은 곡 처음부터 |
| 28 | 2026-10-10 | Cloudflare Web Analytics 스니펫 추가 (쿠키 없음, Vercel 방문도 같은 통계에 합산) |
| 27 | 2026-10-10 | 노래 카드 하트 — D1 `portfolio-likes`, `GET/POST /api/likes`, 카드를 YouTube 링크 + 하트 줄로 분리, 누른 곡은 브라우저가 기억, API 없는 배포(Vercel)에선 숨김 |
| 26 | 2026-10-10 | 헬로 코코비 30초 미리듣기 — R2 `portfolio-songs` + `src/worker.js`(`/preview/*`, Range·ETag), 플레이어를 진짜 `<audio>` 재생으로 |
| 25 | 2026-10-10 | Cloudflare Workers 배포 설정 — Wrangler 4.149 프로젝트 안 설치, `wrangler.jsonc`(Worker `portfolio`), `.assetsignore`, `CLAUDE.md`. 첫 배포 https://portfolio.kimys3478.workers.dev |
| 24 | 2026-10-10 | 메뉴바 순서를 하단 독과 같게 변경 (업무 · 작업 · YOONSUN's LAB · 소개 · 메일) |
| 23 | 2026-10-10 | ChatGPT에게 묻기 다시 추가 (첫 화면·하단), 캘린더 "미팅 잡기"를 Google 캘린더 예약 페이지로 연결, THEN 문구를 방송 작가 이력 한 문장으로 변경, 업무 폴더를 카드 6개 기준으로 재구성(음원 기획 · 다국어 현지화(번역+더빙) · 음원 발매 · 파트너 관리 · 글로벌 스토어 운영 · 사업 지원)하고 카드를 누르면 같은 폴더가 열리게 함, 하단 독 순서(업무 · 작업 · YOONSUN's LAB · 소개 · 메일)와 연결 변경 |
| 22 | 2026-10-10 | ChatGPT에게 묻기 삭제, 메일·미팅 잡기를 주소 복사 + Gmail/메일 앱 선택으로 변경, The Lab → YOONSUN's LAB, 노래 아카이브 문구, 폴더 창 "완성 기준", THEN에 방송 작가 이력 추가, 하단 직함에 Kigle 추가, 모바일 폴더 안내 |
| 21 | 2026-10-09 | 업무 폴더 상세 창의 "초안이에요" 안내 문구 삭제 |
| 20 | 2026-10-09 | 하단 직함 → Content Manager, Global Team |
| 19 | 2026-10-09 | AI MAP 문구 수정, 하단 "노래 아카이브" 링크가 AI MAP으로 가던 문제 수정, Claude · ChatGPT에게 묻기 · 메일 · 도구 아이콘 링크 연결 |
| 18 | 2026-10-09 | 업무 폴더 01~06 번호와 마우스 오버 안내, 폴더 6개 상세 문구 교체, COLLABORATION, 일하는 방식 섹션을 노래 아카이브 · The Lab · AI MAP 폴더로 교체, about-yoonsun.txt 문구 교체 |
| 17 | 2026-10-09 | 담당 언어 KR · JA · PT로 통일, 업무 흐름 · 결과물 정리, 협업 카드 추가 |
| 16 | 2026-10-08 | 첫 커밋. 위젯 첫 화면, 업무 6개, 일하는 방식 4가지, 노래 아카이브, The Lab |

Made with Claude · © 2026 김윤선
