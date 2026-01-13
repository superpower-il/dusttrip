# DustTrip - מסמך אפיון מוצר (PRD)

## סקירה כללית

**שם המוצר:** DustTrip
**תיאור:** פלטפורמה לתיאום טיולי שטח בישראל - מחברת בין מובילי טיולים לבעלי רכבי שטח
**קהל יעד:** קהילת מטיילי השטח בישראל
**שפה:** עברית (RTL)
**פלטפורמה:** PWA (Progressive Web App) - מותאם למובייל ודסקטופ

---

## סוגי משתמשים

### 1. מטייל (Participant)
- כל משתמש רשום
- יכול להירשם לטיולים
- יכול להפוך למוביל

### 2. מוביל (Leader)
- מטייל שעבר אישור אדמין
- יכול ליצור ולנהל טיולים
- נשאר גם מטייל (יכול להירשם לטיולים של אחרים)

### 3. אדמין (Admin)
- מאשר מובילים חדשים
- ניהול כללי של המערכת

---

## תהליכים עיקריים

### רישום והתחברות
- אימייל + סיסמה
- Google OAuth
- Facebook OAuth
- מספר טלפון (חובה - לצורך התראות WhatsApp)

### תהליך אישור מוביל
1. מטייל רשום ממלא טופס בקשה להיות מוביל
2. הטופס כולל הצהרת ניסיון
3. אדמין מקבל התראה על בקשה חדשה
4. אדמין מאשר/דוחה (עם סיבה)
5. המטייל מקבל התראה על התוצאה

