import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { getServerSession } from "next-auth/next";
// Use the @ alias to avoid "Module not found" errors
import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route"; 

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // We pass null because getServerSession doesn't need the req 
    // object to build Steam URLs during a background server check
    const session = await getServerSession(getAuthOptions(null));

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Sign-in required. Please re-login to Steam." }, 
        { status: 401 }
      );
    }

    // Add Steam ID to the registrations array
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $addToSet: { registrations: session.user.id } },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}