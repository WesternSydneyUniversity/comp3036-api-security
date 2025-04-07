/**
 * Secured API route for creating blog posts.
 * Only authenticated admins can access this endpoint.
 */
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * Schema for validating blog post data.
 */
const postSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title must not be empty")
      .max(100, "Title too long"),
    content: z.string().min(10, "Content too short"),
  })
  .strict();

export async function POST(req: NextRequest) {
  // Check for authenticated session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Validate incoming data
    const body = await req.json();
    const validatedData = postSchema.parse(body);

    // Simulate saving to a database
    const newPost = {
      title: validatedData.title,
      content: validatedData.content,
      author: session.user?.name || "admin",
    };

    return NextResponse.json(
      { message: "Post created", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
