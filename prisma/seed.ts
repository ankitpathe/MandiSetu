import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Cleaning database...");
  await prisma.membership.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Seeding Users...");

  const driverRamesh = await prisma.user.create({
    data: {
      name: "Ramesh Yadav",
      phone: "9826012345",
      role: "DRIVER",
      vehicleNumber: "MP 09 AB 4589",
      vehicleType: "Tata 407 (Open Body)",
      city: "Indore",
      isVerified: true,
      rating: 4.9,
      hasActivePass: true,
    },
  });

  const vyapariSuresh = await prisma.user.create({
    data: {
      name: "Suresh Patidar",
      phone: "9827155678",
      role: "VYAPARI",
      city: "Chhindwara",
      isVerified: true,
      rating: 4.8,
      hasActivePass: false,
    },
  });

  const driverMukesh = await prisma.user.create({
    data: {
      name: "Mukesh Verma",
      phone: "9893244321",
      role: "DRIVER",
      vehicleNumber: "MH 31 CA 7721",
      vehicleType: "Bolero Maxi Truck",
      city: "Nagpur",
      isVerified: true,
      rating: 4.7,
      hasActivePass: true,
    },
  });

  const vyapariRajesh = await prisma.user.create({
    data: {
      name: "Rajesh Agrawal",
      phone: "9425099887",
      role: "VYAPARI",
      city: "Betul",
      isVerified: true,
      rating: 4.9,
      hasActivePass: false,
    },
  });

  const kisanDevendra = await prisma.user.create({
    data: {
      name: "Devendra Gurjar",
      phone: "9755123456",
      role: "FARMER",
      city: "Indore",
      isVerified: true,
      rating: 4.8,
      hasActivePass: false,
    },
  });

  const driverSunil = await prisma.user.create({
    data: {
      name: "Sunil Shinde",
      phone: "9168901234",
      role: "DRIVER",
      vehicleNumber: "MH 04 DK 9012",
      vehicleType: "Eicher 6-Wheeler (17ft)",
      city: "Mumbai",
      isVerified: true,
      rating: 4.9,
      hasActivePass: true,
    },
  });

  console.log("🌱 Seeding Memberships...");
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

  await prisma.membership.create({
    data: {
      userId: driverRamesh.id,
      planName: "Return Load Unlimited Pass",
      amount: 299,
      status: "ACTIVE",
      validUntil: thirtyDaysLater,
    },
  });

  await prisma.membership.create({
    data: {
      userId: driverMukesh.id,
      planName: "Return Load Unlimited Pass",
      amount: 299,
      status: "ACTIVE",
      validUntil: thirtyDaysLater,
    },
  });

  console.log("🌱 Seeding Posts across Indore, Chhindwara, Betul, Nagpur, Mumbai...");

  // Post 1: Suresh Patidar (Chhindwara -> Nagpur)
  await prisma.post.create({
    data: {
      userId: vyapariSuresh.id,
      type: "LOAD_AVAILABLE",
      title: "Tamatar (Tomato) Load - 80 Peti",
      origin: "Chhindwara Mandi",
      destination: "Nagpur Kalamna Mandi",
      vehicleType: "Chota Hathi / Ace",
      capacity: "1.5 Ton",
      targetPrice: 3500,
      departureTime: "Aaj Shaam 7:00 PM",
      notes: "Tirpal zaroori hai. Urgent delivery by midnight.",
      status: "ACTIVE",
    },
  });

  // Post 2: Ramesh Yadav (Nagpur -> Betul / Indore)
  await prisma.post.create({
    data: {
      userId: driverRamesh.id,
      type: "VEHICLE_AVAILABLE",
      title: "Tata 407 (Open Body) - Khali Return",
      origin: "Nagpur Kalamna Mandi",
      destination: "Betul / Indore Mandi",
      vehicleType: "Tata 407 (Open Body)",
      capacity: "3.5 Ton",
      targetPrice: 4200,
      departureTime: "Aaj Raat 10:30 PM",
      notes: "Nagpur se khali wapas Indore ja rahi hai. Raaste mein Betul bhi utar sakte hain.",
      status: "ACTIVE",
    },
  });

  // Post 3: Rajesh Agrawal (Betul -> Indore)
  await prisma.post.create({
    data: {
      userId: vyapariRajesh.id,
      type: "LOAD_AVAILABLE",
      title: "Gehun (Wheat) & Makka (Corn) Bori",
      origin: "Betul Krishi Upaj Mandi",
      destination: "Indore Chhavani Mandi",
      vehicleType: "Bolero Pickup",
      capacity: "2.2 Ton",
      targetPrice: 4800,
      departureTime: "Kal Subah 6:00 AM",
      notes: "50 bori makka aur gehun. Loading par hamare pipal rahenge.",
      status: "ACTIVE",
    },
  });

  // Post 4: Mukesh Verma (Indore -> Chhindwara)
  await prisma.post.create({
    data: {
      userId: driverMukesh.id,
      type: "VEHICLE_AVAILABLE",
      title: "Bolero Maxi Truck - Return Trip",
      origin: "Indore Mandi",
      destination: "Chhindwara Mandi",
      vehicleType: "Bolero Pickup",
      capacity: "2.0 Ton",
      targetPrice: 3800,
      departureTime: "Kal Dopahar 1:00 PM",
      notes: "Sabzi ya anaj ka load chahiye. Gadi bilkul fit hai.",
      status: "ACTIVE",
    },
  });

  // Post 5: Devendra Gurjar (Indore -> Mumbai)
  await prisma.post.create({
    data: {
      userId: kisanDevendra.id,
      type: "LOAD_AVAILABLE",
      title: "Pyaz (Onion) Mandi Bhejna Hai",
      origin: "Indore Devi Ahilya Mandi",
      destination: "Mumbai Vashi APMC Mandi",
      vehicleType: "Eicher 6-Wheeler",
      capacity: "7.0 Ton",
      targetPrice: 18500,
      departureTime: "Aaj Raat 11:00 PM",
      notes: "Fresh red onions. Direct delivery to Vashi market stall.",
      status: "ACTIVE",
    },
  });

  // Post 6: Sunil Shinde (Mumbai -> Indore)
  await prisma.post.create({
    data: {
      userId: driverSunil.id,
      type: "VEHICLE_AVAILABLE",
      title: "Eicher 6-Wheeler - Return to MP",
      origin: "Mumbai Vashi Market",
      destination: "Indore / Betul Mandi",
      vehicleType: "Eicher 6-Wheeler",
      capacity: "6.5 Ton",
      targetPrice: 16000,
      departureTime: "Kal Shaam 5:00 PM",
      notes: "Empty container body returning to MP. Clean bed with lashing ropes.",
      status: "ACTIVE",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
