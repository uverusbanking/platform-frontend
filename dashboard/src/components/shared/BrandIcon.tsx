"use client";

import Image from "next/image";
import { BrandConfigService } from "@shared/core";

type BrandIconProps = {
  containerClassName?: string;
  imageClassName?: string;
  size?: number;
};

export function BrandIcon({
  containerClassName = "w-9 h-9 rounded-xl shadow-lg flex items-center justify-center ring-1 ring-white/10",
  imageClassName = "h-5 w-5 object-contain",
  size = 20,
}: BrandIconProps) {
  const brandConfig = BrandConfigService.getConfigSync("dashboard");
  return (
    <div className={containerClassName}>
      <Image
        src="/icon.png"
        alt={`${brandConfig.brandName} icon`}
        width={size}
        height={size}
        className={imageClassName}
      />
    </div>
  );
}
