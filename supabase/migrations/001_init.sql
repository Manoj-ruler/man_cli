-- ============================================
-- Terminal Assistant — Database Schema
-- ============================================

-- Command Queries table
create table if not exists command_queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  query_text text not null,
  matched_command text not null,
  category text,
  response_time_ms integer,
  success boolean default true,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table command_queries enable row level security;

-- Users can only access their own rows
create policy "Users can view own queries"
  on command_queries for select
  using (auth.uid() = user_id);

create policy "Users can insert own queries"
  on command_queries for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own queries"
  on command_queries for delete
  using (auth.uid() = user_id);

-- Custom Snippets table
create table if not exists custom_snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  label text not null,
  command text not null,
  description text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table custom_snippets enable row level security;

create policy "Users can view own snippets"
  on custom_snippets for select
  using (auth.uid() = user_id);

create policy "Users can insert own snippets"
  on custom_snippets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own snippets"
  on custom_snippets for update
  using (auth.uid() = user_id);

create policy "Users can delete own snippets"
  on custom_snippets for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_custom_snippets_updated_at
  before update on custom_snippets
  for each row execute function update_updated_at_column();

-- API Tokens table (for CLI auth)
create table if not exists api_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  token text unique not null,
  created_at timestamptz default now()
);

alter table api_tokens enable row level security;

create policy "Users can view own tokens"
  on api_tokens for select
  using (auth.uid() = user_id);

create policy "Users can insert own tokens"
  on api_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own tokens"
  on api_tokens for delete
  using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_command_queries_user_id on command_queries(user_id);
create index if not exists idx_command_queries_created_at on command_queries(created_at desc);
create index if not exists idx_custom_snippets_user_id on custom_snippets(user_id);
create index if not exists idx_api_tokens_token on api_tokens(token);
