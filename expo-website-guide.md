# Business Opportunity, Investment & Franchise Expo 2026 — Website Banane Ki Complete Guide

> Target: 1-din MVP (Marketing + Lead Generation Website) + Phase-2/3 Roadmap
> Platform: Windows | Language: Bilingual (English/Marathi with switcher)

---

## PART 0 — Final Tech Stack Decision

**Chuna gaya stack: Next.js + Tailwind CSS + Supabase (Postgres+Auth+Storage) + Vercel (hosting) + Cloudinary (heavy media, optional)**

Kyun ye best hai tumhare case mein:
- Supabase ek click mein Postgres database + file storage + auth deta hai — Django models/migrations manually likhne ka time bachta hai.
- Vercel par Next.js free deploy hota hai (no server management on Windows — bahut simple).
- AI codegen tools (v0.dev, bolt.new, Cursor, Claude) Next.js + Tailwind ko best support karte hain — ek prompt se poore pages ban jate hain.
- Baad mein Django/Python chhodna nahi padega — agar future mein heavy backend logic (B2B matchmaking algorithm, complex reports) chahiye to Django ko separate microservice ki tarah add kar sakte ho. Abhi ke liye zarurat nahi.

Agar tum bilkul Python-only comfortable ho, alternative hai: **Django + HTMX + Tailwind + Neon/Supabase Postgres + Render (hosting)**. Ye bhi kaam karega, thoda slower hoga AI-generation mein kyunki templates+views dono manage karna padta hai. Neeche ka guide Next.js path follow karta hai (fastest for 1-din target), lekin sections mein Django alternative bhi note kiya hai jaha zaruri hai.

---

## PART 1 — Free & Paid AI/Dev Tools List (with INR pricing)

### Website Generation (Prompt → Code)
| Tool | Free? | Paid (INR approx) | Use |
|---|---|---|---|
| **bolt.new** | Haan (daily free credits) | ₹1,600–4,000/mo (Pro) | Poora Next.js app 1 prompt se generate + preview + deploy |
| **v0.dev (Vercel)** | Haan (limited credits/mo) | ₹1,600/mo+ | UI components/pages generate karta hai (React+Tailwind) |
| **Lovable.dev** | Haan (limited) | ₹2,000/mo+ | Full-stack app generator, Supabase integrated |
| **Cursor (AI code editor)** | Haan (limited AI requests) | ₹1,700/mo (Pro) | VS Code jaisa, AI se poora codebase edit/generate |
| **Claude (Anthropic) / ChatGPT** | Haan (free tier) | ₹1,600–2,000/mo (Pro) | Code likhna, debug, prompt engineering, tumhara guide banane ke liye bhi |
| **GitHub Copilot** | Free (students/some plans) | ₹800/mo | Code-editor autocomplete |

### Design
| Tool | Free? | Paid |
|---|---|---|
| **Figma** | Haan | ₹1,000/mo+ (team) |
| **Canva** | Haan | ₹500/mo (Pro) |
| **Google Fonts + Lucide Icons** | 100% free | — |
| **Coolors.co** (color palette) | Free | — |

### Backend / Database
| Tool | Free tier | Paid |
|---|---|---|
| **Supabase** | 500MB DB, 1GB storage, 50k monthly active users free | ₹2,000/mo (Pro) — jab traffic badhega |
| **Neon.tech** (Postgres alt.) | 0.5GB free | Usage-based |
| **Firebase** (alternative) | Generous free tier | Usage-based |

### Media Storage
| Tool | Free | Paid |
|---|---|---|
| **Cloudinary** | 25GB storage+bandwidth free | ₹800/mo+ |
| **Supabase Storage** | 1GB free (DB ke sath hi) | Bundled with Supabase plan |

### Hosting/Deployment
| Tool | Free | Paid |
|---|---|---|
| **Vercel** | Free for personal/small projects, auto SSL, custom domain support | ₹1,600/mo (Pro, team) |
| **Netlify** (alternative) | Free tier available | ₹1,600/mo+ |
| **Render** (agar Django use karo) | Free web service (sleeps on idle) | ₹600/mo+ |

