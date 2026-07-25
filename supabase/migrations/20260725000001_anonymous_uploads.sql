-- Allow anonymous users to insert resources
grant insert on public.resources to anon;

-- Drop the old policy that requires authenticated users for uploads
drop policy if exists "authenticated users can submit" on public.resources;

-- Create a new policy that allows anyone to submit resources
create policy "anyone can submit resources" on public.resources
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and is_verified = false
    and (
      (auth.uid() is null and uploader_id is null)
      or (auth.uid() is not null and (uploader_id is null or uploader_id = auth.uid()))
    )
  );

-- Allow anonymous users to upload PDFs to the 'anonymous' folder in storage
create policy "anonymous upload to anonymous folder" on storage.objects
  for insert to anon
  with check (
    bucket_id = 'resources'
    and (storage.foldername(name))[1] = 'anonymous'
  );

-- Allow moderators/admins to upload resources directly (bypass pending review status)
drop policy if exists "moderators can upload directly" on public.resources;
create policy "moderators can upload directly" on public.resources
  for insert to authenticated
  with check (
    private.current_user_role() in ('moderator', 'admin')
  );
