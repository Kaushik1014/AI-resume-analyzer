// Dashboard page: placeholder for authenticated users — will show analysis history
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const { dbUser, firebaseUser } = useAuth();
  const displayName =
    dbUser?.displayName || firebaseUser?.displayName || "User";

  return (
    <div className="bg-hero-bg min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 md:px-10 pt-32 pb-16">
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome, <span className="text-primary">{displayName}</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Your resume analysis dashboard
          </p>
        </div>

        {/* Placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-0 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { icon: "fa-file-lines", label: "Total Analyses", value: "0" },
            { icon: "fa-chart-line", label: "Average Score", value: "—" },
            { icon: "fa-clock", label: "Last Analysis", value: "None yet" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-secondary/30 border border-border/30 p-6 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <i className={`fa-solid ${card.icon} text-primary`} />
                </div>
                <span className="text-sm text-muted-foreground">{card.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 opacity-0 animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <button className="h-14 px-8 text-sm font-bold tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 rounded-full border border-primary/20 shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300 inline-flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles" />
            Analyze a Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
