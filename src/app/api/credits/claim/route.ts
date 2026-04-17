import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

const DAILY_LIMIT = 10;
const COOLDOWN_MS = 2 * 1000;
const CAPTCHA_EVERY = 3;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
  const db = (await clientPromise).db();
  const record = await db.collection("users").findOne({ discordId: user.id });

  const now = Date.now();
  const windowStart = record?.windowStart ? new Date(record.windowStart).getTime() : now;
  const hoursSince = (now - windowStart) / (1000 * 60 * 60);
  const claimsToday = hoursSince >= 24 ? 0 : (record?.claimsToday ?? 0);

  return NextResponse.json({
    credits: record?.credits ?? 0,
    claimsToday,
    dailyLimit: DAILY_LIMIT,
    lastClaimAt: record?.lastClaimAt ?? null,
    cooldownMs: COOLDOWN_MS,
    captchaEvery: CAPTCHA_EVERY,
  });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

  let body: { captchaToken?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const now = Date.now();

  const record = await col.findOne({ discordId: user.id });
  const windowStart = record?.windowStart ? new Date(record.windowStart).getTime() : now;
  const hoursSince = (now - windowStart) / (1000 * 60 * 60);
  const claimsToday = hoursSince >= 24 ? 0 : (record?.claimsToday ?? 0);

  if (claimsToday >= DAILY_LIMIT) {
    const resetAt = new Date(windowStart + 24 * 60 * 60 * 1000);
    return NextResponse.json({ error: "Daily limit reached.", resetAt }, { status: 429 });
  }

  const lastClaimAt = record?.lastClaimAt ? new Date(record.lastClaimAt).getTime() : 0;
  const msSinceLast = now - lastClaimAt;
  if (msSinceLast < COOLDOWN_MS) {
    const waitSeconds = Math.ceil((COOLDOWN_MS - msSinceLast) / 1000);
    return NextResponse.json({ error: `Wait ${waitSeconds}s before claiming again.` }, { status: 429 });
  }

  const needsCaptcha = claimsToday > 0 && claimsToday % CAPTCHA_EVERY === 0;

  if (needsCaptcha) {
    if (!body.captchaToken) {
      return NextResponse.json({ error: "Captcha required.", needsCaptcha: true }, { status: 400 });
    }

    const verifyRes = await fetch("https://api.hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET_KEY!,
        response: body.captchaToken,
      }),
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json({ error: "Captcha verification failed.", needsCaptcha: true }, { status: 400 });
    }
  }

  const newWindow = hoursSince >= 24;

  await col.updateOne(
    { discordId: user.id },
    {
      $inc: { credits: 1 },
      $set: {
        lastClaimAt: new Date(now),
        ...(newWindow ? { windowStart: new Date(now), claimsToday: 1 } : { claimsToday: claimsToday + 1 }),
      },
      $setOnInsert: { discordId: user.id },
    },
    { upsert: true }
  );

  const updated = await col.findOne({ discordId: user.id });

  return NextResponse.json({
    success: true,
    credits: updated?.credits ?? 0,
    claimsToday: newWindow ? 1 : claimsToday + 1,
    dailyLimit: DAILY_LIMIT,
  });
}