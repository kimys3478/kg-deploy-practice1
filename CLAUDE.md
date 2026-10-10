# CLAUDE.md

## Cloudflare 배포

이 프로젝트는 빌드 과정 없는 정적 사이트이고, Wrangler(프로젝트 안에 설치)로 Cloudflare Workers에 배포한다.

- Worker 이름: `portfolio` → `https://portfolio.kimys3478.workers.dev`
- 설정 파일: `wrangler.jsonc` (`assets.directory`가 `.` = 프로젝트 루트 전체)
- 업로드 제외 목록: `.assetsignore` — 새 파일·폴더를 루트에 추가했는데 사이트에 필요 없거나 공개되면 안 되면 여기에 추가한다.

| 하는 일 | 명령 |
| --- | --- |
| 로컬 확인 (Cloudflare 환경, 기본 http://localhost:8787) | `npm run preview -- --persist-to "$env:TEMP\wrangler-portfolio-state"` (= `npx wrangler dev`) |
| 배포 전 점검 (업로드 없음) | `npx wrangler deploy --dry-run` |
| 배포 | `npm run deploy` (= `npx wrangler deploy`) |
| 로그인 계정 확인 | `npx wrangler whoami` |

### R2 노래 미리듣기

- 버킷 `portfolio-songs` (바인딩 `SONGS`). `src/worker.js`가 `/preview/<파일명>`을 R2에서 꺼내 준다(Range·ETag 지원). 나머지 경로는 정적 파일.
- 곡에 음원 붙이기: `data.js`의 `PLAYER_SONGS` 항목에 `preview: "<파일명>"` 추가. 현재는 헬로 코코비만.
- 업로드(운영): `npx wrangler r2 object put portfolio-songs/<파일명> --file <경로> --content-type audio/mpeg --cache-control "public, max-age=31536000, immutable"`
- 업로드(로컬 확인용): 위 명령에 `--local --persist-to "$env:TEMP\wrangler-portfolio-state"` 추가. 로컬 R2는 운영과 별개라 따로 넣어야 소리가 난다.
- 음원 원본은 저장소에 넣지 않는다(`week2` 폴더 등 바깥에 둔다).

### D1 노래 카드 하트

- 데이터베이스 `portfolio-likes` (바인딩 `LIKES`), 표 구조 `src/schema.sql`. 새 환경에 적용: `npx wrangler d1 execute portfolio-likes --remote --file src/schema.sql`
- API(`src/worker.js`): `GET /api/likes` → `{영상ID: 수}`, `POST /api/likes/<영상ID>` 본문 `{"delta": 1|-1}` → `{count}`. 0 아래로 안 내려간다.
- 프런트(`script.js`): 숫자는 서버 값, 내가 누른 곡은 `localStorage.likedSongs`. API가 404면(`Vercel`) `#songGrid.no-likes`로 하트를 숨긴다.
- 로컬 확인 전 로컬 D1에도 표를 만들어야 한다: 위 명령에 `--local --persist-to "$env:TEMP\wrangler-portfolio-state"`.
- 하트 수 보기: `npx wrangler d1 execute portfolio-likes --remote --command "SELECT * FROM likes"`

### Web Analytics

- `index.html` 맨 아래의 Cloudflare Web Analytics 스니펫(beacon.min.js). 대시보드 → Web Analytics → 사이트 `portfolio.kimys3478.workers.dev`에서 본다.
- 토큰은 공개용 식별자라 HTML에 그대로 둬도 된다. 같은 HTML이 Vercel에도 올라가므로 Vercel 방문도 함께 집계된다(호스트명으로 구분).

### Vercel (같은 저장소를 보는 두 번째 배포)

- Vercel은 GitHub `main`을 push할 때마다 자동 배포한다(`https://kg-deploy-practice1.vercel.app`). 코드는 같지만 Worker·R2·D1이 없어서 미리듣기는 소리 없이 타이머만, 하트는 자동 숨김(`/api/likes` 404 감지). 공유용 주소는 Cloudflare 쪽을 쓴다.
- `.vercelignore`: Vercel은 저장소 전체를 공개하므로 `src`(Worker 코드·schema.sql)·`wrangler.jsonc`·`package.json` 등을 제외한다. 2026-10-11에 `/src/worker.js`가 Vercel 주소에서 열리는 걸 확인하고 추가했다. 새 설정 파일을 루트에 만들면 `.assetsignore`와 `.vercelignore` 둘 다에 넣는다.

주의: 로컬 확인 때 `--persist-to`로 상태 폴더를 프로젝트 밖에 둔다. `assets.directory`가 `.`이라 `wrangler dev`가 프로젝트 안의 `.wrangler/state` 변경까지 감지해 끝없이 재시작한다(2026-10-10 확인: 332회 재시작, 응답 없음).

원칙: Workers 관련 작업 전에는 developers.cloudflare.com 최신 문서를 확인한다.
