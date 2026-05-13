"use client";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterButton({ eventId, registeredDrivers = [] }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Check if current user is already in the list
  const isRegistered = session && registeredDrivers.some(driver => 
    (typeof driver === 'object' ? driver.steamId : driver) === (session.user.steamId || session.user.id)
  );

  const handleRegister = async () => {
    if (!session) return signIn("steam");
    
    setLoading(true);
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });

      if (res.ok) {
        router.refresh(); // Refresh the page data
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleRegister}
      disabled={isRegistered || loading}
      className={`w-full py-6 font-black uppercase italic tracking-tighter text-2xl transition-all ${
        isRegistered 
        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
        : "bg-red-600 text-white hover:bg-white hover:text-black shadow-xl shadow-red-900/20"
      }`}
    >
      {loading ? "PROCESSING..." : isRegistered ? "ALREADY REGISTERED" : "REGISTER NOW"}
    </button>
  );
}