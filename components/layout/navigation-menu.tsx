import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationMenuProps {
  user: any; // Replace with your user type
}

export function NavigationMenu({ user }: NavigationMenuProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex gap-6">
      <Link href="/" className={`text-sm ${pathname === "/" ? "font-medium" : "text-muted-foreground"}`}>
        Home
      </Link>
      
        
          <Link
            href="/ai-tools/dashboard"
            className={`text-sm ${pathname === "/dashboard" ? "font-medium" : "text-muted-foreground"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className={`text-sm ${pathname === "/chat" ? "font-medium" : "text-muted-foreground"}`}
          >
            AI Chat
          </Link>
        
      
      <Link
        href="/about"
        className={`text-sm ${pathname === "/about" ? "font-medium" : "text-muted-foreground"}`}
      >
        About
      </Link>
    </nav>
  );
}