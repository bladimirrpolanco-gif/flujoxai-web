import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: '#0866D9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: 120,
            fontWeight: 800,
            fontFamily: 'sans-serif',
            letterSpacing: '-4px',
            marginTop: -4,
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size }
  );
}
