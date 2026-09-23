// src/components/charts/ProgressBullet.tsx
"use client";

import { ResponsiveBullet } from "@nivo/bullet";
import { cn } from "@/lib/utils";

type BulletItem = {
  id: string;
  ranges: number[]; // fondo: [realizado, meta] => permite colorear el faltante
  measures: number[]; // barra de progreso
  markers?: number[]; // referencia
};

type Props = {
  metaQ: number;
  actualQ: number;
  /** % de referencia del periodo (0..100). Opcional */
  refPct?: number;
  className?: string;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

export function ProgressBullet({ metaQ, actualQ, refPct, className }: Props) {
  // evitar dominio [0,0]
  const meta = Math.max(0.0001, Number(metaQ) || 0);
  const actual = clamp(Number(actualQ) || 0, 0, meta);

  // marcador de referencia en misma escala de la meta
  const refQ =
    refPct == null ? undefined : (meta * clamp(refPct, 0, 100)) / 100;

  // Si actual > 0 mostramos dos rangos: realizado y restante
  // Si actual === 0, solo un rango (todo "restante") para que el color sea el correcto.
  const ranges = actual > 0 ? [actual, meta] : [meta];

  const COLORS = {
    track: "#EEF2F7", // gris de fondo
    progressBg: "#de265c", // rosa claro tipo Tailwind rose-200
    remaining: "#FCD34D", // amarillo (faltante)
    progress: "#1fc99a", // verde principal
    marker: "#2563EB", // azul referencia
  };

  const rangeColors =
    actual > 0 ? [COLORS.progressBg, COLORS.remaining] : [COLORS.remaining];

  const data: BulletItem[] = [
    {
      id: "",
      ranges,
      measures: [actual],
      markers: refQ != null ? [refQ] : [],
    },
  ];

  return (
    // El wrapper redondea y recorta el SVG para que se vea "pill"
    <div className={cn("w-full", className)}>
      <div className="h-full w-full rounded-full overflow-hidden">
        <ResponsiveBullet
          data={data}
          layout="horizontal"
          spacing={0}
          // barra más fina para que se vea el faltante alrededor
          measureSize={1}
          // hacemos la barra más "alta" relativo al track
          markerSize={0.9} // ¡marca más visible!
          margin={{ top: 0, right: 8, bottom: 0, left: 8 }}
          rangeColors={rangeColors}
          measureColors={[COLORS.progress]}
          markerColors={[COLORS.marker]}
          maxValue={meta}
          isInteractive={false}
          animate
          motionConfig="gentle"
        />
      </div>
    </div>
  );
}
