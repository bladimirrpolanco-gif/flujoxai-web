'use client';

export function AdPlaceholder({ width = '100%', height = '250px' }: { width?: string, height?: string }) {
    // Retornamos null para que el bloque sea invisible al público.
    // Google AdSense insertará los anuncios automáticamente gracias al script en layout.tsx
    return null;
}
