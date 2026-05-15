-- Run this if you already ran schema.sql before these changes were added.
-- Safe to re-run — drops existing policies first.

-- Add file attachment columns to chat_messages
alter table public.chat_messages add column if not exists file_url text;
alter table public.chat_messages add column if not exists file_type text;

-- Delete policies (drop first in case they already exist)
drop policy if exists "notes_delete" on public.meeting_notes;
create policy "notes_delete" on public.meeting_notes for delete using (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

drop policy if exists "ideas_delete" on public.project_ideas;
create policy "ideas_delete" on public.project_ideas for delete using (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

drop policy if exists "chat_delete" on public.chat_messages;
create policy "chat_delete" on public.chat_messages for delete using (
  (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
);

-- Enable Realtime on chat_messages (ignore if already added)
do $$
begin
  alter publication supabase_realtime add table public.chat_messages;
exception when duplicate_object then
  null;
end $$;

-- Storage bucket for thread file uploads
insert into storage.buckets (id, name, public)
values ('thread-files', 'thread-files', true)
on conflict (id) do nothing;

drop policy if exists "thread_files_upload" on storage.objects;
create policy "thread_files_upload" on storage.objects for insert
  with check (bucket_id = 'thread-files' and auth.role() = 'authenticated');

drop policy if exists "thread_files_read" on storage.objects;
create policy "thread_files_read" on storage.objects for select
  using (bucket_id = 'thread-files');

drop policy if exists "thread_files_delete" on storage.objects;
create policy "thread_files_delete" on storage.objects for delete
  using (bucket_id = 'thread-files' and (
    auth.uid() = owner or
    (select role from public.profiles where id = auth.uid()) in ('admin', 'owner')
  ));
