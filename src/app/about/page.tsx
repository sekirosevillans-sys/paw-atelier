import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Leaf, HeartHandshake, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Nuestra Filosofía | PawAtelier",
  description: "Conoce el manifiesto, origen y proceso artesanal detrás de las piezas PawAtelier.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-20 bg-sand-100/60 border-b border-border/70 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-olive mb-2 block">
            El Manifiesto PawAtelier
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Creemos que tu compañero merece el mismo diseño que tu hogar.
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Nacimos como una respuesta contra la obsolescencia del plástico barato y los diseños chillones. Diseñamos piezas que celebran el vínculo entre especies con nobleza y durabilidad.
          </p>
        </div>
      </section>

      {/* Story & Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80"
                alt="Artesano trabajando cuero con un perro al lado"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-olive">
                Origen & Pasión
              </span>
              <h2 className="font-editorial text-3xl font-bold">
                Artesanía de Lenta Creación
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Cada costura en nuestros arneses y cada curvatura en nuestras camas ortopédicas es elaborada en talleres donde el tiempo es un aliado, no un costo a recortar.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                Trabajamos exclusivamente con curtidoras toscanas que utilizan cortezas de mimosa y castaño en vez de sales de cromo, asegurando que tu perro jamás esté expuesto a sustancias agresivas en su piel.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
            <div className="space-y-4 md:order-1">
              <span className="text-xs font-bold uppercase tracking-widest text-terracotta">
                Veterinarios & Etólogos
              </span>
              <h2 className="font-editorial text-3xl font-bold">
                Ciencia Postural & Confort Emocional
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                La belleza estética carece de sentido si no alivia la columna vertebral de un perro adulto o el cuello de un gato al alimentarse.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                Nuestras espumas con memoria viscoelástica médica distribuyen el peso uniformemente, aliviando la displasia de cadera y la artritis en razas propensas.
              </p>
            </div>
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border shadow-md md:order-2">
              <Image
                src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80"
                alt="Perro relajado durmiendo plácidamente"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 bg-sand-100/60 border-t border-border/80 text-center">
        <div className="container mx-auto px-4 max-w-xl space-y-6">
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold">
            Descubre las piezas curadas de esta temporada
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Ofrecemos garantía incondicional de 30 días en cada producto para que tu compañero lo sienta y apruebe en casa.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 gap-2">
            <Link href="/catalog">
              <span>Explorar Catálogo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
