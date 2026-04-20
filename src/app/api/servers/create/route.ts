import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { createPteroUser, getPteroUserByExternalId, getPteroUserByEmail, createPteroServer } from "@/lib/pterodactyl";

const PLANS = {
  starter:  { name: "Starter",  ram: 256,  cpu: 20,  storage: 1024,  price7: 20,  price30: 60  },
  standard: { name: "Standard", ram: 1024, cpu: 50,  storage: 2048,  price7: 40,  price30: 140 },
  pro:      { name: "Pro",      ram: 2048, cpu: 100, storage: 4096,  price7: 80,  price30: 280 },
  power:    { name: "Power",    ram: 4096, cpu: 150, storage: 6144,  price7: 150, price30: 520 },
} as const;

type PlanKey = keyof typeof PLANS;
type Duration = 7 | 30;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

  let body: { name: string; language: "nodejs" | "python"; plan: PlanKey; duration: Duration };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { name, language, plan, duration } = body;

  if (!name || !language || !plan || !duration) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!["nodejs", "python"].includes(language)) {
    return NextResponse.json({ error: "Invalid language." }, { status: 400 });
  }

  if (!PLANS[plan]) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  if (![7, 30].includes(duration)) {
    return NextResponse.json({ error: "Invalid duration." }, { status: 400 });
  }

  const selectedPlan = PLANS[plan];
  const cost = duration === 7 ? selectedPlan.price7 : selectedPlan.price30;

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const record = await col.findOne({ discordId: user.id });

  if (!record || record.credits < cost) {
    return NextResponse.json({ error: `Not enough credits. You need ${cost} credits.` }, { status: 400 });
  }

  const email = user.email ?? `${user.id}@dynexus.space`;
  let pteroUser = await getPteroUserByExternalId(user.id);
  if (!pteroUser) {
    pteroUser = await getPteroUserByEmail(email);
  }
  if (!pteroUser) {
    pteroUser = await createPteroUser(user.id, user.username, email);
  }

  let pteroServer;
  try {
    pteroServer = await createPteroServer({
      name: name.trim(),
      pteroUserId: pteroUser.id,
      language,
      plan: {
        ram: selectedPlan.ram,
        cpu: selectedPlan.cpu,
        storage: selectedPlan.storage,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create server.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const server = {
    id: crypto.randomUUID(),
    pteroId: pteroServer.id,
    pteroUuid: pteroServer.uuid,
    name: name.trim(),
    language,
    plan,
    duration,
    cost,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
    status: "active",
  };

  await col.updateOne(
    { discordId: user.id },
    {
      $inc: { credits: -cost },
      $push: { servers: server },
    }
  );

  return NextResponse.json({
    success: true,
    server,
    creditsLeft: record.credits - cost,
    panelUrl: `${process.env.PTERODACTYL_URL}/server/${pteroServer.uuid}`,
  });
}