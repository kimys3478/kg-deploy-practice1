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

주의: 로컬 확인 때 `--persist-to`로 상태 폴더를 프로젝트 밖에 둔다. `assets.directory`가 `.`이라 `wrangler dev`가 프로젝트 안의 `.wrangler/state` 변경까지 감지해 끝없이 재시작한다(2026-10-10 확인: 332회 재시작, 응답 없음).

원칙: Workers 관련 작업 전에는 developers.cloudflare.com 최신 문서를 확인한다.
