-- 1. Create Admins Table (if not exists)
create table if not exists public.admins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable RLS
alter table public.admins enable row level security;

-- 3. Policies
-- Allow everyone to read (so the app can check if a user is admin)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'admins' 
        AND policyname = 'Enable read access for all users'
    ) THEN
        create policy "Enable read access for all users" on public.admins for select using (true);
    END IF;
END $$;

-- 4. ADD YOURSELF AS ADMIN
-- Replace 'thaksin819@gmail.com' with your actual login email
insert into public.admins (user_id)
select id from auth.users where email = 'thaksin819@gmail.com'
on conflict (user_id) do nothing;

-- (ในอนาคตถ้ามีคนมาเพิ่มสำหรับแอดมิน ก็แค่รันคำสั่งด้านล่างเปลี่ยนอีเมลครับ)
-- insert into public.admins (user_id) select id from auth.users where email = 'new-admin@example.com' on conflict (user_id) do nothing;
