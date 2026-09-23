"use client";

import type React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";
import { AppContainer } from "@/components/app/primitives/app-container";
import { PageHeaderCrm } from "@/Crm/Utils/Components/PageHeader";

export const crmSoft: Variants = {
  initial: {
    opacity: 0,
    y: 8,
    scale: 0.998,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.998,
    transition: {
      duration: 0.16,
      ease: [0.4, 0, 0.6, 1],
    },
  },
};

export const fadeElegant: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.18, ease: [0.4, 0, 0.6, 1] },
  },
};

export const fadePure: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.22, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.14, ease: "easeInOut" },
  },
};

export const professionalBlur: Variants = {
  initial: { opacity: 0, y: 6, filter: "blur(1.5px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.26, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    filter: "blur(1px)",
    transition: { duration: 0.16, ease: [0.4, 0, 0.6, 1] },
  },
};

const reducedMotion: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.12 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

type AnimationVariant =
  | "crm-soft"
  | "fade-elegant"
  | "fade-pure"
  | "professional-blur";

type AppContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

type PageTransitionProps = {
  titleHeader: string;
  subtitle?: string;
  fallbackBackTo?: string;
  actions?: React.ReactNode;
  stickyHeader?: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: AnimationVariant;
  containerSize?: AppContainerSize;
  showBackButton?: boolean;
};

const variantMap: Record<AnimationVariant, Variants> = {
  "crm-soft": crmSoft,
  "fade-elegant": fadeElegant,
  "fade-pure": fadePure,
  "professional-blur": professionalBlur,
};

export function PageTransitionCrm({
  children,
  className,
  contentClassName,
  titleHeader,
  subtitle,
  fallbackBackTo = "/crm",
  actions,
  stickyHeader = false,
  variant = "crm-soft",
  containerSize = "full",
  showBackButton = true,
}: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  const selectedVariants = shouldReduceMotion
    ? reducedMotion
    : variantMap[variant];

  return (
    <div className={cn("min-w-0", className)}>
      <PageHeaderCrm
        title={titleHeader}
        subtitle={subtitle}
        fallbackBackTo={fallbackBackTo}
        actions={actions}
        sticky={stickyHeader}
        showBackButton={showBackButton}
        containerSize={containerSize}
      />

      <motion.div
        variants={selectedVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-w-0"
      >
        <AppContainer
          size={containerSize}
          paddingX="sm"
          paddingY="xs"
          className={cn("min-w-0", contentClassName)}
        >
          {children}
        </AppContainer>
      </motion.div>
    </div>
  );
}
