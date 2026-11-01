import React from "react";

interface GlobePayLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  variant?: "full" | "icon" | "mark";
  showTagline?: boolean;
  className?: string;
  isDark?: boolean;
}

export const GlobePayMark: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
    >
      <defs>
        {/* Outer Background Gradient */}
        <linearGradient id="gp_bg_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>

        {/* Dynamic Orbital Flow Gradient */}
        <linearGradient id="gp_orbit_grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        {/* Core Meridian Gradient */}
        <linearGradient id="gp_core_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>

        {/* Pulse Accent Gradient */}
        <linearGradient id="gp_pulse_grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Soft Drop Shadow for Depth */}
        <filter id="gp_shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#4338CA" floodOpacity="0.35" />
        </filter>

        {/* Subtle Specular Sheen */}
        <linearGradient id="gp_sheen" x1="20%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Main Container Squircle with Shadow */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="24"
        fill="url(#gp_bg_grad)"
        filter="url(#gp_shadow)"
      />

      {/* Glass Gloss Sheen */}
      <path
        d="M6 30 C 6 16.7 16.7 6 30 6 L 70 6 C 83.3 6 94 16.7 94 30 C 70 38 30 40 6 30 Z"
        fill="url(#gp_sheen)"
      />

      {/* Globe Meridian Latitude 1 (Upper Arc) */}
      <path
        d="M26 38 C 36 28 64 28 74 38"
        stroke="#E0E7FF"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />

      {/* Globe Meridian Latitude 2 (Lower Arc) */}
      <path
        d="M28 64 C 38 72 62 72 72 64"
        stroke="#E0E7FF"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />

      {/* Core "G" + Globe Sphere Line (Vector Monogram) */}
      <path
        d="M 50 20 C 33.4 20 20 33.4 20 50 C 20 66.6 33.4 80 50 80 C 64 80 75.8 70.5 79 57.5 L 53 57.5"
        stroke="url(#gp_core_grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic 1-Tap Payment Orbital Loop (Forming "P" loop & payment trajectory) */}
      <path
        d="M 53 27 C 67 27 78 35 78 46 C 78 57 66 65 52 65"
        stroke="url(#gp_orbit_grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Forward Instant Settlement Arrow inside the Loop */}
      <path
        d="M 48 57.5 L 56 50 L 48 42.5"
        stroke="#FFFFFF"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 1-Tap Pulse Beacon / Global Nexus Dot */}
      <circle cx="78" cy="36" r="4.5" fill="url(#gp_pulse_grad)" />
      <circle cx="78" cy="36" r="7" stroke="#34D399" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
};

export const GlobePayLogo: React.FC<GlobePayLogoProps> = ({
  size = "md",
  variant = "full",
  showTagline = true,
  className = "",
}) => {
  const pixelSizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 48,
    xl: 60,
  };

  const markSize = typeof size === "number" ? size : pixelSizes[size] || 40;

  if (variant === "icon" || variant === "mark") {
    return <GlobePayMark size={markSize} className={className} />;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Precision Icon Mark */}
      <GlobePayMark size={markSize} />

      {/* High-Impact Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-tight font-extrabold leading-none">
          <span className="text-slate-900 dark:text-white transition-colors text-xl sm:text-2xl">
            Globe
          </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 dark:from-brand-400 dark:via-indigo-400 dark:to-purple-400 text-xl sm:text-2xl ml-0.5">
            Pay
          </span>
          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Global
          </span>
        </div>

        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Universal Scan & Pay
          </span>
        )}
      </div>
    </div>
  );
};

export default GlobePayLogo;

