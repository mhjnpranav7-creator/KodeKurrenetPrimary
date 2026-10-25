create table if not exists public.analysis_sessions (
  id uuid primary key default gen_random_uuid(),
  exercise text not null default 'squat',
  input_mode text not null default 'demo',
  report jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.analysis_sessions enable row level security;

create policy "demo sessions are readable by the service role"
  on public.analysis_sessions for select
  using (auth.role() = 'service_role');
