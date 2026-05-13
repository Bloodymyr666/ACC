import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Result from '@/models/Result';

export async function GET() {
  try {
    await dbConnect();
    // Fetch all race results
    const allResults = await Result.find({});

    const totals = {};

    // Aggregate points for every driver found in any race
    allResults.forEach(race => {
      race.standings.forEach(driver => {
        if (!totals[driver.steamId]) {
          totals[driver.steamId] = {
            name: driver.name,
            steamId: driver.steamId,
            points: 0,
            racesCompleted: 0,
            wins: 0
          };
        }
        
        totals[driver.steamId].points += driver.points;
        totals[driver.steamId].racesCompleted += 1;
        if (driver.position === 1) totals[driver.steamId].wins += 1;
      });
    });

    // Convert to array and sort by points (descending)
    const leaderboard = Object.values(totals).sort((a, b) => b.points - a.points);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}