### Communication APIs
| Tool | Free | Paid |
|---|---|---|
| **WhatsApp Cloud API (Meta official)** | 1000 free conversations/month | Usage-based (~₹0.5–2/msg after) |
| **Twilio (SMS/WhatsApp)** | Free trial credit | Pay-as-you-go (~₹0.15–0.3/SMS) |
| **Resend / Brevo (Email)** | Free tier (300–3000 emails/mo) | ₹800/mo+ |
| **Razorpay (Payments)** | Free to integrate | 2% transaction fee only |

### Translation / Language Switcher
| Tool | Free | Paid |
|---|---|---|
| **react-i18next** | 100% free (library, self-hosted content) | — |
| **Google Cloud Translation API** | $10 free credit/mo trial only | ₹1.5/1000 characters after |
| **LibreTranslate (self-hosted, open source)** | Free | — |

**Recommendation for 1-din build:** bolt.new ya v0.dev (frontend generate) + Cursor/Claude (fine-tuning code) + Supabase (DB free) + Vercel (host free) + react-i18next (translation free, no API cost) = **₹0 cost total**, sirf apna time lagega.

---

## PART 2 — Windows Setup (One-Time, ~20 min)

```bash
# 1. Node.js install karo (LTS version)
# https://nodejs.org se download karke install karo (Windows installer)

# 2. Check karo terminal (PowerShell) mein:
node -v
npm -v

# 3. Git install karo: https://git-scm.com/download/win

# 4. VS Code install karo: https://code.visualstudio.com/
```

Supabase account free banao: https://supabase.com → New Project → region "South Asia (Mumbai)" choose karo (fast for India).
Vercel account free banao: https://vercel.com (GitHub se sign-in karna aasan hai).

---

## PART 3 — Project Create Karo

```bash
npx create-next-app@latest expo-website
# Prompts mein: TypeScript = No (simple rakhna hai), Tailwind = Yes, App Router = Yes, src dir = Yes

cd expo-website
npm install @supabase/supabase-js react-i18next i18next lucide-react
npm run dev
```
Browser mein `http://localhost:3000` khol ke check karo.

---

## PART 4 — Supabase Database Schema

Supabase dashboard → SQL Editor → ye paste karke Run karo:

```sql
-- Visitor Registration
create table visitors (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  mobile text not null,
  email text,
  city text,
  category text, -- Visitor/Business/Investor/Student
  created_at timestamp default now()
);

-- Exhibitor / Stall Booking Inquiry
create table exhibitor_inquiries (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,
  contact_person text,
  mobile text not null,
  email text,
  business_category text,
  stall_type text, -- 3x3, 4x3, 6x4, Premium, Island
  message text,
  status text default 'New', -- New/Contacted/Confirmed
  created_at timestamp default now()
);

-- Sponsorship Inquiry
create table sponsor_inquiries (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,
  contact_person text,
  mobile text,
  email text,
  interested_package text, -- Title/Gold/Silver/etc
  created_at timestamp default now()
);

-- Contact / General Inquiry
create table contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  mobile text,
  email text,
  message text,
  created_at timestamp default now()
);

-- Sponsors/Partners (admin adds these, shown on site)
create table sponsors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text,
  category text, -- Title/Gold/Silver
  display_order int default 0
);

-- Gallery (images uploaded via Cloudinary, URL stored here)
create table gallery (
  id uuid default gen_random_uuid() primary key,
  image_url text not null,
  caption text,
  display_order int default 0,
  created_at timestamp default now()
);
alter table gallery enable row level security;
create policy "public read gallery" on gallery for select using (true);
create policy "authenticated manage gallery" on gallery for all using (auth.role() = 'authenticated');

-- Enable Row Level Security + allow public insert (for forms)
alter table visitors enable row level security;
alter table exhibitor_inquiries enable row level security;
alter table sponsor_inquiries enable row level security;
alter table contact_messages enable row level security;

create policy "public insert visitors" on visitors for insert with check (true);
create policy "public insert exhibitor" on exhibitor_inquiries for insert with check (true);
create policy "public insert sponsor" on sponsor_inquiries for insert with check (true);
create policy "public insert contact" on contact_messages for insert with check (true);
```

Supabase → Project Settings → API se `Project URL` aur `anon public key` copy kar lo — ye agle step mein chahiye.

`.env.local` file (project root mein) banao:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

`src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```

---

## PART 5 — Color Palette & Design System (Modern, Premium — Kumbh + Business theme)

