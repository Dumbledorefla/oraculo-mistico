/**
 * Header Component - Oráculo Místico
 * Menu responsivo com suporte mobile
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Menu, 
  X, 
  LogOut,
  Star,
  Calculator,
  Sun,
  Users,
  BookOpen,
  ShoppingBag,
  User,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useAuth0 } from "@auth0/auth0-react";

const navItems = [
  { 
    label: "Tarot", 
    href: "/tarot/dia",
    icon: Star,
    submenu: [
      { label: "Tarot do Dia", href: "/tarot/dia" },
      { label: "Tarot e o Amor", href: "/tarot/amor" },
      { label: "Tarot Completo", href: "/tarot/completo" },
    ]
  },
  { label: "Numerologia", href: "/numerologia", icon: Calculator },
  { label: "Horóscopo", href: "/horoscopo", icon: Sun },
  { label: "Consultas", href: "/consultas", icon: Users },
  { label: "Cursos", href: "/cursos", icon: BookOpen },
  { label: "Produtos", href: "/mapas-jogos", icon: ShoppingBag },
];

export default function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  
  const { loginWithRedirect } = useAuth0();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleLogin = () => {
    loginWithRedirect();
  };

  const toggleSubmenu = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-primary/20">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center border border-primary/30">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-serif text-xl font-bold text-primary">Oráculo Místico</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              {item.submenu ? (
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                    location.startsWith(item.href.split('/')[1] ? '/' + item.href.split('/')[1] : item.href)
                      ? "text-primary bg-primary/10"
                      : "text-white/80 hover:text-primary hover:bg-white/5"
                  }`}
                  onClick={() => toggleSubmenu(item.label)}
                >
                  {item.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                    location === item.href || location.startsWith(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-white/80 hover:text-primary hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              )}
              
              {/* Desktop Submenu */}
              {item.submenu && (
                <div className="absolute top-full left-0 mt-1 py-2 bg-gray-900/95 backdrop-blur-md rounded-lg border border-primary/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all min-w-[180px] shadow-xl">
                  {item.submenu.map((subitem) => (
                    <Link
                      key={subitem.href}
                      href={subitem.href}
                      className="block px-4 py-2 text-sm text-white/80 hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      {subitem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Link href="/perfil">
                <span className="text-sm text-white/70 hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-primary font-semibold">{user.name || user.email?.split('@')[0]}</span>
                </span>
              </Link>
              <Button 
                size="sm" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </>
          ) : (
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 border border-primary/50"
              onClick={handleLogin}
            >
              Entrar
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-white/80 hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-950/95 backdrop-blur-md border-b border-primary/20 overflow-hidden"
          >
            <nav className="container py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.submenu ? (
                    <>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-white/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        onClick={() => toggleSubmenu(item.label)}
                      >
                        <span className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          {item.label}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeSubmenu === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {activeSubmenu === item.label && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-8 space-y-1 overflow-hidden"
                          >
                            {item.submenu.map((subitem) => (
                              <Link
                                key={subitem.href}
                                href={subitem.href}
                                className="block px-4 py-2 text-sm text-white/60 hover:text-primary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subitem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        location === item.href || location.startsWith(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-white/80 hover:text-primary hover:bg-primary/10"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile Auth */}
              <div className="pt-4 mt-4 border-t border-primary/20">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <Link
                      href="/perfil"
                      className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Meu Perfil
                    </Link>
                    {user.email === 'milton.contato177@gmail.com' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Star className="w-5 h-5" />
                        Admin
                      </Link>
                    )}
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      handleLogin();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Entrar
                  </Button>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
