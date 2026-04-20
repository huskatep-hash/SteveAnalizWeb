import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center mx-auto px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block tracking-tight text-lg">
              STEVE ANALİZ<span className="text-primary">.WEB</span>
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/blog"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/blog") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Blog
            </Link>
            <Link
              href="/education"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/education") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Eğitim
            </Link>
            <Link
              href="/writer"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/writer") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Yazarlar
            </Link>
            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive("/about") ? "text-foreground" : "text-foreground/60"
              )}
            >
              Vizyon
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile Nav could go here */}
            <div className="md:hidden flex items-center space-x-4">
              <Link href="/" className="font-bold text-lg">STEVE ANALİZ<span className="text-primary">.WEB</span></Link>
            </div>
          </div>
          <nav className="flex items-center space-x-2">
            <a
              href="https://youtube.com/@steveanalizweb"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              YouTube Kanalı
            </a>
          </nav>
        </div>
      </div>
    </nav>
  );
}
