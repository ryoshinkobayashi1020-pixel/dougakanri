-- SNS運用ワークボード: Supabaseスキーマ
-- Supabaseダッシュボードの SQL Editor に貼り付けて実行してください。
--
-- 実行後、Authentication > Users で以下の2ユーザーを作成してください:
--   email: shooter@dougakanri.local  / password: 撮影者チームの合言葉
--   email: editor@dougakanri.local   / password: 編集者チームの合言葉
-- 「Auto Confirm User」に必ずチェックを入れてください（メール確認をスキップするため）。
-- ※ メールアドレスは実在しなくてOK。役割の判定にこのメールアドレスを使うので、
--    上記2つと完全に同じものを使ってください。

-- クライアント（撮影者が登録する取引先）
create table if not exists clients (
  name text primary key,
  drive_url text not null default '',
  created_at timestamptz not null default now()
);

-- 案件
create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  title text not null,
  platforms text[] not null default '{}',
  drive_url text not null default '',
  reference_video_url text not null default '',
  edit_deadline timestamptz not null,
  publish_at timestamptz not null,
  youtube_hashtags text not null default '',
  tiktok_hashtags text not null default '',
  status text not null default 'requested'
    check (status in ('requested', 'editing', 'scheduled', 'completed')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- やりとり履歴
create table if not exists case_history (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references cases(id) on delete cascade,
  at timestamptz not null default now(),
  text text not null
);

alter table clients enable row level security;
alter table cases enable row level security;
alter table case_history enable row level security;

-- ログイン済みユーザー（Supabase Auth）のみ読み書き可能
create policy "clients_authenticated" on clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "cases_authenticated" on cases
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "case_history_authenticated" on case_history
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- リアルタイム更新を有効化（複数人での同時利用を想定）
alter publication supabase_realtime add table clients, cases, case_history;
