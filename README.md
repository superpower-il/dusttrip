# DustTrip 🚙

פלטפורמה לתיאום טיולי שטח בישראל - מחברת בין מובילי טיולים לבעלי רכבי שטח

## תכונות עיקריות

- 🔐 **אימות משתמשים** - התחברות עם אימייל/סיסמה
- 👤 **ניהול פרופיל** - פרטים אישיים ופרטי רכב מלאים
- 🚗 **רישום רכבים** - מפרט טכני מפורט (מוגבה, נעילות, הילוך כוח, ממוגן)
- 🗺️ **יצירת טיולים** - למובילים מאושרים בלבד
- 📋 **הרשמה לטיולים** - בדיקה אוטומטית של התאמת רכב
- 🔢 **ספירת משתתפים** - תצוגה בולטת של מקומות פנויים
- 🎯 **סינון חכם** - לפי אזור ורמת קושי

## טכנולוגיות

- **Frontend:** React + TypeScript + Tailwind CSS + Vite
- **Backend:** Supabase (PostgreSQL + Authentication + Realtime)
- **PWA Ready:** מותאם למובייל ודסקטופ

## התקנה

1. שכפל את הפרויקט:
```bash
git clone https://github.com/YOUR_USERNAME/dusttrip.git
cd dusttrip
```

2. התקן תלויות:
```bash
npm install
```

3. הגדר משתני סביבה - צור קובץ `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. הרץ את מסד הנתונים:
- היכנס ל-Supabase Dashboard
- הרץ את `supabase-schema.sql` ב-SQL Editor

5. הפעל את השרת:
```bash
npm run dev
```

## מבנה הפרויקט

```
src/
├── pages/          # דפי המערכת
│   ├── AuthPage.tsx          # התחברות/רישום
│   ├── ProfileSetupPage.tsx  # השלמת פרופיל
│   ├── ProfilePage.tsx       # עריכת פרופיל
│   ├── HomePage.tsx          # רשימת טיולים
│   └── CreateTripPage.tsx    # יצירת טיול (מובילים)
├── types/          # TypeScript types
├── lib/            # Supabase client
└── App.tsx         # ניהול routing ו-auth state
```

## תרומה לפרויקט

תרומות מתקבלות בברכה! פתח Pull Request או דווח על בעיות ב-Issues.

## רישיון

MIT License

---

**נבנה עם ❤️ לקהילת מטיילי השטח בישראל**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
