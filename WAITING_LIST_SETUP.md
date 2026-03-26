# Snifr Waiting List - Setup Guide

This guide will help you set up the waiting list feature with Neon DB and SMTP email notifications.

## 📋 Prerequisites

- A [Neon](https://neon.tech) account (free tier available)
- An SMTP provider (Gmail, SendGrid, Mailgun, Resend, etc.)

## 🚀 Setup Steps

### 1. Set Up Neon Database

1. **Create a Neon Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create a New Project**
   - Click "Create a new project"
   - Name it `snifr` (or your preferred name)
   - Choose a region closest to your users

3. **Get Your Connection String**
   - In your project dashboard, find the **Connection String**
   - Copy the **Pooler** connection string (recommended for serverless)
   - It looks like: `postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`

4. **Create the Database Table**
   - In Neon dashboard, go to **Tables** → **SQL Editor**
   - Copy and paste the contents of `database/schema.sql`
   - Click **Run** to execute the SQL

### 2. Configure Environment Variables

1. **Copy the example file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** with your credentials:
   ```env
   # Neon Database
   DATABASE_URL=postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/snifr?sslmode=require

   # SMTP (Gmail example)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_EMAIL=noreply@snifr.app
   ```

### 3. SMTP Setup Options

#### Option A: Gmail (Free)
1. Go to your Google Account settings
2. Enable **2-Factor Authentication**
3. Generate an **App Password**: [https://support.google.com/accounts/answer/185833](https://support.google.com/accounts/answer/185833)
4. Use the app password as `SMTP_PASS`

#### Option B: SendGrid (Free 100 emails/day)
1. Sign up at [https://sendgrid.com](https://sendgrid.com)
2. Create an API Key with "Full Access"
3. Use SMTP settings:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASS=SG.xxxxxxxxxxxxxx
   ```

#### Option C: Resend (Developer-friendly)
1. Sign up at [https://resend.com](https://resend.com)
2. Get your API key
3. Use their SMTP settings (check Resend docs)

### 4. Test the Setup

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Navigate to the website**
   - Open `http://localhost:3000`
   - Scroll to the "Join the Pack" waiting list section

3. **Submit an email**
   - Enter a valid email address
   - Click "🐾 Join Waiting List"
   - You should receive a confirmation email

4. **Verify in Database**
   - Go to your Neon dashboard
   - Navigate to **Tables** → **waiting_list**
   - You should see the new entry

## 📊 Database Schema

The `waiting_list` table includes:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier |
| `email` | VARCHAR(255) | User's email (unique) |
| `subscribed_at` | TIMESTAMP | When they joined |
| `status` | VARCHAR(50) | pending/notified/bounced/unsubscribed |
| `source` | VARCHAR(100) | Where they signed up (website, etc.) |
| `metadata` | JSONB | Additional data (IP, user agent, etc.) |

## 🔍 Query Examples

### Get total waiting list count
```sql
SELECT COUNT(*) as total_subscribers FROM waiting_list;
```

### Get recent signups
```sql
SELECT email, subscribed_at, status 
FROM waiting_list 
ORDER BY subscribed_at DESC 
LIMIT 100;
```

### Get pending subscribers (not yet notified)
```sql
SELECT email, subscribed_at 
FROM waiting_list 
WHERE status = 'pending';
```

## 🛡️ Security Notes

- Never commit `.env.local` to version control
- The `.gitignore` already excludes `.env.local`
- Use environment variables in production (Vercel, etc.)
- Rate limiting should be added for production use

## 🚨 Troubleshooting

### "DATABASE_URL is not set"
- Make sure `.env.local` exists and has the correct `DATABASE_URL`
- Restart the dev server after changing environment variables

### "Email not sending"
- Check SMTP credentials are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check the server console for detailed error messages

### "Duplicate email" error
- This is expected behavior - the same email can't sign up twice
- The API returns a friendly message for existing emails

## 📈 Next Steps

1. Set up a cron job to send launch notifications
2. Add an unsubscribe endpoint
3. Create an admin dashboard to view subscribers
4. Export subscriber list for marketing campaigns

---

**Need help?** Check the [Neon Docs](https://neon.tech/docs) or [Nodemailer Docs](https://nodemailer.com)
