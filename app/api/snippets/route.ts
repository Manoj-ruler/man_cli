import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: tokenRow } = await supabase
      .from("api_tokens")
      .select("user_id")
      .eq("token", token)
      .single();

    if (!tokenRow) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("custom_snippets")
      .select("*")
      .eq("user_id", tokenRow.user_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: tokenRow } = await supabase
      .from("api_tokens")
      .select("user_id")
      .eq("token", token)
      .single();

    if (!tokenRow) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const { label, command, description, tags } = body;

    if (!label || !command) {
      return NextResponse.json(
        { error: "label and command are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("custom_snippets")
      .insert({
        user_id: tokenRow.user_id,
        label,
        command,
        description: description || null,
        tags: tags || [],
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
