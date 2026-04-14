import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

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
