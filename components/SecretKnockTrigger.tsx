'use client';

import React, { useRef } from 'react';

interface SecretKnockTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export default function SecretKnockTrigger({ children, className = '' }: SecretKnockTriggerProps) {
  const clickCountRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    clickCountRef.current += 1;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('open-secret-gate'));
      }
      return;
    }

    // Reset count after 2.5 seconds of inactivity
    timerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2500);
  };

  return (
    <span
      onClick={handleClick}
      className={`select-none cursor-default ${className}`}
      title=""
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
