import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Resolve the registration Steam IDs into User objects
    // We only select the 'name' field to keep it efficient
    const drivers = await User.find({
      steamId: { $in: event.registrations || [] }
    }).select("name steamId");

    return NextResponse.json(drivers);
  } catch (error) {
    console.error("Entry List API Error:", error);
    return NextResponse.json({ error: "Failed to fetch grid" }, { status: 500 });
  }
}