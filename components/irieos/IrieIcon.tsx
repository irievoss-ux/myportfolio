"use client";

import type { AppId } from "@/components/irieos/types";

interface IrieIconProps {
  appId: AppId;
  fallback: string;
  className?: string;
}

export default function IrieIcon({ appId, fallback, className = "" }: IrieIconProps) {
  return (
    <span className={`irie-app-icon irie-app-icon-${appId} ${className}`} aria-hidden="true">
      <span>{fallback}</span>
    </span>
  );
}