```
Primary (Deep Saffron):   #E85D04
Secondary (Royal Blue):   #14213D
Accent (Gold):            #FFB703
Success/Growth Green:     #2E7D32
Background Light:         #FFF8F0
Text Dark:                #1F2937
White:                    #FFFFFF
```

Fonts: `Poppins` (headings) + `Inter` (body) + `Noto Sans Devanagari` (Marathi text support) — sab Google Fonts se free milte hain, `next/font/google` se import karo Next.js mein.

Tailwind config (`tailwind.config.js`) mein colors add karo:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#E85D04',
      secondary: '#14213D',
      accent: '#FFB703',
      success: '#2E7D32',
    }
  }
}
```

---

## PART 6 — Bilingual Language Switcher (Marathi ⇄ English)

`react-i18next` setup:

`src/locales/en.json`:
```json
{
  "nav_home": "Home",
  "nav_about": "About",
  "nav_expo": "Expo 2026",
  "nav_exhibit": "Exhibit",
  "nav_visit": "Visit",
  "nav_contact": "Contact",
  "hero_title": "Business Opportunity, Investment & Franchise Expo 2026",
  "hero_subtitle": "Nashik Kumbh Mela | October 2026",
  "cta_register": "Register as Visitor",
  "cta_book_stall": "Book a Stall"
}
```

`src/locales/mr.json`:
```json
{
  "nav_home": "मुख्यपृष्ठ",
  "nav_about": "आमच्याबद्दल",
  "nav_expo": "एक्स्पो 2026",
  "nav_exhibit": "स्टॉल बुकिंग",
  "nav_visit": "भेट द्या",
  "nav_contact": "संपर्क",
  "hero_title": "व्यवसाय संधी, गुंतवणूक व फ्रँचायजी एक्स्पो 2026",
  "hero_subtitle": "नाशिक कुंभमेळा | ऑक्टोबर 2026",
  "cta_register": "भेट देणारा म्हणून नोंदणी करा",
  "cta_book_stall": "स्टॉल बुक करा"
}
```

`src/i18n.js`:
```javascript
'use client'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import mr from './locales/mr.json'

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, mr: { translation: mr } },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
```

Language Switcher Button component (`src/components/LangSwitcher.jsx`):
```javascript
'use client'
import { useTranslation } from 'react-i18next'

export default function LangSwitcher() {
  const { i18n } = useTranslation()
  const toggle = () => i18n.changeLanguage(i18n.language === 'en' ? 'mr' : 'en')
  return (
    <button onClick={toggle} className="px-4 py-2 bg-accent text-secondary rounded-full font-semibold">
      {i18n.language === 'en' ? 'मराठी' : 'English'}
    </button>
  )
}
```

**Names/proper nouns transliteration:** Static content (menu, labels, headings) — upar jaisa JSON translation use karo (ye tumhare pura control mein hai, accurate rahega). Dynamic content jo database se aata hai (jaise company names, exhibitor names) — wo transliterate NAHI karna, unhe as-is dikhao (jaisa Krishithon/Krushi Mahotsav bhi karte hain — proper nouns translate nahi hote, sirf UI labels translate hote hain). Agar future mein user-generated long text (jaise "About Company" paragraph) dono languages mein chahiye, to admin panel mein dono language ka field rakho (`name_en`, `name_mr` columns database mein) — auto-translate API (Google Translate) sirf draft ke liye use karo, final content manually verify karo.

---

## PART 7 — Sample Page Code (Home Page with Visitor Registration Form)

`src/app/page.js`:
```javascript
'use client'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import LangSwitcher from '@/components/LangSwitcher'
import '@/i18n'

