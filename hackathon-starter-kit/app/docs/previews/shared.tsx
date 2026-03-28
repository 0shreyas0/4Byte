'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { Lock, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/ui';
import { usePresence } from '@/lib/hooks/usePresence';
import { useCursors } from '@/lib/hooks/useCursors';
import { useTyping } from '@/lib/hooks/useTyping';

// ─── Features ────────────────────────────────────────────────────────────────
const AIChatRaw          = dynamic(() => import('@/ui/features/AIChat').then(m => m.AIChat), { ssr: false });
const AIDemoRaw          = dynamic(() => import('@/ui/features/AIDemo').then(m => m.AIDemo), { ssr: false });
const AgentVoiceRaw      = dynamic(() => import('@/ui/features/AgentVoiceControl').then(m => m.AgentVoiceControl), { ssr: false });
const PDFProcessorRaw    = dynamic(() => import('@/ui/features/PDFProcessor').then(m => m.PDFProcessor), { ssr: false });
const ThemeCustomizerRaw = dynamic(() => import('@/ui/features/ThemeCustomizer').then(m => m.ThemeCustomizer), { ssr: false });
const NavbarRaw          = dynamic(() => import('@/ui/features/Navbar').then(m => m.Navbar), { ssr: false });
const SidebarRaw         = dynamic(() => import('@/ui/features/Sidebar').then(m => m.Sidebar), { ssr: false });
const SidebarItemRaw     = dynamic(() => import('@/ui/features/Sidebar').then(m => m.SidebarItem), { ssr: false });
const SidebarGroupRaw    = dynamic(() => import('@/ui/features/Sidebar').then(m => m.SidebarGroup), { ssr: false });
const FooterRaw          = dynamic(() => import('@/ui/features/Footer').then(m => m.Footer), { ssr: false });
const SearchBarRaw       = dynamic(() => import('@/ui/features/SearchBar').then(m => m.SearchBar), { ssr: false });
const LogInRaw           = dynamic(() => import('@/ui/features/LogIn').then(m => m.LogIn), { ssr: false });
const TeamChatRaw        = dynamic(() => import('@/ui/features/TeamChat').then(m => m.TeamChat), { ssr: false });
const VoiceCommsRaw      = dynamic(() => import('@/ui/features/VoiceComms').then(m => m.VoiceComms), { ssr: false });
const RazorpayRaw        = dynamic(() => import('@/ui/features/RazorpayButton').then(m => m.RazorpayButton), { ssr: false });
const ScraperServiceRaw  = dynamic(() => import('@/ui/features/ScraperService').then(m => m.ScraperService), { ssr: false });


// ─── Collaboration ───────────────────────────────────────────────────────────
const PresenceIndicatorRaw = dynamic(() => import('@/ui/features/Collaboration').then(m => m.PresenceIndicator), { ssr: false });
const TypingIndicatorRaw   = dynamic(() => import('@/ui/features/Collaboration').then(m => m.TypingIndicator), { ssr: false });
const RealtimeCursorRaw    = dynamic(() => import('@/ui/features/Collaboration').then(m => m.RealtimeCursor), { ssr: false });
const LiveNotificationsRaw = dynamic(() => import('@/ui/features/Collaboration').then(m => m.LiveNotifications), { ssr: false });
const ActivityFeedRaw      = dynamic(() => import('@/ui/features/Collaboration').then(m => m.ActivityFeed), { ssr: false });
const CollaborativeEditorRaw = dynamic(() => import('@/ui/features/Collaboration').then(m => m.CollaborativeEditor), { ssr: false });


// ─── Primitives ───────────────────────────────────────────────────────────────
const ButtonRaw          = dynamic(() => import('@/ui/components/Button').then(m => m.Button), { ssr: false });
const CardRaw            = dynamic(() => import('@/ui/components/Card').then(m => m.Card), { ssr: false });
const InputRaw           = dynamic(() => import('@/ui/components/Input').then(m => m.Input), { ssr: false });
const CodeSnippetRaw     = dynamic(() => import('@/ui/components/CodeSnippet').then(m => m.CodeSnippet), { ssr: false });
const ThemeTogglerRaw     = dynamic(() => import('@/ui/components/ThemeToggler').then(m => m.ThemeToggler), { ssr: false });
const UserProfileRaw      = dynamic(() => import('@/ui/components/UserProfile').then(m => m.UserProfile), { ssr: false });
const PageTransitionRaw  = dynamic(() => import('@/ui/components/PageTransition').then(m => m.PageTransition), { ssr: false });
const LogoRaw            = dynamic(() => import('@/ui/components/Logo').then(m => m.Logo), { ssr: false });
const SegmentedControlRaw = dynamic(() => import('@/ui/components/SegmentedControl').then(m => m.SegmentedControl), { ssr: false });



