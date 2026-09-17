'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';

export interface StreamingTextProps {
  text: string;
  speed?: number; // ms per token, default 16ms
  chunkSize?: number; // tokens per step, default 1
  enabled?: boolean;
  onComplete?: () => void;
  className?: string;
  cursorColor?: string; // hex or tailwind class
  showCursor?: boolean;
}

export function StreamingText({
  text,
  speed = 16,
  chunkSize = 1,
  enabled = true,
  onComplete,
  className = '',
  cursorColor = '#0070f2',
  showCursor = true,
}: StreamingTextProps) {
  // Tokenize text while preserving whitespace and newlines
  const tokens = useMemo(() => {
    if (!text) return [];
    return text.match(/(\S+\s*|\n+)/g) || [text];
  }, [text]);

  const [visibleCount, setVisibleCount] = useState<number>(() => (enabled ? 0 : tokens.length));
  const [isFinished, setIsFinished] = useState<boolean>(!enabled);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!enabled) {
      setVisibleCount(tokens.length);
      setIsFinished(true);
      return;
    }

    // Reset stream whenever text changes
    setVisibleCount(0);
    setIsFinished(false);

    if (tokens.length === 0) {
      setIsFinished(true);
      onCompleteRef.current?.();
      return;
    }

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + chunkSize;
        if (next >= tokens.length) {
          clearInterval(interval);
          setIsFinished(true);
          onCompleteRef.current?.();
          return tokens.length;
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [tokens, speed, chunkSize, enabled]);

  const displayedText = useMemo(() => {
    if (!enabled || isFinished) return text;
    return tokens.slice(0, visibleCount).join('');
  }, [tokens, visibleCount, enabled, isFinished, text]);

  return (
    <span className={className}>
      {displayedText}
      {!isFinished && showCursor && (
        <span
          className="inline-block w-1.5 h-[1.15em] ml-0.5 align-middle animate-pulse rounded-xs"
          style={{ backgroundColor: cursorColor }}
          aria-hidden="true"
        />
      )}
    </span>
  );
}
