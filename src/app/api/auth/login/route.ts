import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { phone, role = "DRIVER", name } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      const defaultName =
        name ||
        (role === "DRIVER"
          ? "Ramesh Driver"
          : role === "VYAPARI"
          ? "Patidar Vyapari"
          : "Kisan Bhai");

      user = await prisma.user.create({
        data: {
          phone,
          role,
          name: defaultName,
          city: "Indore",
          vehicleNumber: role === "DRIVER" ? "MP 09 XY 8899" : null,
          vehicleType: role === "DRIVER" ? "Tata 407 (Open Body)" : null,
          isVerified: true,
          rating: 4.9,
          hasActivePass: role === "DRIVER",
        },
      });
    }

    return NextResponse.json({
      success: true,
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