export default function Home() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ full_name: '', mobile: '', email: '', city: '', category: 'Visitor' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('visitors').insert([form])
    if (!error) setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      {/* Nav */}
      <nav className="flex justify-between items-center px-8 py-4 bg-secondary text-white">
        <span className="font-bold text-xl">Business Expo 2026</span>
        <div className="flex gap-6 items-center">
          <a href="#about">{t('nav_about')}</a>
          <a href="#expo">{t('nav_expo')}</a>
          <a href="#exhibit">{t('nav_exhibit')}</a>
          <a href="#contact">{t('nav_contact')}</a>
          <LangSwitcher />
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-4 bg-gradient-to-b from-primary/10 to-white">
        <h1 className="text-4xl md:text-6xl font-bold text-secondary mb-4">{t('hero_title')}</h1>
        <p className="text-xl text-primary mb-8">{t('hero_subtitle')}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#register" className="bg-primary text-white px-8 py-3 rounded-full font-semibold">{t('cta_register')}</a>
          <a href="#exhibit" className="bg-accent text-secondary px-8 py-3 rounded-full font-semibold">{t('cta_book_stall')}</a>
        </div>
      </section>

      {/* Visitor Registration Form */}
      <section id="register" className="max-w-xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-secondary mb-6 text-center">{t('cta_register')}</h2>
        {submitted ? (
          <p className="text-success text-center text-lg">Thank you! We'll contact you soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-lg">
            <input required placeholder="Full Name" className="w-full border p-3 rounded-lg"
              value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
            <input required placeholder="Mobile Number" className="w-full border p-3 rounded-lg"
              value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
            <input placeholder="Email" className="w-full border p-3 rounded-lg"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input placeholder="City" className="w-full border p-3 rounded-lg"
              value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
            <button className="w-full bg-primary text-white p-3 rounded-lg font-semibold">Submit</button>
          </form>
        )}
      </section>
    </main>
  )
}
```

Isi pattern se `Exhibit`, `About`, `Contact` pages/sections banate jao — same form-pattern use karo, bas table name change hota rahega (`exhibitor_inquiries`, `contact_messages` etc).

---

## PART 8 — Deploy (Free, Windows se)

```bash
# GitHub par push karo
git init
git add .
git commit -m "Expo website initial"
# GitHub par naya repo banao (github.com/new), fir:
git remote add origin https://github.com/yourusername/expo-website.git
git push -u origin main
```

Fir Vercel.com par: "New Project" → apna GitHub repo select karo → Environment Variables mein `.env.local` wale dono values paste karo → Deploy. 2 minute mein live ho jayega, free `.vercel.app` domain milega. Baad mein custom domain (`.com`) GoDaddy/Hostinger se buy karke Vercel mein connect kar sakte ho.

---

## PART 8.5 — Admin Dashboard Setup (Login + Leads View)

### 1. Admin user banao (Supabase dashboard mein)
Supabase → left sidebar → **Authentication** → **Users** → "Add user" → apna email + password daalo (ye tumhara admin login hoga). "Auto Confirm User" ON rakhna taaki email verify na karna pade.

### 2. SELECT policy add karo (SQL Editor mein run karo)
Abhi tak forms ke liye sirf public INSERT allowed tha — admin ko data padhne (SELECT) ke liye ye chahiye:

```sql
create policy "authenticated read visitors" on visitors
  for select using (auth.role() = 'authenticated');

create policy "authenticated read exhibitor" on exhibitor_inquiries
  for select using (auth.role() = 'authenticated');

create policy "authenticated read contact" on contact_messages
  for select using (auth.role() = 'authenticated');

-- Admin ko exhibitor status update karne ki permission
create policy "authenticated update exhibitor" on exhibitor_inquiries
  for update using (auth.role() = 'authenticated');
```

### 3. Kaise use karo
- Live site par `/admin/login` par jao (e.g. `expo-website-yourname.vercel.app/admin/login`)
- Step 1 mein banaya email/password se login karo
- `/admin/dashboard` par redirect hoga — Visitors / Exhibitor Inquiries / Contact Messages teeno tabs mein data dikhega
- Exhibitor Inquiries tab mein har row ke saamne status dropdown hai (New/Contacted/Confirmed) — badalte hi turant DB update ho jata hai

**Important:** `/admin` route abhi sirf client-side check karta hai (login nahi to redirect). Agar zyada log admin access karte ho ya security aur strict chahiye, Phase 2 mein Next.js **middleware** se server-side protection add kar sakte hain — abhi ke liye ye kaafi hai kyunki data khud RLS se protected hai (bina login ke SELECT hoga hi nahi, chahe koi URL directly khole).

---

## PART 8.6 — Gallery Setup (Cloudinary + Admin Upload)

### 1. Cloudinary free account banao
- https://cloudinary.com → sign up free (25GB free storage+bandwidth)
- Dashboard par apna **Cloud Name** copy kar lo (top par dikhta hai)

### 2. Unsigned Upload Preset banao (taaki browser se seedha upload ho sake, backend/server ki zarurat nahi)
- Cloudinary dashboard → Settings (gear icon) → **Upload** tab → "Add upload preset"
- **Signing Mode = Unsigned** rakho
- Naam do jaise `expo_gallery` → Save
- Ye preset naam aur cloud name `.env.local` mein daalna hai

### 3. `.env.local` mein add karo
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=expo_gallery
```

