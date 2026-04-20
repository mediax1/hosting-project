import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=no_code", request.url));
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/login?error=token_failed", request.url));
    }

    const tokenData = await tokenRes.json();

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/login?error=user_failed", request.url));
    }

    const user = await userRes.json();

    const db = (await clientPromise).db();
    const col = db.collection("users");

    const existing = await col.findOne({ discordId: user.id });

    if (!existing) {
      await col.insertOne({
        discordId: user.id,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        credits: 10,
        claimsToday: 0,
        claimDate: null,
        lastClaimAt: null,
        servers: [],
        createdAt: new Date(),
      });
    }

    const payload = {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
    };

    const token = Buffer.from(JSON.stringify(payload)).toString("base64");
    const response = NextResponse.redirect(new URL("/panel", request.url));

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=server_error", request.url));
  }
}