-- 작업지시서 13 (2026-10-22): 모델하우스 방문예약 전용 접수 표. 사전고객등록(leads)과 별도. 추가만, 기존 표·행 영향 없음.
create table if not exists visit_reservations (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  receipt_no text not null unique,
  site_id text not null,
  site_host text,
  page text,
  name text not null,
  phone text not null,
  visit_date date,
  visit_slot text not null default 'ANY',
  interest text,
  consent_privacy boolean not null default false,
  consent_version text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  is_test boolean not null default false,
  status text not null default 'new',
  notify_status text,
  notify_detail text,
  notify_at timestamptz
);
create index if not exists visit_reservations_phone_created on visit_reservations (site_id, phone, created_at desc);
