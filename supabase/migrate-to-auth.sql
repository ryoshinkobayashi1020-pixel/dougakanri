-- 共有パスワード表(role_passwords)方式から Supabase Auth 方式への移行
-- 既に schema.sql / seed.sql を実行済みのプロジェクトに対して、SQL Editor で実行してください。

-- 1) データの読み書きを「ログイン済みユーザーのみ」に制限
drop policy if exists "clients_all" on clients;
drop policy if exists "cases_all" on cases;
drop policy if exists "case_history_all" on case_history;

create policy "clients_authenticated" on clients
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "cases_authenticated" on cases
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "case_history_authenticated" on case_history
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- 2) 旧・共有パスワード方式を廃止
drop function if exists verify_role_password(text, text);
drop table if exists role_passwords;

-- 3) このあと、Authentication > Users で以下の2ユーザーを作成してください:
--    email: shooter@dougakanri.local  / password: 撮影者チームの合言葉
--    email: editor@dougakanri.local   / password: 編集者チームの合言葉
--    「Auto Confirm User」に必ずチェックを入れてください（メール確認をスキップするため）。
--    ※ メールアドレスは実在しなくてOK。役割の判定にこのメールアドレスを使うので、
--       上記2つと完全に同じものを使ってください。
