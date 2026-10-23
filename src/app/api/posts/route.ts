import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // ALL | VEHICLE_AVAILABLE | LOAD_AVAILABLE
    const query = searchParams.get("q")?.toLowerCase();

    const whereClause: {
      type?: string;
      status: string;
      OR?: Array<{
        title?: { contains: string };
        origin?: { contains: string };
        destination?: { contains: string };
        vehicleType?: { contains: string };
        notes?: { contains: string };
      }>;
    } = {
      status: "ACTIVE",
    };

    if (type && (type === "VEHICLE_AVAILABLE" || type === "LOAD_AVAILABLE")) {
      whereClause.type = type;
    }

    if (query && query.trim() !== "") {
      whereClause.OR = [
        { title: { contains: query } },
        { origin: { contains: query } },
        { destination: { contains: query } },
        { vehicleType: { contains: query } },
        { notes: { contains: query } },
      ];
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            phone: true,
            role: true,
            vehicleNumber: true,
            city: true,
            isVerified: true,
            rating: true,
            hasActivePass: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
