"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import { getServerSession } from "next-auth/next";
import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function registerForEvent(eventId) {
  try {
    await dbConnect();
    const session = await getServerSession(getAuthOptions());

    if (!session) return { success: false, error: "Not logged in" };

    const steamId = session.user.steamId;

    // Fixed the MONGOOSE Warning by using returnDocument: 'after'
    const updated = await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { registeredDrivers: steamId } },
      { returnDocument: 'after' } 
    );

    // This is the critical line that forces your page.js to show "Already Registered"
    revalidatePath("/events");
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}