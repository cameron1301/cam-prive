-- Slip 36: CAM EDU staff stays on the Ciera, and Maria's bridge wash.

create table if not exists people (
  id serial primary key,
  name text not null,
  email text,
  role text not null check (role in ('owner', 'manager', 'staff', 'steward', 'pending')),
  user_id text unique,
  stays_granted integer not null default 0 check (stays_granted >= 0),
  created_at timestamptz not null default now()
);

create unique index if not exists people_email_unique
  on people (lower(email))
  where email is not null;

create table if not exists bookings (
  id serial primary key,
  person_id integer not null references people (id),
  user_id text not null,
  check_in date not null,
  nights integer not null check (nights in (1, 2)),
  party_size integer not null check (party_size between 1 and 8),
  note text not null default '',
  status text not null check (status in ('confirmed', 'cancelled')),
  left_early_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists bookings_status_idx on bookings (status, check_in);

create table if not exists turnarounds (
  id serial primary key,
  booking_id integer not null unique references bookings (id),
  opened_at timestamptz not null default now(),
  ready_at timestamptz,
  ready_by text,
  note text not null default '',
  checklist jsonb not null
);

create table if not exists blackouts (
  day date primary key,
  reason text not null default ''
);

create table if not exists harbor_settings (
  id integer primary key check (id = 1),
  gate_note text not null default '',
  party_max integer not null default 4 check (party_max between 1 and 8)
);

insert into harbor_settings (id, gate_note, party_max)
values (
  1,
  'Dock 5, slip 36. The marina gate is keyed — get a key from the harbor office before your first stay. Free parking is at the marina.',
  4
)
on conflict (id) do nothing;

insert into people (name, role, stays_granted)
select 'Maria', 'steward', 0
where not exists (select 1 from people where role = 'steward');
