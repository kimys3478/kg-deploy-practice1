-- 노래 카드 하트 수. D1 데이터베이스 portfolio-likes 에 적용:
--   운영:  npx wrangler d1 execute portfolio-likes --remote --file src/schema.sql
--   로컬:  npx wrangler d1 execute portfolio-likes --local --persist-to "$env:TEMP\wrangler-portfolio-state" --file src/schema.sql
CREATE TABLE IF NOT EXISTS likes (
  song_id TEXT PRIMARY KEY,                       -- 유튜브 영상 ID (data.js의 SONGS 링크에서 뽑음)
  count   INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0)
);
