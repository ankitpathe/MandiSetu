import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      phone,
      type,
      title,
      origin,
      destination,
      vehicleType,
      capacity,
      targetPrice,
      departureTime,
      notes,
    } = body;

    if (!origin || !destination || !vehicleType) {
      return NextResponse.json(
        { success: false, error: "Origin, destination, and vehicle type are required" },
        { status: 400 }
      );
    }

    // Resolve user ID
    let finalUserId = userId;
    if (finalUserId) {
      const existing = await prisma.user.findUnique({ where: { id: finalUserId } });
      if (!existing) {
        finalUserId = undefined;
      }
    }

    // Fallback: match by phone if provided
    if (!finalUserId && phone) {
      const byPhone = await prisma.user.findUnique({ where: { phone } });
      if (byPhone) {
        finalUserId = byPhone.id;
      }
    }

    // Fallback: pick first user with corresponding role
    if (!finalUserId) {
      const desiredRole = type === "VEHICLE_AVAILABLE" ? "DRIVER" : "VYAPARI";
      const fallbackUser = await prisma.user.findFirst({
        where: { role: desiredRole },
      });
      if (fallbackUser) {
        finalUserId = fallbackUser.id;
      } else {
        // Create an ad-hoc user
        const newUser = await prisma.user.create({
          data: {
            name: type === "VEHICLE_AVAILABLE" ? "Driver Ji" : "Vyapari Bhaisaab",
            phone: phone || `9899${Math.floor(100000 + Math.random() * 900000)}`,
            role: desiredRole,
            city: origin.split(" ")[0] || "Indore",
            isVerified: true,
          },
        });
        finalUserId = newUser.id;
      }
    }

    // Generate title if not given
    const postTitle =
      title ||
      (type === "VEHICLE_AVAILABLE"
        ? `${vehicleType} - Khali Return`
        : `Agri Goods Load (${vehicleType})`);

    const newPost = await prisma.post.create({
      data: {
        userId: finalUserId,
        type: type || "LOAD_AVAILABLE",
        title: postTitle,
        origin,
        destination,
        vehicleType,
        capacity: capacity || "Standard",
        targetPrice: targetPrice ? Number(targetPrice) : null,
        departureTime: departureTime || "Aaj Shaam",
        notes: notes || null,
        status: "ACTIVE",
      },
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
    });

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts/create error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
