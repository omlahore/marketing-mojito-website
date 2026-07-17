'use client';

import { useEffect } from 'react';

/**
 * Custom cursor: a precise leading dot + a trailing ring that stretches with
 * pointer velocity (comet/elastic feel) and snaps to a clean circle with a
 * "→" arrow over interactive elements. Native cursor is hidden except on form
 * fields, so typing stays normal. Off on touch + prefers-reduced-motion.
 */
export default function CursorFollower() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const style = document.createElement('style');
    style.textContent = `
      html.mmcur-active, html.mmcur-active * { cursor: none !important; }
      html.mmcur-active input, html.mmcur-active textarea, html.mmcur-active select,
      html.mmcur-active [contenteditable="true"] { cursor: auto !important; }
      .mmcur-dot, .mmcur-ring { position: fixed; top: 0; left: 0; z-index: 99999; pointer-events: none; opacity: 0; transition: opacity .3s; will-change: transform; }
      .mmcur-dot .d { position: absolute; left: 0; top: 0; width: 8px; height: 8px; border-radius: 50%; background: #82c341; transform: translate(-50%, -50%); box-shadow: 0 0 10px rgba(130,195,65,.6); }
      .mmcur-ring .r { position: absolute; left: 0; top: 0; width: 40px; height: 40px; border-radius: 50%;
        border: 1.5px solid rgba(130,195,65,.85); background: rgba(130,195,65,0);
        display: flex; align-items: center; justify-content: center;
        transition: background .28s, border-color .28s, box-shadow .28s; }
      .mmcur-ring .r svg { width: 15px; height: 15px; stroke: #1c1c1c; opacity: 0; transform: scale(.5) rotate(-20deg); transition: opacity .22s, transform .22s; }
      .mmcur-ring.on .r { background: rgba(130,195,65,.16); border-color: #82c341; box-shadow: 0 0 26px rgba(130,195,65,.35); }
      .mmcur-ring.on .r svg { opacity: 1; transform: scale(1) rotate(0deg); }
      .mmcur-ring.on + .mmcur-dot .d, .mmcur-dot.hide .d { opacity: 0; }
    `;
    document.head.appendChild(style);

    const ring = document.createElement('div');
    ring.className = 'mmcur-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.innerHTML =
      '<div class="r"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></div>';
    const dot = document.createElement('div');
    dot.className = 'mmcur-dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.innerHTML = '<div class="d"></div>';
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.documentElement.classList.add('mmcur-active');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let lmx = mx;
    let lmy = my;
    let rx = mx;
    let ry = my;
    let dx = mx;
    let dy = my;
    let hoverScale = 1;
    let stretch = 0;
    let angle = 0;
    let hovering = false;
    let shown = false;
    let raf = 0;

    const show = () => {
      if (!shown) {
        shown = true;
        ring.style.opacity = '1';
        dot.style.opacity = '1';
      }
    };
    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      show();
    };
    const over = (e: Event) => {
      const t = e.target as HTMLElement | null;
      hovering = !!(t && t.closest && t.closest('a,button,[role="button"],input,textarea,select,label,summary,[onclick],.cursor-pointer'));
      ring.classList.toggle('on', hovering);
      dot.classList.toggle('hide', hovering);
    };
    const down = () => ring.classList.add('down');
    const up = () => ring.classList.remove('down');
    const leave = () => {
      ring.style.opacity = '0';
      dot.style.opacity = '0';
      shown = false;
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    document.addEventListener('mouseleave', leave);

    const loop = () => {
      // pointer velocity (per frame)
      const vx = mx - lmx;
      const vy = my - lmy;
      lmx = mx;
      lmy = my;
      const speed = Math.hypot(vx, vy);
      if (speed > 1.4) angle = (Math.atan2(vy, vx) * 180) / Math.PI;

      // ring trails; dot leads (near-instant)
      rx += (mx - rx) * 0.2;
      ry += (my - ry) * 0.2;
      dx += (mx - dx) * 0.85;
      dy += (my - dy) * 0.85;

      // elastic: stretch along travel when moving fast, snap to circle on hover
      const targetStretch = hovering ? 0 : Math.min(speed * 0.011, 0.5);
      stretch += (targetStretch - stretch) * 0.18;
      hoverScale += ((hovering ? 1.75 : 1) - hoverScale) * 0.18;
      const sx = hoverScale * (1 + stretch);
      const sy = hoverScale * (1 - stretch * 0.72);

      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      const rc = ring.firstElementChild as HTMLElement;
      rc.style.transform = `translate(-50%,-50%) rotate(${angle}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0)`;

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
      document.removeEventListener('mouseleave', leave);
      document.documentElement.classList.remove('mmcur-active');
      ring.remove();
      dot.remove();
      style.remove();
    };
  }, []);

  return null;
}
