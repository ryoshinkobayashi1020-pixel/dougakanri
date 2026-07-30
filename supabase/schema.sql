-- SNS運用ワークボード: Supabaseスキーマ
-- Supabaseダッシュボードの SQL Editor に貼り付けて実行してください。

create extension if not exists pgcrypto with schema extensions;

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

-- 役割ごとの共有パスワード（撮影者/編集者）
create table if not exists role_passwords (
  role text primary key check (role in ('shooter', 'editor')),
  password_hash text not null
);

insert into role_passwords (role, password_hash) values
  ('shooter', extensions.crypt('satsuei2026', extensions.gen_salt('bf'))),
  ('editor', extensions.crypt('henshu2026', extensions.gen_salt('bf')))
on conflict (role) do nothing;

-- パスワード照合はこの関数経由のみ（role_passwords テーブルへの直接アクセスはRLSで遮断）
create or replace function verify_role_password(p_role text, p_password text)
returns boolean
language sql
security definer
set search_path = public, extensions
as $$
  select exists (
    select 1 from role_passwords
    where role = p_role
      and password_hash = extensions.crypt(p_password, password_hash)
  );
$$;

revoke all on function verify_role_password(text, text) from public;
grant execute on function verify_role_password(text, text) to anon, authenticated;

alter table clients enable row level security;
alter table cases enable row level security;
alter table case_history enable row level security;
alter table role_passwords enable row level security;

-- チーム共有パスワードのみで守る内部ツールのため、
-- テーブルへの読み書きはanonキーに対して許可する（role_passwordsのみ関数経由に限定）
create policy "clients_all" on clients for all using (true) with check (true);
create policy "cases_all" on cases for all using (true) with check (true);
create policy "case_history_all" on case_history for all using (true) with check (true);

-- リアルタイム更新を有効化（複数人での同時利用を想定）
alter publication supabase_realtime add table clients, cases, case_history;
