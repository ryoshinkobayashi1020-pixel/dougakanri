-- 編集者ログインをメール入力なし・パスワードだけにするための追加テーブル
-- 既存のテーブル・データには影響しません。

create table if not exists editor_accounts (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table editor_accounts enable row level security;

-- メールアドレス自体は機密ではないため、ログイン前(未認証)でも一覧取得を許可
-- （パスワードと組み合わせて内部的にログイン試行するために使用）
create policy "editor_accounts_select_all" on editor_accounts
  for select using (true);

-- 追加・変更はログイン済みユーザー（撮影者）のみ
create policy "editor_accounts_write_authenticated" on editor_accounts
  for insert with check (auth.role() = 'authenticated');
create policy "editor_accounts_update_authenticated" on editor_accounts
  for update using (auth.role() = 'authenticated');
create policy "editor_accounts_delete_authenticated" on editor_accounts
  for delete using (auth.role() = 'authenticated');
