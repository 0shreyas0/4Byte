import { useState } from "react";
import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  GitBranch,
  Zap,
  BarChart3,
  Menu,
  X,
  BookOpen,
  Bell,
  User,
  Trophy,
  Sparkles,
  Layers,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/domains", label: "Domains", icon: Layers },
  { to: "/concept-map", label: "Concept Map", icon: GitBranch },
  { to: "/practice", label: "Practice", icon: Zap },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#f5f0e8",
        backgroundImage:
          "radial-gradient(circle, #00000018 1.5px, transparent 1.5px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ── Top Navbar ─────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{ background: "#FFD60A", borderBottom: "4px solid #000" }}
      >
        <div className="max-w-screen-2xl mx-auto flex items-stretch h-14">
          {/* Brand */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 px-5 flex-shrink-0"
            style={{ borderRight: "4px solid #000" }}
          >
            <div
              className="w-9 h-9 bg-black flex items-center justify-center"
              style={{ boxShadow: "2px 2px 0px #00000040" }}
            >
              <BookOpen className="w-5 h-5 text-[#FFD60A]" />
            </div>
            <span className="font-black text-black text-base uppercase tracking-widest hidden sm:block">
              SmartEdTech
            </span>
          </NavLink>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex flex-1 items-stretch">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                style={({ isActive }) =>
                  isActive
                    ? {
                      background: "#000",
                      color: "#FFD60A",
                      borderRight: "4px solid #000",
                    }
                    : {
                      background: "transparent",
                      color: "#000",
                      borderRight: "4px solid #000",
                    }
                }
                className={({ isActive }) =>
                  `flex items-center gap-2 px-5 font-black text-sm uppercase tracking-widest transition-colors duration-100 hover:bg-black hover:text-[#FFD60A]`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div
            className="ml-auto flex items-stretch"
            style={{ borderLeft: "4px solid #000" }}
          >
            {/* User XP badge — desktop only */}
            <div
              className="hidden md:flex items-center gap-2.5 px-4"
              style={{ borderRight: "4px solid #000" }}
            >
              <div className="w-8 h-8 bg-black flex items-center justify-center font-black text-[#FFD60A] text-xs">
                AJ
              </div>
              <div className="leading-tight">
                <div className="font-black text-black text-xs uppercase">
                  Alex Johnson
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-black" />
                  <span className="text-black text-[10px] font-bold">
                    Lvl 7 · 1,240 XP
                  </span>
                </div>
              </div>
            </div>

            {/* Streak badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-4 bg-black"
              style={{ borderRight: "4px solid #000" }}
            >
              <span className="font-black text-[#FFD60A] text-sm">🔥 14</span>
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                Streak
              </span>
            </div>

            {/* Bell */}
            <button
              className="w-14 flex items-center justify-center relative hover:bg-black group transition-colors duration-100"
              style={{ borderRight: "4px solid #000" }}
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-black group-hover:text-[#FFD60A]" />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-[#FF3B30] border-2 border-[#FFD60A] rounded-full animate-pulse" />
            </button>

            {/* Profile */}
            <button
              className="w-14 flex items-center justify-center bg-black hover:bg-[#1a1a1a] transition-colors duration-100"
              title="Profile"
            >
              <User className="w-5 h-5 text-[#FFD60A]" />
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-14 flex items-center justify-center hover:bg-black group transition-colors duration-100"
              style={{ borderLeft: "4px solid #000" }}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-black group-hover:text-[#FFD60A]" />
              ) : (
                <Menu className="w-5 h-5 text-black group-hover:text-[#FFD60A]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav */}
        {mobileOpen && (
          <div
            className="lg:hidden flex flex-col"
            style={{ borderTop: "4px solid #000" }}
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) =>
                  isActive
                    ? {
                      background: "#000",
                      color: "#FFD60A",
                      borderBottom: "3px solid #000",
                    }
                    : {
                      background: "#FFD60A",
                      color: "#000",
                      borderBottom: "3px solid #000",
                    }
                }
                className="flex items-center gap-3 px-6 py-4 font-black text-sm uppercase tracking-widest hover:bg-black hover:text-[#FFD60A] transition-colors duration-100"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
            {/* Mobile streak */}
            <div
              className="flex items-center gap-2 px-6 py-3 bg-black"
              style={{ borderBottom: "3px solid #000" }}
            >
              <span className="font-black text-[#FFD60A] text-sm">🔥 14 Day Streak</span>
              <Sparkles className="w-4 h-4 text-[#FFD60A] ml-auto" />
            </div>
          </div>
        )}
      </header>

      {/* ── Page Content ───────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}