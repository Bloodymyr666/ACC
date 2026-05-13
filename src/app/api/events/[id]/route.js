import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/models/Event";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    // Next.js 15+ requires awaiting params
    const { id } = await params; 

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const event = await Event.findById(id);
    
    if (!event) {
      return NextResponse.json({ error: "Event not in database" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}