export const DEMO_CODE = `async function askAI(prompt: string) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}`;
export const GUEST_USER = {
  id: 'guest-preview',
  name: 'Ghost Operative',
  email: 'ghost@agency.int',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ghost'
};

function BlurredPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden rounded-[32px] bg-background/10 group/lock">
      <div className="absolute inset-0 blur-[30px] opacity-40 pointer-events-none select-none scale-[1.05] transform-gpu">
        <div className="w-full h-full flex items-center justify-center p-8">
          {children}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="relative max-w-sm w-full rounded-3xl overflow-hidden">
          <div className="relative bg-card/90 backdrop-blur-2xl border border-border/40 rounded-3xl px-8 py-8 text-center shadow-xl space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <Lock size={28} className="text-primary" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-heading text-foreground">
                Access locked
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in to view and interact with this live module.
              </p>
            </div>
            <Link href="/auth" className="block pt-1">
              <Button className="w-full font-action text-sm h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 group/btn">
                <span className="group-hover/btn:translate-x-1 transition-transform inline-block">
                  Sign in
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


function PresenceIndicatorWrapper({ currentUser }: { currentUser: any }) {
  const { onlineUsers } = usePresence('global-presence', currentUser);
  return <PresenceIndicatorRaw users={onlineUsers} />;
}


function RealtimeCursorWrapper({ currentUser }: { currentUser: any }) {
  const { cursors } = useCursors('global-canvas', currentUser);
  return (
    <>
      {cursors.map(cursor => (
        <RealtimeCursorRaw key={cursor.id} {...cursor} />
      ))}
    </>
  );
}


function TypingIndicatorWrapper({ currentUser }: { currentUser: any }) {
  const { typingUsers, setTyping } = useTyping('global-typing', currentUser);
  const [val, setVal] = React.useState('');
  
  return (
    <div className="flex flex-col items-center gap-6">
      <TypingIndicatorRaw typingUsers={typingUsers} />
      <div className="w-full max-w-xs space-y-2">
        <InputRaw 
          placeholder="Type here to test realtime sync..."
          value={val}
          onChange={(e: any) => {
             setVal(e.target.value);
             setTyping(e.target.value.length > 0);
          }}
          className="h-10 text-sm bg-primary/5 border-primary/10 rounded-xl"
        />
        <p className="text-[10px] text-muted-foreground text-center font-bold uppercase tracking-widest opacity-40">
          Open this page in another tab to see yourself typing
        </p>
      </div>
    </div>
  );
}


function InternalUserProfile({ onLogout }: { onLogout: () => void }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <UserProfileRaw 
      user={{
        name: 'Elon Musk',
        email: 'elon@x.com',
        avatar: 'https://github.com/shadcn.png'
      }}
      isProfileOpen={isOpen}
      setIsProfileOpen={setIsOpen}
      onLogout={onLogout}
    />
  );
}



export {
  AIChatRaw, AIDemoRaw, AgentVoiceRaw, PDFProcessorRaw, ThemeCustomizerRaw,
  NavbarRaw, SidebarRaw, SidebarItemRaw, SidebarGroupRaw, FooterRaw,
  SearchBarRaw, LogInRaw, TeamChatRaw, VoiceCommsRaw, RazorpayRaw, ScraperServiceRaw,
  PresenceIndicatorRaw, TypingIndicatorRaw, RealtimeCursorRaw, LiveNotificationsRaw,
  ActivityFeedRaw, CollaborativeEditorRaw, ButtonRaw, CardRaw, InputRaw,
  CodeSnippetRaw, ThemeTogglerRaw, UserProfileRaw, PageTransitionRaw, LogoRaw, SegmentedControlRaw
};
export { BlurredPreview, PresenceIndicatorWrapper, RealtimeCursorWrapper, TypingIndicatorWrapper, InternalUserProfile };