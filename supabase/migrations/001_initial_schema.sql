-- ============================================================
-- GradeBurst — Initial Schema
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- EXTENSIONS
-- ────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";


-- ────────────────────────────────────────────────────────────
-- HELPERS
-- ────────────────────────────────────────────────────────────

-- Automatically stamps updated_at on any table that has it
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ────────────────────────────────────────────────────────────
-- PROFILES
-- One row per auth.users entry — created automatically via trigger
-- ────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure handle_updated_at();

-- Auto-create a profile row whenever a new user signs up
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();


-- ────────────────────────────────────────────────────────────
-- CREDIT BALANCES
-- One row per user — updated atomically via function
-- ────────────────────────────────────────────────────────────

create table if not exists public.credit_balances (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null unique references public.profiles (id) on delete cascade,
  balance     integer not null default 0 check (balance >= 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger credit_balances_updated_at
  before update on public.credit_balances
  for each row execute procedure handle_updated_at();

-- Auto-create a zero-balance row for every new profile
create or replace function handle_new_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.credit_balances (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure handle_new_profile();

-- Safe credit deduction — fails if insufficient balance
create or replace function deduct_credit(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.credit_balances
  set balance = balance - 1
  where user_id = p_user_id
    and balance > 0;

  if not found then
    raise exception 'insufficient_credits'
      using hint = 'User has no remaining scan credits.';
  end if;
end;
$$;


-- ────────────────────────────────────────────────────────────
-- PURCHASES
-- Records every credit pack purchase (Stripe integration-ready)
-- ────────────────────────────────────────────────────────────

create type purchase_tier as enum ('starter', 'collector', 'flipper');

create table if not exists public.purchases (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.profiles (id) on delete cascade,
  tier                 purchase_tier not null,
  credits_purchased    integer not null,
  amount_cents         integer not null,          -- e.g. 900, 1900, 3900
  stripe_payment_id    text,                      -- populated after Stripe webhook
  stripe_customer_id   text,
  status               text not null default 'pending'
                         check (status in ('pending', 'completed', 'refunded')),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger purchases_updated_at
  before update on public.purchases
  for each row execute procedure handle_updated_at();

create index purchases_user_id_idx on public.purchases (user_id);
create index purchases_stripe_payment_id_idx on public.purchases (stripe_payment_id)
  where stripe_payment_id is not null;

-- When a purchase completes, credit the user's balance automatically
create or replace function handle_purchase_completed()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'completed' and old.status != 'completed' then
    update public.credit_balances
    set balance = balance + new.credits_purchased
    where user_id = new.user_id;
  end if;

  if new.status = 'refunded' and old.status = 'completed' then
    update public.credit_balances
    set balance = greatest(balance - new.credits_purchased, 0)
    where user_id = new.user_id;
  end if;

  return new;
end;
$$;

create trigger on_purchase_status_change
  after update of status on public.purchases
  for each row execute procedure handle_purchase_completed();


-- ────────────────────────────────────────────────────────────
-- CARD SCANS
-- One row per grading request
-- ────────────────────────────────────────────────────────────

create type scan_status      as enum ('pending', 'processing', 'completed', 'failed');
create type recommendation   as enum ('grade', 'sell_raw', 'hold');

create table if not exists public.card_scans (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.profiles (id) on delete cascade,

  -- User-provided metadata (optional)
  card_name            text,
  card_set             text,
  card_year            smallint,

  -- Storage paths (Supabase Storage bucket: "card-images")
  front_image_path     text not null,
  back_image_path      text,

  -- AI results (null until processing completes)
  estimated_grade      numeric(3, 1) check (estimated_grade between 1 and 10),
  subgrade_centering   numeric(3, 1) check (subgrade_centering between 1 and 10),
  subgrade_corners     numeric(3, 1) check (subgrade_corners between 1 and 10),
  subgrade_edges       numeric(3, 1) check (subgrade_edges between 1 and 10),
  subgrade_surface     numeric(3, 1) check (subgrade_surface between 1 and 10),
  ai_confidence        smallint check (ai_confidence between 0 and 100),
  recommendation       recommendation,
  ai_notes             text,                      -- optional human-readable note from AI

  status               scan_status not null default 'pending',
  error_message        text,                      -- set if status = 'failed'

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger card_scans_updated_at
  before update on public.card_scans
  for each row execute procedure handle_updated_at();

create index card_scans_user_id_idx    on public.card_scans (user_id);
create index card_scans_status_idx     on public.card_scans (status);
create index card_scans_created_at_idx on public.card_scans (created_at desc);


-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────

alter table public.profiles        enable row level security;
alter table public.credit_balances enable row level security;
alter table public.purchases       enable row level security;
alter table public.card_scans      enable row level security;

-- profiles: users can read/update only their own row
create policy "profiles: own row read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: own row update"
  on public.profiles for update
  using (auth.uid() = id);

-- credit_balances: users can read only their own balance
create policy "credit_balances: own row read"
  on public.credit_balances for select
  using (auth.uid() = user_id);

-- purchases: users can read their own purchases
create policy "purchases: own rows read"
  on public.purchases for select
  using (auth.uid() = user_id);

-- purchases: users can insert (pending) their own purchases
create policy "purchases: own rows insert"
  on public.purchases for insert
  with check (auth.uid() = user_id);

-- card_scans: users can only see their own scans
create policy "card_scans: own rows read"
  on public.card_scans for select
  using (auth.uid() = user_id);

-- card_scans: users can insert their own scans
create policy "card_scans: own rows insert"
  on public.card_scans for insert
  with check (auth.uid() = user_id);

-- card_scans: users can update their own scans (e.g. add card name)
create policy "card_scans: own rows update"
  on public.card_scans for update
  using (auth.uid() = user_id);


-- ────────────────────────────────────────────────────────────
-- STORAGE BUCKET
-- ────────────────────────────────────────────────────────────
-- Run this section separately in the Supabase dashboard if
-- the SQL editor doesn't support storage helpers directly.
-- Alternatively use: Dashboard → Storage → New bucket

insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', false)
on conflict (id) do nothing;

-- Users can upload to their own folder: card-images/<user_id>/*
create policy "card-images: user upload"
  on storage.objects for insert
  with check (
    bucket_id = 'card-images'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Users can read their own images
create policy "card-images: user read"
  on storage.objects for select
  using (
    bucket_id = 'card-images'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Users can delete their own images
create policy "card-images: user delete"
  on storage.objects for delete
  using (
    bucket_id = 'card-images'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );
