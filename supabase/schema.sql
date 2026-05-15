-- Paste this entire file into the Supabase SQL Editor and run it.
-- This creates all the tables needed for the ATC Hub.

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  role text not null default 'member',
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'display_name', 'member');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Announcements (mirrored from Google Classroom)
create table public.announcements (
  id text primary key,
  text text,
  creation_time timestamptz,
  update_time timestamptz,
  fetched_at timestamptz default now()
);

-- Meeting notes (admin-only write, members read)
create table public.meeting_notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  meeting_date date not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Project ideas (any member can submit, admin can pin/approve)
create table public.project_ideas (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  submitted_by uuid references public.profiles(id),
  pinned boolean default false,
  approved boolean default false,
  created_at timestamptz default now()
);

-- Thread messages (single shared channel)
create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content text not null,
  file_url text,
  file_type text,
  created_at timestamptz default now()
);

-- Storage bucket for thread file uploads
insert into storage.buckets (id, name, public) values ('thread-files', 'thread-files', true);

create policy "thread_files_upload" on storage.objects for insert
  with check (bucket_id = 'thread-files' and auth.role() = 'authenticated');

create policy "thread_files_read" on storage.objects for select
  using (bucket_id = 'thread-files');

create policy "thread_files_delete" on storage.objects for delete
  using (bucket_id = 'thread-files' and (
    auth.uid() = owner or
    (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
  ));

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.meeting_notes enable row level security;
alter table public.project_ideas enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles: users can read all, update only their own
create policy "profiles_read" on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Announcements: authenticated users can read
create policy "announcements_read" on public.announcements for select using (auth.role() = 'authenticated');

-- Meeting notes: authenticated users read, admin/owner write
create policy "notes_read" on public.meeting_notes for select using (auth.role() = 'authenticated');
create policy "notes_write" on public.meeting_notes for insert with check (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

-- Project ideas: authenticated read/insert, admin/owner can update
create policy "ideas_read" on public.project_ideas for select using (auth.role() = 'authenticated');
create policy "ideas_insert" on public.project_ideas for insert with check (auth.uid() = submitted_by);
create policy "ideas_admin_update" on public.project_ideas for update using (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

-- Chat: authenticated users read and insert their own
create policy "chat_read" on public.chat_messages for select using (auth.role() = 'authenticated');
create policy "chat_insert" on public.chat_messages for insert with check (auth.uid() = user_id);

-- Admin/owner can delete meeting notes
create policy "notes_delete" on public.meeting_notes for delete using (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

-- Admin/owner can delete project ideas
create policy "ideas_delete" on public.project_ideas for delete using (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

-- Admin/owner can delete chat messages
create policy "chat_delete" on public.chat_messages for delete using (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

-- Enable Realtime on chat_messages so live updates work
alter publication supabase_realtime add table public.chat_messages;

-- After running this, make yourself owner:
-- update public.profiles set role = 'owner' where email = 'ashwathpolali@gmail.com';
