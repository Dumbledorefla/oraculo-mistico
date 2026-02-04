import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import TarotGame from "./pages/TarotGame";
import Numerology from "./pages/Numerology";
import Horoscope from "./pages/Horoscope";
import Profile from "./pages/Profile";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Sample from "./pages/Sample";
import Cart from "./pages/Cart";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import MyProducts from "./pages/MyProducts";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Catálogo de Produtos */}
      <Route path="/mapas-jogos" component={Catalog} />
      <Route path="/produto/:slug" component={ProductDetail} />
      <Route path="/amostra/:slug" component={Sample} />
      <Route path="/carrinho" component={Cart} />
      <Route path="/checkout/sucesso" component={CheckoutSuccess} />
      <Route path="/meus-produtos" component={MyProducts} />
      {/* Tarot */}
      <Route path="/tarot/dia">
        {() => <TarotGame gameType="dia" />}
      </Route>
      <Route path="/tarot/amor">
        {() => <TarotGame gameType="amor" />}
      </Route>
      <Route path="/tarot/completo">
        {() => <TarotGame gameType="completo" />}
      </Route>
      {/* Outros */}
      <Route path="/numerologia" component={Numerology} />
      <Route path="/horoscopo" component={Horoscope} />
      <Route path="/perfil" component={Profile} />
      <Route path="/mapa-astral">
        {() => (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Mapa Astral</h1>
              <p className="text-muted-foreground">Em breve!</p>
            </div>
          </div>
        )}
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
