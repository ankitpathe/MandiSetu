import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, phone, planName = "Return Load Unlimited Pass", amount = 299 } = body;

    let targetUserId = userId;
    if (targetUserId) {
      const exists = await prisma.user.findUnique({ where: { id: targetUserId } });
      if (!exists) targetUserId = undefined;
    }

    if (!targetUserId && phone) {
      const byPhone = await prisma.user.findUnique({ where: { phone } });
      if (byPhone) targetUserId = byPhone.id;
    }

    if (!targetUserId) {
      // Find the first driver
      const driver = await prisma.user.findFirst({ where: { role: "DRIVER" } });
      if (driver) targetUserId = driver.id;
    }

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "User not found for pass activation" },
        { status: 404 }
      );
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    const membership = await prisma.membership.create({
      data: {
        userId: targetUserId,
        planName,
        amount: Number(amount),
        status: "ACTIVE",
        validUntil,
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { hasActivePass: true },
    });

    return NextResponse.json({
      success: true,
      membership,
      user: updatedUser,
      message: "Return Load Unlimited Pass successfully activated for 30 days!",
    });
  } catch (error) {
    console.error("POST /api/membership/activate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to activate membership pass" },
      { status: 500 }
    );
  }
}