### יצירת טיול (מוביל)
פרטי הטיול:
- שם הטיול
- תיאור
- אזור (נגב, גולן, יהודה ושומרון, ערבה, וכו')
- מיקום ספציפי (לדוגמה: נחל נקרות)
- תאריך ושעת התחלה
- משך משוער (שעות/ימים)
- נקודת מפגש (כתובת + קואורדינטות)
- רמת קושי (קל / בינוני / קשה)
- מינימום משתתפים (לקיום הטיול)
- מקסימום רכבים
- דרישות רכב:
  - [ ] מוגבה
  - [ ] נעילות דיפרנציאל
  - [ ] הילוך כוח (4L)
  - [ ] ממוגן (גחון + מיכל)
- מחיר (אופציונלי - התשלום מחוץ לאפליקציה)
- לינק למסלול ב-Ofroad
- האם כולל לינה (כן/לא)
- הערות נוספות

### הרשמה לטיול (מטייל)
1. מטייל צופה בטיול
2. מערכת בודקת התאמת רכב לדרישות
3. אם מתאים - כפתור "הרשמה"
4. אם לא מתאים - הודעה "הרכב שלך לא עומד בדרישות: [פירוט]"
5. מוביל מקבל התראה על הרשמה חדשה
6. מוביל מאשר/דוחה (עם סיבה אם דוחה)
7. מטייל מקבל התראה על התוצאה
8. אם הטיול מלא - נכנס לרשימת המתנה

### ביטול הרשמה
- מטייל יכול לבטל עד 12 שעות לפני הטיול
- בביטול - הבא ברשימת ההמתנה מקבל התראה והצעה להצטרף
- לבא יש X שעות לאשר לפני שעובר להבא בתור

### ביטול טיול (מוביל)
- מוביל יכול לבטל טיול
- כל המשתתפים מקבלים התראה
- נרשם בהיסטוריה של המוביל

---

## פרופילים

### פרופיל מטייל
- שם מלא
- תמונה
- טלפון (לווטסאפ)
- כתובת מגורים (לחישוב זמן נסיעה)
- פרטי רכב:
  - יצרן ודגם
  - שנה
  - מוגבה (כן/לא)
  - נעילות (כן/לא)
  - הילוך כוח (כן/לא)
  - ממוגן (כן/לא)
- ציוד חילוץ (חובה לאשר שיש!)
- היסטוריית טיולים
- דירוגים שנתן

### פרופיל מוביל (בנוסף לפרופיל מטייל)
- ביוגרפיה / ניסיון
- אזורי התמחות
- מספר טיולים שהוביל
- דירוג ממוצע
- היסטוריית טיולים שהוביל

**כל הפרופילים גלויים לכל המשתמשים**

---

## העדפות והתראות

### העדפות מטייל
- אזורים מועדפים (מולטי-בחירה)
- רמות קושי מועדפות (מולטי-בחירה)
- טווח תאריכים (סופ"ש בלבד / גם באמצע שבוע)

### התראות WhatsApp
1. **טיול חדש רלוונטי** - לפי העדפות
2. **סטטוס הרשמה** - אישור/דחייה
3. **תזכורת לפני טיול** - ערב לפני, כולל:
   - שעה מומלצת לצאת מהבית (לפי כתובת המשתמש)
   - פרטי נקודת המפגש
   - לינק למסלול
4. **יציאה מרשימת המתנה** - כשמתפנה מקום
5. **ביטול טיול** - התראה מיידית
6. **למוביל:** הרשמה חדשה לטיול שלו

---

## דירוג וביקורות

### אחרי טיול
- משתתפים יכולים לדרג את המוביל (1-5 כוכבים)
- אפשרות להוסיף ביקורת טקסטואלית
- הדירוגים מוצגים בפרופיל המוביל

---

## מבנה טכני

### Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Supabase
  - Authentication (Email, Google, Facebook, Phone)
  - PostgreSQL Database
  - Row Level Security
  - Realtime subscriptions
- **התראות:** WhatsApp Business API
- **מפות:** Google Maps API (להצגת נקודות מפגש)
- **PWA:** Service Worker לחוויה native-like

### מבנה Database (Supabase)

```sql
-- משתמשים (מורחב מ-auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  address TEXT,
  address_lat DECIMAL,
  address_lng DECIMAL,
  is_leader BOOLEAN DEFAULT FALSE,
  leader_approved_at TIMESTAMP,
  leader_bio TEXT,
  leader_experience TEXT,
  leader_specialties TEXT[], -- אזורי התמחות
  created_at TIMESTAMP DEFAULT NOW()
);

-- פרטי רכב
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles NOT NULL,
  manufacturer TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  is_lifted BOOLEAN DEFAULT FALSE, -- מוגבה
  has_lockers BOOLEAN DEFAULT FALSE, -- נעילות
  has_low_gear BOOLEAN DEFAULT FALSE, -- הילוך כוח
  is_armored BOOLEAN DEFAULT FALSE, -- ממוגן
  has_rescue_gear BOOLEAN DEFAULT FALSE, -- ציוד חילוץ (חובה!)
  created_at TIMESTAMP DEFAULT NOW()
);

-- אזורים
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, -- נגב, גולן, וכו'
  name_en TEXT
);

-- טיולים
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leader_id UUID REFERENCES profiles NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  region_id UUID REFERENCES regions,
  specific_location TEXT, -- נחל נקרות
  meeting_point_address TEXT,
  meeting_point_lat DECIMAL,
  meeting_point_lng DECIMAL,
  start_date TIMESTAMP NOT NULL,
  duration_hours INTEGER,
  includes_overnight BOOLEAN DEFAULT FALSE,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  min_participants INTEGER DEFAULT 1,
  max_vehicles INTEGER NOT NULL,
  price DECIMAL, -- אופציונלי
  ofroad_link TEXT,
  -- דרישות רכב
  requires_lifted BOOLEAN DEFAULT FALSE,
  requires_lockers BOOLEAN DEFAULT FALSE,
  requires_low_gear BOOLEAN DEFAULT FALSE,
  requires_armored BOOLEAN DEFAULT FALSE,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- הרשמות לטיולים
CREATE TABLE trip_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips NOT NULL,
  user_id UUID REFERENCES profiles NOT NULL,
  vehicle_id UUID REFERENCES vehicles NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'waitlist', 'cancelled')),
  rejection_reason TEXT,
  waitlist_position INTEGER,
  registered_at TIMESTAMP DEFAULT NOW(),
  status_updated_at TIMESTAMP,
  UNIQUE(trip_id, user_id)
);

-- בקשות להיות מוביל
CREATE TABLE leader_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles NOT NULL,
  experience_description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES profiles,
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

-- דירוגים
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips NOT NULL,
  from_user_id UUID REFERENCES profiles NOT NULL,
  to_leader_id UUID REFERENCES profiles NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(trip_id, from_user_id)
);

-- העדפות משתמש
CREATE TABLE user_preferences (
  user_id UUID REFERENCES profiles PRIMARY KEY,
  preferred_regions UUID[], -- מערך של region IDs
  preferred_difficulties TEXT[], -- ['easy', 'medium']
  weekends_only BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- לוג התראות
CREATE TABLE notifications_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles NOT NULL,
  type TEXT NOT NULL,
  content JSONB,
  sent_at TIMESTAMP DEFAULT NOW(),
  whatsapp_message_id TEXT
);
```

### Row Level Security (דוגמאות)

```sql
-- כל אחד יכול לראות פרופילים
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- רק המשתמש יכול לערוך את הפרופיל שלו
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- רק מובילים מאושרים יכולים ליצור טיולים
CREATE POLICY "Only approved leaders can create trips" ON trips
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND is_leader = TRUE
    )
  );
```

---

## מסכים עיקריים

### 1. דף הבית
- רשימת טיולים קרובים
- פילטור לפי אזור/קושי/תאריך
- חיפוש

### 2. דף טיול
- כל פרטי הטיול
- רשימת משתתפים מאושרים
- כפתור הרשמה / הצטרפות לרשימת המתנה
- מפה עם נקודת המפגש
- לינק לאופרואד
- פרופיל המוביל

### 3. פרופיל משתמש
- פרטים אישיים
- פרטי רכב
- היסטוריית טיולים
- דירוגים (אם מוביל)
- כפתור "רוצה להיות מוביל"

### 4. ניהול טיול (למוביל)
- רשימת נרשמים
- אישור/דחיית משתתפים
- רשימת המתנה
- ביטול טיול

### 5. יצירת טיול (למוביל)
- טופס עם כל השדות

### 6. הגדרות
- העדפות אזורים וקושי
- הגדרות התראות

### 7. אדמין
- רשימת בקשות מובילים
- אישור/דחייה
- סטטיסטיקות כלליות

---

## פיצ'רים עתידיים (לא ב-MVP)

- [ ] צ'אט קבוצתי לטיול
- [ ] שיתוף תמונות מהטיול
- [ ] אינטגרציה עם Waze לניווט
- [ ] תשלום באפליקציה
- [ ] אפליקציה native (iOS/Android)
- [ ] מערכת נקודות/הישגים למטיילים פעילים

---

## נספח: הודעות WhatsApp

### תבנית: טיול חדש רלוונטי
```
🚙 טיול חדש ב-DustTrip!

{שם הטיול}
📍 {אזור} - {מיקום ספציפי}
📅 {תאריך ושעה}
⭐ רמת קושי: {קושי}
👤 מוביל: {שם המוביל}

לפרטים והרשמה:
{לינק}
```

### תבנית: תזכורת ערב לפני
```
🌅 מחר יוצאים לשטח!

{שם הטיול}
📍 נקודת מפגש: {כתובת}
⏰ שעת התחלה: {שעה}

🚗 מומלץ לצאת מהבית ב-{שעה מחושבת}
(לפי הכתובת שלך, כולל מרווח ביטחון)

🗺️ מסלול: {לינק אופרואד}

בהצלחה! 🤙
```

### תבנית: אישור הרשמה
```
✅ ההרשמה אושרה!

{שם הטיול}
📅 {תאריך}

המוביל {שם} אישר את ההשתתפות שלך.
נתראה בשטח! 🏜️
```

### תבנית: דחיית הרשמה
```
ההרשמה לטיול "{שם הטיול}" לא אושרה.

סיבה: {סיבת הדחייה}

אפשר לחפש טיולים נוספים:
{לינק}
```

---

*מסמך זה הוא בסיס לפיתוח. ייתכנו שינויים במהלך הפיתוח.*
