"use client";

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
  const brand = BrandConfigService.getConfigSync("dashboard");
  const logoSrc = brand.brandLogoUrl || brand.brandIconUrl || "/icon.png";

  return (
    <div className={containerClassName}>
      <img
        src={logoSrc}
        alt={brand.brandName}
        width={size}
        height={size}
        className={imageClassName}
        loading="lazy"
      />
    </div>
  );
}
