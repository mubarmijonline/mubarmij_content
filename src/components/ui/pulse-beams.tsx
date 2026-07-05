"use client";

import * as React from "react";
import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface BeamPath {
  path: string;
  gradientConfig: {
    initial: {
      x1: string;
      x2: string;
      y1: string;
      y2: string;
    };
    animate: {
      x1: string | string[];
      x2: string | string[];
      y1: string | string[];
      y2: string | string[];
    };
    transition?: {
      duration?: number;
      repeat?: number;
      repeatType?: "loop" | "reverse" | "mirror";
      ease?: string;
      repeatDelay?: number;
      delay?: number;
    };
  };
  connectionPoints?: Array<{ cx: number; cy: number; r: number }>;
}

export interface GradientStops {
  start: string;
  middle: string;
  end: string;
}

export interface PulseBeamsProps {
  children?: React.ReactNode;
  className?: string;
  background?: React.ReactNode;
  beams: BeamPath[];
  width?: number;
  height?: number;
  baseColor?: string;
  accentColor?: string;
  gradientColors?: GradientStops;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export const PulseBeams: React.FC<PulseBeamsProps> = ({
  children,
  className,
  background,
  beams,
  width = 858,
  height = 434,
  baseColor = "rgba(255,255,255,0.08)",
  accentColor = "rgba(212,162,76,0.45)",
  gradientColors,
}) => {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden antialiased",
        className,
      )}
    >
      {background}
      <div className="absolute inset-0 flex items-center justify-center">
        <SVGs
          beams={beams}
          width={width}
          height={height}
          baseColor={baseColor}
          accentColor={accentColor}
          gradientColors={gradientColors}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*  Internals                                                                 */
/* -------------------------------------------------------------------------- */

interface SVGsProps {
  beams: BeamPath[];
  width: number;
  height: number;
  baseColor: string;
  accentColor: string;
  gradientColors?: GradientStops;
}

const SVGs: React.FC<SVGsProps> = ({
  beams,
  width,
  height,
  baseColor,
  accentColor,
  gradientColors,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex flex-shrink-0"
      aria-hidden="true"
    >
      {beams.map((beam, index) => (
        <React.Fragment key={index}>
          <path d={beam.path} stroke={baseColor} strokeWidth="1" />
          <path
            d={beam.path}
            stroke={`url(#pulse-grad-${index})`}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {beam.connectionPoints?.map((point, pointIndex) => (
            <circle
              key={`${index}-${pointIndex}`}
              cx={point.cx}
              cy={point.cy}
              r={point.r}
              fill={baseColor}
              stroke={accentColor}
            />
          ))}
        </React.Fragment>
      ))}

      <defs>
        {beams.map((beam, index) => (
          <motion.linearGradient
            key={index}
            id={`pulse-grad-${index}`}
            gradientUnits="userSpaceOnUse"
            initial={beam.gradientConfig.initial}
            animate={beam.gradientConfig.animate}
            transition={beam.gradientConfig.transition as Transition}
          >
            <GradientColors colors={gradientColors} />
          </motion.linearGradient>
        ))}
      </defs>
    </svg>
  );
};

const GradientColors: React.FC<{ colors?: GradientStops }> = ({
  colors = { start: "#D4A24C", middle: "#F4C97A", end: "#1E3A5F" },
}) => {
  return (
    <>
      <stop offset="0%" stopColor={colors.start} stopOpacity="0" />
      <stop offset="20%" stopColor={colors.start} stopOpacity="1" />
      <stop offset="50%" stopColor={colors.middle} stopOpacity="1" />
      <stop offset="100%" stopColor={colors.end} stopOpacity="0" />
    </>
  );
};
