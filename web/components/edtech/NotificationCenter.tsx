"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  X, 
  BookOpen, 
  Zap, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Trophy,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { tutorSpeak } from "./Avatar";

export interface NotificationItem {
  id: string;
  type: "revision" | "quiz" | "alert" | "insight" | "achievement";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  tag?: "Urgent" | "Save" | "Goal" | "Task" | null;
  domain?: string;
}

const TAG_COLORS = {
  Urgent: { bg: "#FF3B3B", text: "#FFF" },
  Save: { bg: "#0A84FF", text: "#FFF" },
  Goal: { bg: "#AF52DE", text: "#FFF" },
  Task: { bg: "#1DB954", text: "#FFF" },
};

const ALL_TAGS: NotificationItem["tag"][] = ["Urgent", "Save", "Goal", "Task"];

const TUTOR_NOTIFS: Omit<NotificationItem, "id" | "timestamp" | "read">[] = [
  {
    type: "revision",
    title: "Quick Revision Time!",
    message: "It's been a while since your last session. A 5-minute recap can boost retention by 40%!",
  },
  {
    type: "quiz",
    title: "New Quiz Available",
    message: "Based on your progress, I've unlocked a 'Challenge Mode' for your current track.",
  },
  {
    type: "insight",
    title: "Neural Analysis Ready",
    message: "I've detected a pattern in your hesitancy during 'Recursion'. Let's dive deeper.",
  },
  {
    type: "achievement",
    title: "Streak Milestones!",
    message: "You're doing great! Keep the momentum going to unlock the elite learner badge.",
  },
  {
    type: "alert",
    title: "Study Goal Alert",
    message: "You set a goal for 'Academic Excellence'. We have some ground to cover today!",
  },
  {
    type: "insight",
    title: "Weak Spot Detected",
    message: "Your 'Trees' concepts are slightly shaky. I recommend a quick interactive session.",
  }
];

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
  onNewNotificationCount?: (count: number) => void;
}

export default function NotificationCenter({ open, onClose, onNewNotificationCount }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const lastNotifTime = useRef<number>(Date.now());

  // Simulation: Add a new notification periodically
  useEffect(() => {
    // Initial notifications
    setNotifications([
      {
        id: "init-1",
        type: "achievement",
        title: "Welcome Back!",
        message: "Neural Mentor is ready to guide your learning path today.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false
      }
    ]);

    const interval = setInterval(() => {
      // 30% chance to trigger every 45 seconds
      if (Math.random() > 0.7) {
        const template = TUTOR_NOTIFS[Math.floor(Math.random() * TUTOR_NOTIFS.length)];
        const newNotif: NotificationItem = {
          ...template,
          id: `notif-${Date.now()}`,
          timestamp: new Date(),
          read: false,
        };
        
        setNotifications(prev => [newNotif, ...prev].slice(0, 10)); // Keep last 10
        tutorSpeak(`🔔 Notification: ${newNotif.title}. ${newNotif.message}`);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    onNewNotificationCount?.(unreadCount);
  }, [notifications, onNewNotificationCount]);

  if (!open) return null;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotif = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleTag = (id: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id !== id) return n;
      const currentIdx = n.tag ? ALL_TAGS.indexOf(n.tag) : -1;
      const nextTag = ALL_TAGS[currentIdx + 1] ?? null;
      return { ...n, tag: nextTag };
    }));
  };

  const getTypeIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "revision": return <Clock size={16} color="#0A84FF" />;
      case "quiz": return <Zap size={16} color="#FFD60A" />;
      case "alert": return <AlertCircle size={16} color="#FF3B3B" />;
      case "insight": return <TrendingUp size={16} color="#AF52DE" />;
      case "achievement": return <Trophy size={16} color="#1DB954" />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-199 bg-black/20 backdrop-blur-[1px]"
      />
      
      {/* Panel */}
      <div 
        className="fixed top-20 right-6 z-200 w-[360px] max-w-[92vw] bg-[#F5F0E8] border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col animate-slide-in"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-[#0D0D0D] border-b-4 border-black">
          <div className="flex items-center gap-2">
            <Bell size={16} color="#FFD60A" />
            <h3 className="text-[#FFD60A] text-[0.7rem] font-black uppercase tracking-widest">Neural Notifications</h3>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={markAllRead}
              className="text-[0.6rem] font-black text-[#FFD60A] hover:underline uppercase"
            >
              Mark all read
            </button>
            <button onClick={onClose}>
              <X size={16} color="#FFD60A" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <Sparkles size={32} color="#DDD" />
              <p className="text-[0.7rem] font-bold text-[#888] uppercase tracking-wide">All caught up!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id}
                className={`group relative p-3 border-3 border-black shadow-[3px_3px_0px_#000] transition-transform hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_#000] ${n.read ? 'bg-white/50' : 'bg-white'}`}
              >
                {!n.read && (
                  <div className="absolute top-[-2px] left-[-2px] w-3 h-3 bg-[#FF3B3B] border-2 border-black rounded-full" />
                )}
                <div className="flex gap-3">
                  <div className="mt-1 w-8 h-8 shrink-0 bg-[#F5F0E8] border-2 border-black flex items-center justify-center">
                    {getTypeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[0.8rem] font-black leading-tight truncate">{n.title}</h4>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => toggleTag(n.id)}
                          title="Click to tag"
                          className="p-1 border border-black hover:bg-gray-100 transition-colors"
                          style={{
                            background: n.tag ? TAG_COLORS[n.tag].bg : "transparent",
                            color: n.tag ? TAG_COLORS[n.tag].text : "#888",
                          }}
                        >
                          {n.tag ? <span className="text-[0.5rem] font-black px-1 uppercase">{n.tag}</span> : <Sparkles size={10} />}
                        </button>
                        <button 
                          onClick={() => removeNotif(n.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 text-[#888] hover:text-black transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[0.7rem] font-bold text-[#444] leading-relaxed mb-2">{n.message}</p>
                    <div className="flex items-center justify-between text-[0.6rem] font-black text-[#AAA] uppercase tracking-tighter">
                      <span>{n.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-white border-t-4 border-black">
          <button 
            className="w-full py-2 bg-[#FFD60A] border-2 border-black shadow-[3px_3px_0px_#000] text-[0.7rem] font-black uppercase tracking-widest hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_#000] transition-all"
            onClick={onClose}
          >
            Go to Inbox
          </button>
        </div>
      </div>
    </>
  );
}
