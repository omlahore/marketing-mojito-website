'use client';

import { createElement, useEffect, useRef, type CSSProperties } from 'react';

interface Hero3DModelProps {
  modelPath: string;
  className?: string;
  style?: CSSProperties;
}

export default function Hero3DModel({ modelPath, className, style }: Hero3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (customElements.get('model-viewer')) return;
    if (document.querySelector('script[src*="@google/model-viewer"]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
    document.head.appendChild(script);
  }, []);

  const viewerStyle: CSSProperties & Record<'--poster-color', string> = {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    backgroundColor: 'transparent',
    '--poster-color': 'transparent',
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        maxHeight: 600,
        overflow: 'hidden',
        ...style,
      }}
    >
      {createElement('model-viewer' as 'div', {
        src: modelPath,
        'auto-rotate': '',
        'auto-rotate-delay': '0',
        'rotation-per-second': '30deg',
        'camera-controls': '',
        'disable-zoom': '',
        'camera-orbit': '0deg 75deg 105%',
        'environment-image': 'neutral',
        'shadow-intensity': '1',
        style: viewerStyle,
      })}
    </div>
  );
}
