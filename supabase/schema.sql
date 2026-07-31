-- SNS運用ワークボード: Supabaseスキーマ
-- Supabaseダッシュボードの SQL Editor に貼り付けて実行してください。
--
-- 実行後、Authentication > Users で撮影者用ユーザーを作成してください:
--   email: shooter@dougakanri.local  / password: 撮影者チームの合言葉
-- 編集者は担当クライアントごとに複数アカウントを作成します（後述）。
-- 「Auto Confirm User」に必ずチェックを入れてください（メール確認をスキップするため）。

-- クライアント（撮影者が登録する取引先。担当編集者のメールを紐づける）
create table if not exists clients (
  name text primary key,
  drive_url text not null default '',
  editor_email text not null default '',
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

-- 編集者アカウントのメール一覧（ログイン時にパスワードだけで本人を特定するために使用）
create table if not exists editor_accounts (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table clients enable row level security;
alter table cases enable row level security;
alter table case_history enable row level security;
alter table editor_accounts enable row level security;

-- ログイン済みユーザー（Supabase Auth）のみ読み書き可能
create policy "clients_authenticated" on clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "cases_authenticated" on cases
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "case_history_authenticated" on case_history
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- メールアドレス自体は機密ではないため、ログイン前でも一覧取得を許可
create policy "editor_accounts_select_all" on editor_accounts
  for select using (true);
create policy "editor_accounts_write_authenticated" on editor_accounts
  for insert with check (auth.role() = 'authenticated');
create policy "editor_accounts_update_authenticated" on editor_accounts
  for update using (auth.role() = 'authenticated');
create policy "editor_accounts_delete_authenticated" on editor_accounts
  for delete using (auth.role() = 'authenticated');

-- リアルタイム更新を有効化（複数人での同時利用を想定）
alter publication supabase_realtime add table clients, cases, case_history;
