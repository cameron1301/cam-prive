-- Shared CAM Privé operations. Personal data is read only through server functions.
create table if not exists cam_state (
  id integer primary key,
  data jsonb not null
);

create table if not exists cam_sessions (
  token_hash text primary key,
  person_id text not null,
  view_id text not null,
  expires_at timestamptz not null
);

create index if not exists cam_sessions_person_idx on cam_sessions (person_id);
