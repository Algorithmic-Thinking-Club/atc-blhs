# ATC Hub Setup

## 1. Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your **Project URL** and **anon/public key**
3. Paste them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Also copy the **service_role key** (Settings → API → service_role):
   ```
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
5. Go to **SQL Editor** in the Supabase dashboard
6. Paste the entire contents of `supabase/schema.sql` and run it

## 2. Make yourself Owner

After your first signup, run this in the Supabase SQL Editor:

```sql
update public.profiles set role = 'owner' where email = 'ashwathpolali@gmail.com';
```

## 3. Google Classroom Sync

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable the **Google Classroom API** in APIs & Services
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web Application**
6. Add authorized redirect URI: `http://localhost:3000/api/hub/classroom-auth`
7. Copy the Client ID and Client Secret into `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/hub/classroom-auth
   GOOGLE_CLASSROOM_COURSE_ID=ODIyNTEyNjEwMDQz
   ```
8. Start the dev server and visit `http://localhost:3000/api/hub/classroom-auth`
9. Complete the Google consent flow
10. Copy the `refresh_token` from the response into `.env.local`:
    ```
    GOOGLE_REFRESH_TOKEN=the-token-you-got
    ```

## 4. Authentication Settings

In the Supabase dashboard:
- **Authentication → Settings** — you can disable "Confirm email" for easier development
- **Authentication → URL Configuration** — add your production domain when deploying

## 5. Give someone Admin

Use the Admin tab in the Hub UI to change a member's role to Admin.

## 6. Deploy to Vercel

Add all env vars from `.env.local` to your Vercel project settings before deploying.

For production, update `GOOGLE_REDIRECT_URI` to your production domain:
```
GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/api/hub/classroom-auth
```
