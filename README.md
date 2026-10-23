# MandiReturn - Agri Transport Exchange (0% Commission)

> **Mobile-First Agri-Logistics Platform** connecting Mandi Vyaparis, Kisan (Farmers), and Commercial Truck Drivers across India.

---

## 🌟 Key Features

1. **Screen 1: Home Feed (Feed & Discovery)**
   - **MandiReturn Header**: Logo, tagline, unread notification alerts, and active role switcher badge (*R Driver*, *S Vyapari*, *D Kisan*).
   - **Filter Tabs**: *Sabhi (All)*, *Return Trucks (Vehicle Available)*, *Maal Loads (Load Available)*.
   - **Search Bar**: Real-time filtering by Mandi (Indore, Chhindwara, Betul, Nagpur, Mumbai), vehicle type, or crop.
   - **Maal Load Card**: Red pin (Origin Mandi) to Green checkered flag (Destination), dotted route connector with Target Bhada (e.g. ₹3,500), vehicle requirement (*Chota Hathi / Ace*), and one-tap **Call Vyapari** + **WhatsApp** buttons with pre-filled Hinglish context.
   - **Empty Return Truck Card**: Truck icon, model (*Tata 407 Open Body*), Driver name, vehicle plate, departure time, capacity, and direct **Call Driver** + **WhatsApp** buttons.

2. **Screen 2: Post Route / Maal (+ Voice-to-Text Feature)**
   - **Dual Persona Switch**: *"Main Driver Hoon (Gadi Khali Hai)"* vs *"Main Vyapari Hoon (Maal Bhejna Hai)"*.
   - **Highlighted Voice AI Box**: *"SABSE AASAN OPTION - Likhna nahi aata? Bol kar post karein!"*.
   - **Web Speech API (`webkitSpeechRecognition`)**: Hindi & Hinglish natural voice input (e.g., *"Nagpur mandi se Chhindwara ke liye pickup khali hai"*). Intelligently parses origin, destination, vehicle type, target rate, departure time, and notes to auto-populate form fields.
   - **1-Tap Sample Prompts**: For testing voice parsing without microphone permissions.
   - **Form Validation & Publish**: Immediately creates post via `/api/posts/create` and updates feed.

3. **Screen 3: Pass & Profile (Driver Monetization & Stats)**
   - **Profile Header**: Driver initials, verified tick, vehicle plate, location, and 4.9 rating.
   - **Driver Membership Card**: Dark gradient banner (`#0F172A` to `#064E3B`) with Golden Crown:
     - *"Return Load Unlimited Pass"*
     - *0% Commission - Poora bhada aapka*
     - *Interstate mandi vyapariyon ke verified contacts*
     - *WhatsApp aur Direct Call support*
     - *MONTHLY PASS ₹299 / mahina*
     - **Membership Activation Modal**: Simulated UPI payment (Google Pay, PhonePe, Paytm) that activates the pass for 30 days via `/api/membership/activate`.
   - **Stats Box**: *Successful Return Trips: 14 Trips* and *Est. Diesel Bachat: ₹28,500*.
   - **Settings & KYC**: Aadhaar & Driving License verified badge, multi-language selector (Hindi, English/Hinglish, Marathi, Gujarati), 24x7 Mandi Helpline.

4. **Screen 4: Login & Quick Onboarding**
   - **Role Chooser**: Driver, Vyapari, Kisan cards.
   - **Mobile Number Authentication**: 10-digit Indian phone input.
   - **OTP Simulation**: 4-digit code verification with 1-tap Auto Fill.
   - **Quick Demo Persona Switcher**: Switch between Ramesh Yadav (Driver) and Suresh Patidar (Vyapari) in one click.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router, `src/` directory)
- **UI & Styling**: Tailwind CSS, Lucide React icons, mobile shell container
- **Database ORM**: Prisma ORM with SQLite (`dev.db`), architected for PostgreSQL
- **Voice AI**: Browser Web Speech API (`webkitSpeechRecognition`) + Custom Hindi/Hinglish NLP parser
- **State**: React Context API (`AuthProvider`) persisted to localStorage

---

## 📂 Project Structure

```
d:/MandiSetu/
├── prisma/
│   ├── schema.prisma       # Database schema (User, Post, Membership)
│   ├── seed.ts             # Sample data (Indore, Chhindwara, Betul, Nagpur, Mumbai)
│   └── dev.db              # SQLite local database
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/route.ts
│   │   │   ├── membership/activate/route.ts
│   │   │   ├── posts/create/route.ts
│   │   │   └── posts/route.ts
│   │   ├── login/page.tsx
│   │   ├── post/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx        # Home feed
│   ├── components/
│   │   ├── BottomNav.tsx
│   │   ├── Header.tsx
│   │   ├── MembershipModal.tsx
│   │   ├── PostCard.tsx
│   │   └── VoiceInput.tsx
│   └── lib/
│       ├── auth-context.tsx
│       ├── prisma.ts
│       ├── speech-parser.ts
│       └── types.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client & Push Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 3. Seed Database
```bash
npm run prisma:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser (or use mobile device responsive preview).
