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
import Consultations from "./pages/Consultations";
import TaromanteProfile from "./pages/TaromanteProfile";
import TaromantePanel from "./pages/TaromantePanel";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseLesson from "./pages/CourseLesson";
import AdminPanel from "./pages/AdminPanel";

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
      {/* Consultas */}
      <Route path="/consultas" component={Consultations} />
      <Route path="/taromante/:slug" component={TaromanteProfile} />
      <Route path="/painel-taromante" component={TaromantePanel} />
      <Route path="/consulta/sucesso">
        {() => (
          <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-serif text-white mb-4">Consulta Agendada!</h1>
              <p className="text-gray-400 mb-6">
                Sua consulta foi agendada com sucesso. Você receberá um email com os detalhes e instruções para a sessão.
              </p>
              <a href="/perfil" className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors">
                Ver Minhas Consultas
              </a>
            </div>
          </div>
        )}
      </Route>
      {/* Cursos */}
      <Route path="/cursos" component={Courses} />
      <Route path="/curso/:slug" component={CourseDetail} />
      <Route path="/curso/:slug/aula/:lessonId" component={CourseLesson} />
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
      {/* Admin */}
      <Route path="/admin" component={AdminPanel} />
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
