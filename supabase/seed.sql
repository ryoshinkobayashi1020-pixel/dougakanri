-- 初期データ（任意）。schema.sql の実行後にお好みで実行してください。

insert into clients (name, drive_url) values
  ('カフェど・れみ', 'https://drive.google.com/drive/folders/example-doremi-root'),
  ('美容室HANA', 'https://drive.google.com/drive/folders/example-hana-root'),
  ('整体院コアバランス', 'https://drive.google.com/drive/folders/example-core-root'),
  ('パーソナルジムFLEX', 'https://drive.google.com/drive/folders/example-flex-root')
on conflict (name) do nothing;

with new_case as (
  insert into cases (
    client_name, title, platforms, drive_url, reference_video_url,
    edit_deadline, publish_at, youtube_hashtags, tiktok_hashtags, status, notes
  ) values (
    'カフェど・れみ', '新作ドリンク紹介ショート', array['tiktok', 'youtube'],
    'https://drive.google.com/drive/folders/example-doremi',
    'https://www.tiktok.com/@example/video/doremi-reference',
    now() + interval '2 days', now() + interval '3 days',
    '#カフェどれみ #新作ドリンク', '#カフェどれみ #ドリンク紹介',
    'editing', 'サビの部分は明るめのBGMで。テロップは大きめ希望。'
  ) returning id
)
insert into case_history (case_id, at, text)
select id, now() - interval '3 days', '撮影者が案件を登録し、編集チームに依頼しました。' from new_case
union all
select id, now() - interval '1 days', '編集者が編集を開始しました。' from new_case;

with new_case as (
  insert into cases (
    client_name, title, platforms, drive_url, reference_video_url,
    edit_deadline, publish_at, youtube_hashtags, tiktok_hashtags, status, notes
  ) values (
    '美容室HANA', 'スタイリング密着Vlog', array['youtube'],
    'https://drive.google.com/drive/folders/example-hana', '',
    now() - interval '1 days', now() + interval '20 hours',
    '#美容室HANA #スタイリング', '',
    'requested', ''
  ) returning id
)
insert into case_history (case_id, at, text)
select id, now() - interval '2 days', '撮影者が案件を登録し、編集チームに依頼しました。' from new_case;

with new_case as (
  insert into cases (
    client_name, title, platforms, drive_url, reference_video_url,
    edit_deadline, publish_at, youtube_hashtags, tiktok_hashtags, status, notes
  ) values (
    '整体院コアバランス', '肩こり解消ストレッチ', array['tiktok'],
    'https://drive.google.com/drive/folders/example-core',
    'https://www.youtube.com/watch?v=example-core-reference',
    now(), now() + interval '1 days',
    '', '#整体院コアバランス #肩こり解消',
    'scheduled', '投稿は明日12時予約済み。'
  ) returning id
)
insert into case_history (case_id, at, text)
select id, now() - interval '4 days', '撮影者が案件を登録し、編集チームに依頼しました。' from new_case
union all
select id, now() - interval '2 days', '編集者が編集を開始しました。' from new_case
union all
select id, now() - interval '1 days', '編集者が投稿予約を完了しました。' from new_case;
