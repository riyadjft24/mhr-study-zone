# MHR Study Zone — Beginner setup (বাংলা)

## কী আছে
- React + Vite responsive UI
- Demo course cards, search and subject filter
- Supabase email/password signup and login
- Supabase courses, lessons, quiz tables and Row Level Security (RLS)
- Admin-only course create/edit/delete UI
- Vercel deployment-ready project

> এই starter-এ কোর্স ও authentication কাজ করে। কুইজের database schema তৈরি আছে, কিন্তু quiz-taking UI এবং admin lesson editor এখনো যোগ করা হয়নি। Google Fonts ব্যবহার করলে ফন্টের জন্য internet দরকার; ফন্ট লোড না হলেও সাইট চলবে।

## ১. দরকারি সফটওয়্যার
- Node.js-এর LTS সংস্করণ ইনস্টল করো: https://nodejs.org/
- একটি free GitHub account
- একটি free Supabase account: https://supabase.com/
- একটি free Vercel account: https://vercel.com/

## ২. প্রজেক্ট চালাও
ZIP extract করে `mhr-study-zone` ফোল্ডার VS Code-এ খোলো। VS Code Terminal-এ চালাও:

```bash
npm install
```

`.env.example` ফাইলটি কপি করে `.env.local` নামে রাখো। Supabase তৈরি না করা পর্যন্ত `.env.local` ফাইলের placeholder values ব্যবহার করো না। তারপর:

```bash
npm run dev
```

টার্মিনালে দেখানো local URL (সাধারণত http://localhost:5173) ব্রাউজারে খোলো।

## ৩. Supabase তৈরি
1. https://supabase.com/ এ নতুন project তৈরি করো।
2. Dashboard → SQL Editor → New query খোলো।
3. `supabase/schema.sql` ফাইলের সব SQL কপি করে Run করো।
4. Project Settings → API থেকে Project URL এবং publishable/anon key নাও।
5. `.env.local` ফাইলে বসাও:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

6. Vite বন্ধ করে আবার `npm run dev` চালাও।
7. Sign up দিয়ে নিজের অ্যাকাউন্ট তৈরি করো। Supabase Auth email confirmation চাইলে inbox-এ গিয়ে confirm করো।

## ৪. নিজের অ্যাকাউন্টকে Admin করো
1. Supabase Dashboard → Authentication → Users-এ যাও।
2. নিজের account-এর UUID কপি করো।
3. SQL Editor-এ এই SQL চালাও (UUID বদলে নিজেরটি বসাও):

```sql
update public.profiles
set role = 'admin'
where id = 'YOUR_AUTH_USER_UUID';
```

4. সাইট থেকে logout করে আবার login করো। Admin menu দেখাবে।

**নিরাপত্তা:** `service_role` বা `secret` key কখনো `.env.local`-এ `VITE_` prefix দিয়ে বা React code-এ দেবে না। Frontend-এ শুধু publishable/anon key ব্যবহার করবে। RLS বন্ধ করবে না।

## ৫. Vercel-এ deploy
1. Project GitHub-এ push করো।
2. https://vercel.com/ এ গিয়ে Add New → Project → GitHub repository import করো।
3. Framework Preset `Vite` নির্বাচন করো (সাধারণত auto-detect হবে)।
4. Environment Variables-এ `VITE_SUPABASE_URL` ও `VITE_SUPABASE_ANON_KEY` যোগ করো।
5. Deploy চাপো। Vercel একটি `*.vercel.app` URL দেবে।
6. Supabase → Authentication → URL Configuration-এ Site URL হিসেবে Vercel URL দাও। Redirect URLs-এ Vercel URL ও local URL (যেমন `http://localhost:5173/**`) যোগ করো।

## ৬. সাধারণ error সমাধান
- `npm is not recognized`: Node.js ইনস্টল করে terminal/VS Code পুনরায় খোলো।
- `Failed to fetch`: `.env.local`-এর URL/key ঠিক কি না দেখো; dev server restart করো।
- `Invalid API key`: Supabase থেকে সঠিক publishable/anon key কপি করো।
- `relation public.courses does not exist`: `supabase/schema.sql` সম্পূর্ণ চালাও।
- `permission denied` / RLS error: SQL policies চালানো হয়েছে কি না এবং user admin কি না যাচাই করো।
- Admin menu নেই: `profiles` টেবিলে নিজের UUID-তে `role='admin'` হয়েছে কি না দেখো; logout/login করো।
- signup confirmation email আসছে না: spam folder দেখো; Supabase Auth email settings ও provider limits পরীক্ষা করো।
- Deploy-এর পরে environment variable কাজ করছে না: Vercel project settings-এ variable যোগ করে নতুন deployment করো।

## বর্তমান starter-এর সীমা
- Course create/edit/delete কাজ করে।
- Lesson schema ও lesson viewer আছে, কিন্তু admin UI থেকে lesson create করার ফর্ম এখনো নেই।
- Quiz tables আছে, কিন্তু interactive quiz-taking/auto-grading UI এখনো নেই। Quiz-এর correct answers সরাসরি public table-এ প্রকাশ কোরো না; বাস্তব পরীক্ষার জন্য server-side grading function দরকার।
- PDF ফাইল সরাসরি upload নয়; আপাতত public PDF/video URL lesson-এ যোগ করা যায় (lesson editor যোগ হলে)।
- Free plan-এ usage limits, inactivity/pause rules, email quotas এবং provider terms প্রযোজ্য।
