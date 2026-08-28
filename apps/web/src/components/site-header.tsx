"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Play, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { useAudio } from "@/components/audio-player";
import { ThemeToggler } from "@/components/animate-ui/primitives/effects/theme-toggler";

const links = [
  { href: "/", label: "Home" },
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { playRandom } = useAudio();
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const stableTheme = mounted && (theme === "light" || theme === "dark" || theme === "system")
    ? theme
    : "system";
  const stableResolvedTheme = mounted && resolvedTheme === "light" ? "light" : "dark";

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Ulvin Najafov, home">
          <span className="brand-mark" aria-hidden="true">UN</span>
          <span className="brand-name">Ulvin Najafov</span>
        </Link>
        <nav className="nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link" data-active={pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="button button-ghost listen-button" onClick={playRandom} title="Play a random work">
            <Play size={14} fill="currentColor" /> Random listen
          </button>
          <ThemeToggler
            theme={stableTheme}
            resolvedTheme={stableResolvedTheme}
            setTheme={setTheme}
            direction="rtl"
            onImmediateChange={(nextTheme) => {
              const resolved = nextTheme === "system"
                ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
                : nextTheme;
              document.documentElement.setAttribute("data-theme", resolved);
            }}
          >
            {({ resolved, toggleTheme }) => (
              <button type="button" className="icon-button" aria-label="Toggle color theme" onClick={() => toggleTheme(resolved === "light" ? "dark" : "light")}>
                {resolved === "light" ? <Moon size={17} /> : <Sun size={17} />}
              </button>
            )}
          </ThemeToggler>
          <button type="button" className="icon-button mobile-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className="nav-link" onClick={() => setOpen(false)}>{link.label}</Link>)}
        </nav>
      )}
    </header>
  );
}
