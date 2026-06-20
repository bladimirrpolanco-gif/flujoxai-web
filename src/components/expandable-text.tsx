"use client";

import { useState } from 'react';

export function ExpandableText({ text, maxLength = 200 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  const displayText = isExpanded ? text : `${text.slice(0, maxLength)}...`;

  return (
    <>
      {displayText}{' '}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-primary font-semibold hover:underline text-xs ml-1"
      >
        {isExpanded ? 'Ver menos' : 'Ver más'}
      </button>
    </>
  );
}
