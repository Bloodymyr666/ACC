import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Registration from "@/models/Registration"; // Ensure you have this model
import { getServerSession } from "next-auth/next";
import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const session = await getServerSession(getAuthOptions(null));

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Sign-in required." }, { status: 401 });
    }

    // 1. Create a dedicated Registration document
    // This will AUTOMATICALLY create the 'registrations' collection in Atlas
    await User.findOneAndUpdate(
  { steamId: session.user.id },
  { name: session.user.name }, 
  { upsert: true }
);

    // 2. Keep the count working on the main page
    const updatedEvent = await Event.findByIdAndUpdate(
  id,
  { $addToSet: { registrations: session.user.id } },
  { new: true }
);

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}