### 4. `gallery` table already PART 4 ke SQL mein add ho gayi hai (upar dekho) — RLS aisi hai ki **sab dekh sakte hain** (public read) lekin sirf **logged-in admin upload/edit/delete** kar sakta hai.

### 5. Kaise use hoga
- Admin `/admin/gallery` page par jaake login ke baad photo select karega → seedha Cloudinary par upload hoga → uska URL Supabase `gallery` table mein save ho jayega
- Homepage ka Gallery section ab static placeholder ki jagah is table se live images dikhayega, click karne par lightbox mein bada dekh sakte ho

---

## PART 9 — "Master AI Prompt" (Paste into Claude / Cursor / bolt.new / v0.dev)

Isko copy karke seedha AI coding tool mein paste karo — ye scaffold generate karega jisko tum upar diye gaye schema/design ke sath customize karoge:

```
Build a modern, professional bilingual (English/Marathi) marketing + lead-generation
website for a Business Expo event in Next.js (App Router, JavaScript, Tailwind CSS).

Theme: Business Opportunity, Investment & Franchise Expo 2026, held during Nashik Kumbh
Mela, organized by Brightlink Infotel Solutions Pvt. Ltd.

Design: Modern, premium, colorful — primary color #E85D04 (saffron), secondary #14213D
(navy blue), accent #FFB703 (gold), background #FFF8F0. Fonts: Poppins for headings,
Inter for body text. Fully responsive, mobile-first, smooth animations on scroll,
card-based layout, sticky navigation with a language switcher button (EN/MR).

Pages/sections needed: Hero with countdown timer to event date, About the Expo, Why
Nashik Kumbh, Key Statistics (animated counters), Expo Sectors grid, Why Exhibit,
Stall Categories with pricing cards, Sponsorship tiers, Visitor Registration form,
Exhibitor/Stall Booking inquiry form, Sponsors logo grid, Gallery (image grid with
lightbox), Contact section with Google Map embed and inquiry form.

Each form submits to a Supabase table via @supabase/supabase-js (client already
configured in src/lib/supabase.js, tables: visitors, exhibitor_inquiries,
sponsor_inquiries, contact_messages — matching the columns I already created).

Use react-i18next for the language switcher — text should NOT reload the page, only
translate labels/headings via translation keys (I already have en.json and mr.json).

Keep it a single clean component tree, no unused libraries, accessible (proper labels,
alt text), fast-loading (optimized images, lazy loading), SEO meta tags on every page.
```

---

## PART 10 — Roadmap (Phase 2 Onwards — Post Day-1)

| Phase | Kya add karna hai | Tools |
|---|---|---|
| Phase 2 | Admin dashboard (leads dekhna, status update karna) | Supabase Auth + protected Next.js routes |
| Phase 3 | Stall map + real-time availability + payment (Razorpay) | Razorpay + Supabase realtime |
| Phase 4 | QR-code visitor pass + check-in scanner | `qrcode` npm package + phone camera scanner (`html5-qrcode`) |
| Phase 5 | WhatsApp/SMS auto-confirmation | WhatsApp Cloud API / Twilio |
| Phase 6 | Exhibitor directory + B2B meeting scheduler | Custom Next.js pages + Supabase tables (schema similar to what's above, extend as needed) |
| Phase 7 | Multi-year event architecture, job fair, awards module | Extend schema — separate `events`, `awards`, `jobs` tables |

**Security basics (mat bhoolna, chahe Phase 1 ho):** Supabase RLS (already added above), HTTPS (Vercel free default), form validation (client + server-side check before insert), rate-limiting on forms (Supabase Edge Function ya simple debounce), never expose Supabase `service_role` key on frontend — sirf `anon` key public hota hai.

---

*Ye guide Krishithon.com aur KrushiMahotsav.org ki structure se inspired hai, lekin apna original design/branding/database ke sath.*
