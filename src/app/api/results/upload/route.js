import { NextResponse } from "next/server";
import dbConnect from "@/lib/db"; // Using your existing db.js
import Result from "@/models/Result";

export async function POST(req) {
  try {
    await dbConnect();
    const rawData = await req.json();

    // Destructure ACC JSON structure
    const { trackName, sessionType, sessionResult } = rawData;
    
    const parsedStandings = sessionResult.leaderBoardLines.map((line, index) => {
      // Get the primary driver from the entry
      const driver = line.car.drivers[0]; 
      
      return {
        position: index + 1,
        name: `${driver.firstName} ${driver.lastName}`,
        steamId: driver.playerId,
        car: line.car.carModel,
        totalTime: formatTotalTime(line.timing.totalTime),
        bestLap: formatLapTime(line.timing.bestLap),
        laps: line.timing.lapCount,
        points: calculatePoints(index + 1)
      };
    });

    const savedResult = await Result.create({
      track: trackName,
      sessionType: sessionType,
      standings: parsedStandings
    });

    return NextResponse.json({ message: "Ingestion Success", id: savedResult._id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Points Scale (FIA Standard: 25, 18, 15, 12, 10, 8, 6, 4, 2, 1)
function calculatePoints(pos) {
  const scale = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
  return scale[pos - 1] || 0;
}

// Helpers to convert milliseconds to racing format
function formatLapTime(ms) {
  if (ms === 2147483647) return "No Time";
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(3);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function formatTotalTime(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return `${h}h ${m}m`;
}