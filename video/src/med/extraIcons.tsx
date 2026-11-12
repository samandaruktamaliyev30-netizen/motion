import React from "react";
export * from "../reel/Icons";

type P = { size?: number; color?: string; stroke?: number };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 64, color = "currentColor", stroke = 2.2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IconBook: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M8 7h8M8 10.5h6" />
  </Svg>
);

export const IconHeartPulse: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7.5-4.5-9.3-9.2C1.4 7.3 3.6 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.3 4.3 6.8C19.5 15.5 12 20 12 20z" />
    <path d="M3 12h4l2-3 3 6 2-3h7" />
  </Svg>
);

export const IconChat: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 5h16v11H9l-5 4z" />
  </Svg>
);
