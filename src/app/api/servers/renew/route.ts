import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

const PLANS = {
  starter:  { price7: 20,  price30: 60  },
  standard: { price7: 40,  price30: 140 },
  pro:      { price7: 80,  price30: 280 },
  power:    { price7: 150, price30: 520 },
} as const;

type PlanKey = keyof typeof PLANS;
type Duration = 7 | 30;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));

  let body: { serverId: string; duration: Duration };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { serverId, duration } = body;

  if (!serverId || ![7, 30].includes(duration)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const record = await col.findOne({ discordId: user.id });

  if (!record) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const server = (record.servers ?? []).find((s: { id: string }) => s.id === serverId);
  if (!server) return NextResponse.json({ error: "Server not found." }, { status: 404 });
  if (server.status === "deleted") return NextResponse.json({ error: "Server has been deleted and cannot be renewed." }, { status: 400 });

  const plan = server.plan as PlanKey;
  const cost = duration === 7 ? PLANS[plan].price7 : PLANS[plan].price30;

  if (record.credits < cost) {
    return NextResponse.json({ error: `Not enough credits. You need ${cost} credits.` }, { status: 400 });
  }

  const currentExpiry = new Date(server.expiresAt).getTime();
  const base = currentExpiry > Date.now() ? currentExpiry : Date.now();
  const newExpiry = new Date(base + duration * 24 * 60 * 60 * 1000);

  await col.updateOne(
    { discordId: user.id, "servers.id": serverId },
    {
      $inc: { credits: -cost },
      $set: {
        "servers.$.expiresAt": newExpiry,
        "servers.$.status": "active",
        "servers.$.duration": duration,
      },
    }
  );

  const updated = await col.findOne({ discordId: user.id });

  return NextResponse.json({
    success: true,
    newExpiry: newExpiry.toISOString(),
    creditsLeft: updated?.credits ?? 0,
  });
}