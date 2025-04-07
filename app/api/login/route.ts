/**
 * API route to handle login requests for testing purposes.
 * In a real app, you'd use a frontend form with NextAuth's signIn function.
 */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Simulate NextAuth signIn (normally client-side, here for API testing)
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/signin/credentials`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, csrfToken: "dummy" }), // Dummy CSRF for demo
      }
    );

    if (res.ok) {
      return NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
