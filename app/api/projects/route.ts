import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/** Matches the room IDs generated client-side (slugified name + short suffix). */
const PROJECT_ID_PATTERN = /^[a-z0-9-]{1,64}$/;

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    id?: unknown;
  } | null;
  const rawName = body && typeof body.name === "string" ? body.name.trim() : "";
  const name = rawName.length > 0 ? rawName : "Untitled Project";

  const rawId = body && typeof body.id === "string" ? body.id.trim() : "";
  if (rawId && !PROJECT_ID_PATTERN.test(rawId)) {
    return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
  }

  try {
    const project = await prisma.project.create({
      data: { ownerId: userId, name, ...(rawId ? { id: rawId } : {}) },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Project id already exists" }, { status: 409 });
    }
    throw error;
  }
}
