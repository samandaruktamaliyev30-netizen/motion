import React from "react";

type P = { size?: number; color?: string; stroke?: number };

const Svg: React.FC<P & { children: React.ReactNode }> = ({
  size = 64,
  color = "currentColor",
  stroke = 2.2,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export const IconCert: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <path d="M7 8h10M7 11h6" />
    <circle cx="16.5" cy="15.5" r="2.5" />
    <path d="M15 17.6 14.5 21l2-1 2 1-.5-3.4" />
  </Svg>
);

export const IconUsers: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M16.5 14.2c2.6.3 4.5 2.6 4.5 5.3" />
  </Svg>
);

export const IconUser: React.FC<P> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M5 20.5c0-3.9 3.1-7 7-7s7 3.1 7 7" />
  </Svg>
);

export const IconCalendar: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);

export const IconBuilding: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M3 21h18M5 21V10M19 21V10M9 21v-6h6v6" />
    <path d="M2.5 10 12 4l9.5 6z" />
  </Svg>
);

export const IconCheck: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12.5 10 17.5 19.5 7" />
  </Svg>
);

export const IconX: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const IconWarning: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 22 20.5H2z" />
    <path d="M12 10v4.5M12 17.6v.1" />
  </Svg>
);

export const IconMegaphone: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M3 10v4h3l8 5V5L6 10z" />
    <path d="M17.5 9a4 4 0 0 1 0 6M20 6.5a7.5 7.5 0 0 1 0 11" />
  </Svg>
);

export const IconWrench: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8-1.5-1.5a4 4 0 0 1-5-5L13 2z" />
  </Svg>
);

export const IconTrash: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6" />
  </Svg>
);

export const IconSend: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M21.5 2.5 10.5 13.5M21.5 2.5 15 21.5l-4.5-8-8-4.5z" />
  </Svg>
);

export const IconHeart: React.FC<P> = ({ color = "#ff3b5c", size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.3 4.5 6.9 4.5c2 0 3.6 1.1 5.1 3 1.5-1.9 3.1-3 5.1-3 3.6 0 5.9 3.5 4.4 7.2C19.5 16.4 12 21 12 21z"
    />
  </svg>
);

export const IconBell: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </Svg>
);

export const IconQuestion: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M8.5 8.5a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.2-1.5 2.3v.5" />
    <path d="M12 18.5v.1" />
  </Svg>
);

export const IconFire: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 21.5c-4 0-7-2.8-7-6.6 0-3.4 2.4-5.4 3.8-7.4.4 1.7 1.3 2.8 2.4 3.3C11 7 12.5 4.3 15 2.5c0 3.5 4 6 4 11.4 0 4.3-3 7.6-7 7.6z" />
  </Svg>
);

export const IconBolt: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
  </Svg>
);

export const IconQuote: React.FC<P> = ({ size = 64, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill={color}
      d="M4 18v-5c0-4 2-7 6-8l.8 1.6C8.6 7.5 7.6 9 7.4 11H10v7zm10 0v-5c0-4 2-7 6-8l.8 1.6c-2.2.9-3.2 2.4-3.4 4.4H20v7z"
    />
  </svg>
);

export const IconMerge: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M6 3v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M12 14v7" />
  </Svg>
);
