import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { getServerSession } from "next-auth"; 

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const session = await getServerSession();

    // 1. Verify Authentication
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // 2. Add User ID to the registrations array
    // $addToSet ensures the user can't register twice for the same race
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $addToSet: { registrations: session.user.id } },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}