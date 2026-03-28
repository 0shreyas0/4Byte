import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  Users,
  LogOut, 
  ChevronRight,
  UserCircle
} from 'lucide-react';

export interface UserProfileData {
  name: string;
  email?: string;
  avatar?: string;
  handle?: string;
}

interface UserProfileProps {
  user: UserProfileData;
  isProfileOpen: boolean;
  setIsProfileOpen: (value: boolean) => void;
  onLogout?: () => void;
  onSwitchAccount?: () => void;
  onSettings?: () => void;
  onViewProfile?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isProfileOpen,
  setIsProfileOpen,
  onLogout,
  onSwitchAccount,
  onSettings,
  onViewProfile
}) => {
  return (
    <div className="relative">
      {/* Trigger: Just the Avatar */}
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="relative h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border border-border/50 hover:border-primary/40 hover:scale-105 transition-all duration-300 active:scale-95 shadow-sm"
      >
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <User className="w-5 h-5" />
        )}
      </button>

      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" 
              onClick={() => setIsProfileOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10, x: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute right-0 mt-3 w-72 bg-popover rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-border/50 z-50 overflow-hidden origin-top-right select-none"
            >
              {/* Header: YouTube-style user info */}
              <div 
                className="px-5 py-5 flex items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => {
                  onViewProfile?.();
                  setIsProfileOpen(false);
                }}
              >
                <div className="h-12 w-12 rounded-full border border-border/50 overflow-hidden shrink-0 shadow-inner">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0 pt-0.5">
                  <p className="text-base font-heading font-bold truncate leading-tight">{user.name}</p>
                  <p className="text-sm text-muted-foreground truncate leading-tight">@{user.handle || user.email?.split('@')[0] || 'user'}</p>
                </div>
              </div>

              <div className="h-px bg-border/50 w-full" />

              {/* Menu Items */}
              <div className="p-2">
                <MenuOption 
                  icon={<UserCircle size={18} />} 
                  label="View your profile" 
                  onClick={() => {
                    onViewProfile?.();
                    setIsProfileOpen(false);
                  }} 
                />
                <MenuOption 
                  icon={<Settings size={18} />} 
                  label="Settings" 
                  onClick={() => {
                    onSettings?.();
                    setIsProfileOpen(false);
                  }} 
                />
                <MenuOption 
                  icon={<Users size={18} />} 
                  label="Switch account" 
                  chevron
                  onClick={() => {
                    onSwitchAccount?.();
                    setIsProfileOpen(false);
                  }} 
                />
                
                <div className="h-px bg-border/30 my-2 mx-1" />

                <MenuOption 
                  icon={<LogOut size={18} />} 
                  label="Log out" 
                  variant="destructive"
                  onClick={() => {
                    onLogout?.();
                    setIsProfileOpen(false);
                  }} 
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

interface MenuOptionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  chevron?: boolean;
  variant?: 'default' | 'destructive';
}

const MenuOption: React.FC<MenuOptionProps> = ({ icon, label, onClick, chevron, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group ${
      variant === 'destructive' 
        ? 'text-destructive hover:bg-destructive/10' 
        : 'text-foreground/90 hover:bg-muted/80'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`transition-colors ${variant === 'destructive' ? 'text-destructive' : 'text-muted-foreground group-hover:text-primary'}`}>
        {icon}
      </div>
      <span className="font-action text-[15px] font-medium">{label}</span>
    </div>
    {chevron && (
      <ChevronRight size={16} className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
    )}
  </button>
);
