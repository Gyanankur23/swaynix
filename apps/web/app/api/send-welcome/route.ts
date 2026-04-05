import { NextResponse } from "next/server";

const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/k69woaycvnll1j5fk8inotl68oolevpr";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const url = `${MAKE_WEBHOOK_URL}?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || "New User")}`;
    
    console.log("📧 Sending welcome email via server to:", email);
    
    const response = await fetch(url, {
      method: "GET",
    });

    console.log("✅ Welcome email sent successfully to:", email);
    
    return NextResponse.json({ 
      success: true, 
      message: "Welcome email sent" 
    });
  } catch (error) {
    console.error("❌ Failed to send welcome email:", error);
    return NextResponse.json({ 
      error: "Failed to send email",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
