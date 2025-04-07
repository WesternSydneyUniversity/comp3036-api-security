/**
 * Unit tests for the blogging app API routes using Vitest.
 * Tests authentication and secured route behavior.
 */
import { createMocks as mocked, type RequestMethod } from "node-mocks-http";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/admin/post/route";
import { auth } from "../app/api/auth/[...nextauth]/options";
import { POST as LoginPOST } from "../app/api/login/route";

function createMocks({ method, body }: { method: RequestMethod; body: any }) {
  const { req, res } = mocked({ method, body });
  req.json = () => Promise.resolve(body);
  return { req, res };
}

// Mock NextAuth session at the top level
vi.mock("../app/api/auth/[...nextauth]/options", () => ({
  auth: vi.fn(),
}));

describe("API Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Secured route denies unauthenticated access
  it("POST /api/admin/post fails without authentication", async () => {
    // Ensure mock is set for this test
    vi.mocked(auth).mockResolvedValue(null);
    const { req, res } = createMocks({
      method: "POST",
      body: { title: "Test Post", content: "This is a test post" },
    });

    const result = await POST(req as any);
    expect(result.status).toBe(401);
    expect(await result.json()).toEqual({ error: "Unauthorized" });
  });

  // Test 2: Secured route allows authenticated access
  it("POST /api/admin/post succeeds with authentication", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { name: "admin" } });
    const { req, res } = createMocks({
      method: "POST",
      body: { title: "Test Post", content: "This is a test post" },
    });

    const result = await POST(req as any);
    expect(result.status).toBe(201);
    const response = await result.json();
    expect(response.message).toBe("Post created");
    expect(response.post.title).toBe("Test Post");
  });

  // Test 3: Login with correct credentials
  it("POST /api/login succeeds with valid credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { username: "admin", password: "password123" },
    });

    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    const result = await LoginPOST(req as any);
    expect(result.status).toBe(200);
    expect(await result.json()).toEqual({ message: "Login successful" });
  });

  // Test 4: Login fails with invalid credentials
  it("POST /api/login fails with invalid credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { username: "admin", password: "wrong" },
    });

    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const result = await LoginPOST(req as any);
    expect(result.status).toBe(401);
    expect(await result.json()).toEqual({ error: "Invalid credentials" });
  });

  // Test 5: Secured route fails with incorrect data shape
  it("POST /api/admin/post fails with incorrect data shape", async () => {
    vi.mocked(auth).mockResolvedValue({ user: { name: "admin" } });
    const { req, res } = createMocks({
      method: "POST",
      body: { title: "Test Post" }, // Missing 'content' field
    });

    const result = await POST(req as any);
    expect(result.status).toBe(400);
    const body = await result.json();
    console.log(body);
    expect(body).toMatchObject({ error: "Invalid Data" });
  });
});
