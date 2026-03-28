'use client';

import { Navbar, Footer, ThemeCustomizer } from "@/ui";
import { ThemeManager } from "@/components/providers/ThemeManager";
import { AuthProvider, useAuth } from "@/lib/hooks/useAuth";
import { Toaster } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/ui";
import { Github } from "lucide-react";

export function AppNavbar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  const navbarUser = user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
    email: user.email,
    avatar: user.user_metadata?.avatar_url
  } : null;

  return (
    <Navbar 
      links={[
        { label: 'Showcase', href: '/' },
        { label: 'Documentation', href: '/docs' },
        { label: 'Contact', href: '/contact' },
      ]}
      onSearch={(query: string) => console.log('Searching for:', query)}
      user={navbarUser}
      onLogout={signOut}
      onSwitchAccount={async () => {
        await signOut();
        router.push("/auth");
      }}
      actions={
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 rounded-full text-zinc-400 hover:text-white"
            onClick={() => window.open('https://github.com/Pruthv-creates/hackathon-starter-kit', '_blank')}
          >
            <Github size={20} />
          </Button>
          {!user && (
            <Link href="/auth">
              <Button variant="outline" size="sm" className="font-bold uppercase tracking-wider">
                Login
              </Button>
            </Link>
          )}
        </div>
      }
    />
  );
}

export function AppFooter() {
  return (
    <Footer 
      brandDescription="The premium starter kit for elite hackathon projects."
      sections={[
        {
          title: "Product",
          links: [
            { label: "Features", href: "#" },
            { label: "Components", href: "#" },
            { label: "Templates", href: "#" }
          ]
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "#" },
            { label: "Contact", href: "/contact" },
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" }
          ]
        }
      ]}
    />
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeManager>
        <AppNavbar />
        {children}
        <AppFooter />
        <Toaster position="bottom-right" richColors />
        <ThemeCustomizer />
      </ThemeManager>
    </AuthProvider>
  );
}
