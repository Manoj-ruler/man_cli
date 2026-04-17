import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const rateMap = new Map<string, { count: number; reset: number }>();
const LIMIT = 60; // 60 requests
const WINDOW = 60_000; // per minute

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateMap.get(ip) ?? { count: 0, reset: now + WINDOW };

  if (now > entry.reset) {
    entry.count = 0;
    entry.reset = now + WINDOW;
  }

  entry.count++;
  rateMap.set(ip, entry);
  return entry.count > LIMIT;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Validate token
    const { data: tokenRow } = await supabase
      .from("api_tokens")
      .select("user_id")
      .eq("token", token)
      .single();

    if (!tokenRow) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { query_text, matched_command, category, response_time_ms, success } =
      body;

    // Validate required fields
    if (!query_text || !matched_command) {
      return NextResponse.json(
        { error: "query_text and matched_command are required" },
        { status: 400 }
      );
    }

    // Insert query log
    const { data, error } = await supabase
      .from("command_queries")
      .insert({
        user_id: tokenRow.user_id,
        query_text,
        matched_command,
        category: category || null,
        response_time_ms: response_time_ms || null,
        success: success !== undefined ? success : true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
