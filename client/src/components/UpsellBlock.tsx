import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface UpsellBlockProps {
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  price?: string;
}

/**
 * Componente de Upsell Freemium
 * Exibido ao final de métodos gratuitos para converter usuários para versões pagas
 * Design: Roxo místico com dourado sutil
 */
export function UpsellBlock({
  title,
  description,
  features,
  ctaText,
  ctaLink,
  price,
}: UpsellBlockProps) {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-900/10 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-4">
          {/* Ícone de Estrela Dourada */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 space-y-4">
            {/* Título */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Features */}
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-purple-400 mt-0.5">✦</span>
                  <span className="text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="flex items-center gap-4 pt-2">
              <Link href={ctaLink}>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              {price && (
                <span className="text-2xl font-bold text-primary">
                  {price}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
