import { ShieldAlert, Scale, Flag, Zap, Info } from 'lucide-react';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-20">
      <header className="max-w-4xl mx-auto mb-16">
        <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">
          League <span className="text-red-600">Regulations</span>
        </h1>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm italic">
          TNMG ACC LEAGUE • Official Sporting Code
        </p>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        <RuleSection 
          icon={<ShieldAlert className="text-red-600" />}
          title="Code of Conduct"
          content="Respect all drivers on and off the track. Any form of harassment, toxicity, or intentional wrecking will result in a permanent ban from the TNMG LEAGUE."
        />
        
        <RuleSection 
          icon={<Flag className="text-red-600" />}
          title="Racing Standards"
          content="We follow standard FIA GT3 rules. Re-joining the track must be done safely. Forcing a driver off track or 'moving under braking' is strictly prohibited."
        />

        <RuleSection 
          icon={<Scale className="text-red-600" />}
          title="Incident Reporting"
          content="Stewards will not review every lap. If you are involved in an incident, you must submit a report via the Steward Panel within 24 hours of the race finish."
        />

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl italic text-zinc-400 text-sm leading-relaxed">
          <div className="flex gap-4">
            <Info size={48} className="text-red-600 shrink-0" />
            <p>
              By registering for any event in the <span className="text-white font-bold uppercase tracking-tighter">TNMG ACC LEAGUE</span>, 
              you agree to abide by these rules. The Stewards' decisions are final.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleSection({ icon, title, content }) {
  return (
    <section className="flex gap-6 group">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="text-2xl font-black uppercase italic tracking-tight mb-3 group-hover:text-red-600 transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 font-medium leading-relaxed">
          {content}
        </p>
      </div>
    </section>
  );
}