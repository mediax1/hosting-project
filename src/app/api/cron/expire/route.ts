import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { deletePteroServer } from "@/lib/pterodactyl";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = (await clientPromise).db();
  const col = db.collection("users");
  const now = new Date();

  const users = await col.find({ "servers.expiresAt": { $lte: now } }).toArray();

  let deleted = 0;
  let failed = 0;

  for (const user of users) {
    const expiredServers = (user.servers ?? []).filter(
      (s: { expiresAt: Date; status: string }) =>
        new Date(s.expiresAt).getTime() <= now.getTime() && s.status !== "deleted"
    );

    for (const server of expiredServers) {
      try {
        if (server.pteroId) {
          await deletePteroServer(server.pteroId);
        }
        await col.updateOne(
          { discordId: user.discordId, "servers.id": server.id },
          { $set: { "servers.$.status": "deleted" } }
        );
        deleted++;
      } catch {
        failed++;
      }
    }
  }

  return NextResponse.json({ success: true, deleted, failed, ran: now });
}