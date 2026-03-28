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
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/concept-map", label: "Concept Map", icon: GitBranch },
  { to: "/practice", label: "Practice", icon: Zap },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-64 bg-[#FFD60A] flex flex-col transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ borderRight: "4px solid black" }}
      >
        {/* Logo */}
        <div className="p-5" style={{ borderBottom: "4px solid black" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#FFD60A]" />
            </div>
            <div>
              <div className="text-black font-black text-lg leading-tight tracking-tight">SMART</div>
              <div className="text-black font-black text-lg leading-tight tracking-tight">EDTECH</div>
            </div>
          </div>
        </div>

        {/* User badge */}
        <div className="p-4" style={{ borderBottom: "4px solid black" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center font-black text-[#FFD60A] text-sm" style={{ border: "2px solid black" }}>
              AJ
            </div>
            <div>
              <div className="font-black text-black text-sm">ALEX JOHNSON</div>
              <div className="flex items-center gap-1">
                <Trophy className="w-3 h-3 text-black" />
                <span className="text-black text-xs font-bold">Level 7 • 1,240 XP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 font-bold text-black transition-all duration-100 select-none
                ${isActive
                  ? "bg-black text-[#FFD60A] shadow-[4px_4px_0px_#000]"
                  : "bg-[#FFD60A] hover:bg-black/10 hover:shadow-[4px_4px_0px_#000]"
                }`
              }
              style={({ isActive }) => ({
                border: isActive ? "3px solid black" : "3px solid transparent",
              })}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm uppercase tracking-wide font-black">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4" style={{ borderTop: "4px solid black" }}>
          <div className="bg-[#FF3B30] p-3 shadow-[4px_4px_0px_black]" style={{ border: "3px solid black" }}>
            <div className="text-white font-black text-xs uppercase mb-1">⚡ Daily Streak</div>
            <div className="text-white font-black text-2xl">🔥 14 Days</div>
            <div className="text-white text-xs font-bold mt-1">Keep it up!</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between" style={{ borderBottom: "4px solid black" }}>
          <button
            className="lg:hidden w-10 h-10 bg-[#FFD60A] flex items-center justify-center shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
            style={{ border: "3px solid black" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="hidden lg:block font-black text-black text-lg uppercase tracking-widest">
            ⚡ Smart Learning Platform
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              className="w-10 h-10 bg-white flex items-center justify-center shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all relative"
              style={{ border: "3px solid black" }}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF3B30] border border-black rounded-full"></span>
            </button>
            <button
              className="w-10 h-10 bg-black flex items-center justify-center shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              style={{ border: "3px solid black" }}
            >
              <User className="w-4 h-4 text-[#FFD60A]" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}