"use client";

interface BrandIconProps {
  slug: string;
  color?: string;
  className?: string;
}

export function BrandIcon({ slug, color = "white", className = "h-4 w-4" }: BrandIconProps) {
  // Use simpleicons.org CDN for official brand icons
  // slug is the brand name in lowercase (e.g., 'whatsapp', 'gmail', 'slack')
  const src = `https://cdn.simpleicons.org/${slug}/${color}`;
  
  return (
    <img 
      src={src} 
      alt={`${slug} icon`} 
      className={className}
      loading="lazy"
    />
  );
}
