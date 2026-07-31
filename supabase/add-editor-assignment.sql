-- クライアント(チャンネル)ごとに担当編集者を割り当てるための追加マイグレーション
-- 既存のテーブル・データには影響しません（カラム追加のみ）。
-- SQL Editorで実行してください。

alter table clients
  add column if not exists editor_email text not null default '';
