import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { PenLine, History, LogOut } from "lucide-react";

const NavBar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenLine className="w-4 h-4" />
            Generate
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === "/history"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <History className="w-4 h-4" />
            History
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
