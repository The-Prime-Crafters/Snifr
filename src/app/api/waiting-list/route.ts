import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import nodemailer from "nodemailer";

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Normalize email (lowercase, trim)
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Create database connection
function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  return neon(process.env.DATABASE_URL);
}

// Create transporter only when needed
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = normalizeEmail(email);

    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.warn("Database not configured. Email would have been stored:", normalizedEmail);
      return NextResponse.json(
        { 
          message: "Database not configured. Please set DATABASE_URL in your environment variables.",
          error: "DATABASE_URL_NOT_SET"
        },
        { status: 503 }
      );
    }

    const sql = getDb();

    // Check if email already exists in the waiting list
    const existingEntry = await sql`
      SELECT id, email, subscribed_at, status 
      FROM waiting_list 
      WHERE email = ${normalizedEmail}
      LIMIT 1
    `;

    if (existingEntry && existingEntry.length > 0) {
      const entry = existingEntry[0];
      
      // If already subscribed, return appropriate message based on status
      if (entry.status === 'unsubscribed') {
        return NextResponse.json(
          { 
            message: "You have previously unsubscribed. Please contact support if you'd like to rejoin.",
            error: "UNSUBSCRIBED"
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          message: "You're already on the waiting list! Keep an eye on your inbox.",
          email: entry.email,
          subscribedAt: entry.subscribed_at,
          isExisting: true
        },
        { status: 200 }
      );
    }

    // Insert new email into the database
    const insertResult = await sql`
      INSERT INTO waiting_list (email, status, source, metadata)
      VALUES (
        ${normalizedEmail},
        'pending',
        'website',
        ${JSON.stringify({
          userAgent: request.headers.get("user-agent") || "unknown",
          ip: request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
          timestamp: new Date().toISOString()
        })}
      )
      RETURNING id, email, subscribed_at
    `;

    const newEntry = insertResult[0];

    console.log(`✅ New waiting list entry: ${normalizedEmail} (ID: ${newEntry.id})`);

    // Send confirmation email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = createTransporter();

        await transporter.sendMail({
          from: `"Snifr" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: normalizedEmail,
          subject: "🐾 Welcome to Snifr's Waiting List!",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: 'Nunito', Arial, sans-serif; background: #FFF0E8; margin: 0; padding: 0; }
                  .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 32px rgba(107,68,35,0.12); }
                  .header { background: linear-gradient(135deg, #FFD6D6, #E8DEFF); padding: 40px 32px; text-align: center; }
                  .logo { font-size: 48px; margin-bottom: 16px; }
                  .header h1 { font-family: 'Comfortaa', cursive; font-size: 28px; font-weight: 700; color: #3D2C24; margin: 0 0 8px 0; }
                  .header p { font-size: 16px; color: #9E7B6A; margin: 0; }
                  .content { padding: 40px 32px; }
                  .content h2 { font-family: 'Comfortaa', cursive; font-size: 22px; font-weight: 700; color: #3D2C24; margin: 0 0 16px 0; }
                  .content p { font-size: 16px; color: #9E7B6A; line-height: 1.7; margin: 0 0 16px 0; }
                  .perks { background: #FFF8F2; border-radius: 16px; padding: 24px; margin: 24px 0; }
                  .perk { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
                  .perk:last-child { margin-bottom: 0; }
                  .perk-icon { font-size: 24px; }
                  .perk-text { font-size: 14px; font-weight: 600; color: #3D2C24; }
                  .cta-button { display: inline-block; background: linear-gradient(135deg, #FF8FAB, #D37DD0); color: white; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 700; font-size: 16px; margin: 24px 0; }
                  .footer { background: #FFF8F2; padding: 24px 32px; text-align: center; border-top: 1px solid #FFD6D6; }
                  .footer p { font-size: 13px; color: #C4A898; margin: 0; }
                  .social { margin-top: 16px; }
                  .social a { display: inline-block; margin: 0 8px; font-size: 20px; text-decoration: none; }
                  .divider { height: 1px; background: #F0E4DA; margin: 24px 0; }
                  .stats { display: flex; justify-content: space-around; margin: 24px 0; }
                  .stat { text-align: center; }
                  .stat-num { font-family: 'Comfortaa', cursive; font-size: 24px; font-weight: 700; color: #A07FDB; }
                  .stat-label { font-size: 12px; color: #9E7B6A; margin-top: 4px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <div class="logo">🐾</div>
                    <h1>Welcome to Snifr!</h1>
                    <p>You're on the waiting list</p>
                  </div>
                  <div class="content">
                    <h2>Hey there! 👋</h2>
                    <p>
                      Thanks for joining Snifr's waiting list! We're thrilled to have you and your furry friend 
                      as part of our growing community.
                    </p>
                    <p>
                      You've been added to our exclusive waiting list. We'll notify you as soon as we launch 
                      in your area!
                    </p>
                    
                    <div class="stats">
                      <div class="stat">
                        <div class="stat-num">2.4k+</div>
                        <div class="stat-label">Pets Registered</div>
                      </div>
                      <div class="stat">
                        <div class="stat-num">840+</div>
                        <div class="stat-label">Playdates Booked</div>
                      </div>
                      <div class="stat">
                        <div class="stat-num">12+</div>
                        <div class="stat-label">Parks Covered</div>
                      </div>
                    </div>
                    
                    <div class="perks">
                      <div class="perk">
                        <span class="perk-icon">🎁</span>
                        <span class="perk-text">Early Bird Access - Be first to try Snifr</span>
                      </div>
                      <div class="perk">
                        <span class="perk-icon">🏆</span>
                        <span class="perk-text">Founder's Badge - Special profile badge</span>
                      </div>
                      <div class="perk">
                        <span class="perk-icon">💎</span>
                        <span class="perk-text">Free Premium - 3 months on us</span>
                      </div>
                    </div>

                    <div class="divider"></div>

                    <p>
                      In the meantime, follow us on social media for updates, pet care tips, and 
                      sneak peeks of what we're building!
                    </p>
                    
                    <div style="text-align: center;">
                      <a href="https://snifr.app" class="cta-button">Visit Our Website</a>
                    </div>
                  </div>
                  <div class="footer">
                    <p>© 2026 Snifr · Find the perfect friends for your pet</p>
                    <div class="social">
                      <a href="#">📸</a>
                      <a href="#">🐦</a>
                      <a href="#">📱</a>
                    </div>
                    <p style="margin-top: 16px; font-size: 11px;">
                      You received this email because you signed up for Snifr's waiting list.<br>
                      We'll only send you important updates about our launch.
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `
Welcome to Snifr! 🐾

Hey there!

Thanks for joining Snifr's waiting list! We're thrilled to have you and your furry friend as part of our growing community.

You've been added to our exclusive waiting list. We'll notify you as soon as we launch in your area!

Current Community Stats:
• 2.4k+ Pets Registered
• 840+ Playdates Booked
• 12+ Parks Covered

Your Early Bird Perks:
🎁 Early Bird Access - Be first to try Snifr
🏆 Founder's Badge - Special profile badge  
💎 Free Premium - 3 months on us

In the meantime, follow us on social media for updates, pet care tips, and sneak peeks of what we're building!

Visit our website: https://snifr.app

© 2026 Snifr · Find the perfect friends for your pet

---
You received this email because you signed up for Snifr's waiting list.
We'll only send you important updates about our launch.
          `,
        });

        // Update status to notified
        await sql`
          UPDATE waiting_list 
          SET status = 'notified' 
          WHERE id = ${newEntry.id}
        `;

        console.log(`✅ Welcome email sent to: ${normalizedEmail}`);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the request if email fails - user is still in DB
      }
    } else {
      console.log("⚠️ SMTP not configured. Email not sent to:", normalizedEmail);
    }

    return NextResponse.json(
      { 
        message: "Successfully joined the waiting list! Check your email for confirmation.",
        email: newEntry.email,
        id: newEntry.id,
        subscribedAt: newEntry.subscribed_at
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waiting list error:", error);
    
    // Handle unique constraint violation (duplicate email)
    if (error instanceof Error && 'code' in error && (error as any).code === '23505') {
      return NextResponse.json(
        { 
          message: "You're already on the waiting list! Keep an eye on your inbox.",
          isExisting: true
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Something went wrong. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
