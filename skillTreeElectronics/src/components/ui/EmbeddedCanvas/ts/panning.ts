  // ---- Configuration ----
  // Momentum
  // Scales how quickly momentum dies out after release.
  // 1 = default, >1 = stops sooner (heavier friction), <1 = glides farther, 0 = never stops.
  const DECELERATION = 1;
  const BASE_FRICTION = 3; // per second; fling distance ≈ speed / (BASE_FRICTION * DECELERATION)
  const VELOCITY_WINDOW_MS = 100; // only the last N ms of movement count toward release velocity
  const STALE_MS = 80; // if the pointer sat still this long before release, don't fling
  const MIN_SPEED = 10; // px/s; below this the glide stops
  const MAX_SPEED = 8000; // px/s; clamps absurd flings

  // Zoom
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 4;
  const INITIAL_ZOOM = 1;
  const WHEEL_ZOOM_SPEED = 0.0015; // mouse wheel: zoom factor = e^(-deltaY * speed)
  const PINCH_WHEEL_ZOOM_SPEED = 0.01; // trackpad pinch (ctrl+wheel) sends much smaller deltas

  const wrap = (v: number, size: number) => ((v % size) + size) % size;
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

  interface Pt {
    x: number;
    y: number;
  }

  function initCanvas(canvas: HTMLElement) {
    const grid = canvas.querySelector<HTMLElement>(":scope > .grid")!;
    const world = canvas.querySelector<HTMLElement>(":scope > .world")!;

    // Zoom math assumes the world's origin is its top-left corner
    world.style.transformOrigin = "0 0";

    const readBaseGrid = () =>
      parseFloat(getComputedStyle(canvas).getPropertyValue("--grid-size")) || 40;

    // View state: screen = pan + worldPoint * scale
    let panX = 0;
    let panY = 0;
    let scale = clamp(INITIAL_ZOOM, MIN_ZOOM, MAX_ZOOM);
    let baseGrid = readBaseGrid();
    let appliedCell = 0;

    // Active pointers (max 2), in insertion order
    const pointers = new Map<number, Pt>();
    let idA = -1;
    let idB = -1;
    let noFling = false; // set once a gesture has involved 2 fingers
    let rectLeft = 0;
    let rectTop = 0;

    // Single-pointer pan baseline
    let startX = 0;
    let startY = 0;
    let originX = 0;
    let originY = 0;

    // Two-pointer pinch baseline
    let pinchDist = 1;
    let pinchScale = 1;
    let pinchMidX = 0; // canvas-relative
    let pinchMidY = 0;
    let pinchPanX = 0;
    let pinchPanY = 0;

    // Momentum (velocity is in screen px/s, so it stays valid at any zoom level)
    let raf = 0;
    let momentumRaf = 0;
    let velX = 0;
    let velY = 0;
    let lastTime = 0;
    const samples: { x: number; y: number; t: number }[] = [];

    // Writes only (no layout reads except when the zoom level changed)
    function render() {
      // Grid tiles are re-sized on zoom (crisp lines) instead of scaling a bitmap
      const cell = baseGrid * scale;
      if (cell !== appliedCell) {
        appliedCell = cell;
        grid.style.inset = `${-cell}px`;
        grid.style.backgroundSize = `${cell}px ${cell}px`;
      }

      const x = Math.round(panX); // integer px keeps lines crisp
      const y = Math.round(panY);
      world.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      grid.style.transform = `translate3d(${Math.round(wrap(x, cell))}px, ${Math.round(wrap(y, cell))}px, 0)`;
    }

    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        render();
      });
    }

    // ---- Momentum ----
    function stopMomentum() {
      if (momentumRaf) {
        cancelAnimationFrame(momentumRaf);
        momentumRaf = 0;
      }
    }

    function momentumTick(now: number) {
      // Clamp dt: never negative (rAF timestamps can precede performance.now()),
      // and capped so a backgrounded tab doesn't teleport the canvas
      const dt = clamp((now - lastTime) / 1000, 0, 0.05);
      lastTime = now;

      const k = BASE_FRICTION * DECELERATION;
      const decay = Math.exp(-k * dt); // exact integration → frame-rate independent
      const step = k > 0 ? (1 - decay) / k : dt;

      panX += velX * step;
      panY += velY * step;
      velX *= decay;
      velY *= decay;
      render();

      if (Math.hypot(velX, velY) < MIN_SPEED) {
        momentumRaf = 0;
        return;
      }
      momentumRaf = requestAnimationFrame(momentumTick);
    }

    function startMomentum(upTime: number) {
      velX = velY = 0;
      const last = samples[samples.length - 1];
      const first = samples[0];

      if (last && first && upTime - last.t <= STALE_MS) {
        const dt = (last.t - first.t) / 1000;
        if (dt > 0) {
          velX = (last.x - first.x) / dt;
          velY = (last.y - first.y) / dt;
          const speed = Math.hypot(velX, velY);
          if (speed > MAX_SPEED) {
            velX *= MAX_SPEED / speed;
            velY *= MAX_SPEED / speed;
          }
        }
      }
      samples.length = 0;

      if (Math.hypot(velX, velY) < MIN_SPEED) return;
      lastTime = performance.now();
      momentumRaf = requestAnimationFrame(momentumTick);
    }

    // ---- Gesture baselines ----
    // Called whenever the set of active pointers (or the view) changes underneath a gesture.
    // Re-anchoring here is what prevents jumps when fingers land, lift, or get cancelled.
    function rebase(t: number) {
      samples.length = 0; // old velocity is meaningless after a mode change

      const r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;

      if (pointers.size === 1) {
        const p = pointers.values().next().value as Pt;
        startX = p.x;
        startY = p.y;
        originX = panX;
        originY = panY;
        samples.push({ x: panX, y: panY, t });
      } else if (pointers.size >= 2) {
        noFling = true;
        [idA, idB] = [...pointers.keys()];
        const a = pointers.get(idA)!;
        const b = pointers.get(idB)!;
        pinchDist = Math.max(Math.hypot(b.x - a.x, b.y - a.y), 1);
        pinchScale = scale;
        pinchMidX = (a.x + b.x) / 2 - rectLeft;
        pinchMidY = (a.y + b.y) / 2 - rectTop;
        pinchPanX = panX;
        pinchPanY = panY;
      }
    }

    // ---- Pointer handling ----
    function onMove(e: PointerEvent) {
      const p = pointers.get(e.pointerId);
      if (!p) return;
      p.x = e.clientX;
      p.y = e.clientY;

      if (pointers.size === 1) {
        panX = originX + (p.x - startX);
        panY = originY + (p.y - startY);

        samples.push({ x: panX, y: panY, t: e.timeStamp });
        while (samples.length > 2 && e.timeStamp - samples[0].t > VELOCITY_WINDOW_MS) {
          samples.shift();
        }
      } else {
        const a = pointers.get(idA)!;
        const b = pointers.get(idB)!;
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        const midX = (a.x + b.x) / 2 - rectLeft;
        const midY = (a.y + b.y) / 2 - rectTop;

        // Stateless against the baseline, so there is no accumulated drift.
        // The ratio uses the *clamped* scale, so hitting min/max doesn't shift the pan.
        const next = clamp((pinchScale * dist) / pinchDist, MIN_ZOOM, MAX_ZOOM);
        const ratio = next / pinchScale;
        panX = midX - (pinchMidX - pinchPanX) * ratio;
        panY = midY - (pinchMidY - pinchPanY) * ratio;
        scale = next;
      }
      schedule();
    }

    function onEnd(e: PointerEvent) {
      if (!pointers.has(e.pointerId)) return;
      pointers.delete(e.pointerId);
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);

      // A finger left but another remains (or one was cancelled): continue as a pan
      // from the remaining finger's current position, so there is no jump.
      if (pointers.size > 0) {
        rebase(e.timeStamp);
        return;
      }

      canvas.removeAttribute("data-dragging");
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onEnd);
      canvas.removeEventListener("pointercancel", onEnd);
      canvas.removeEventListener("lostpointercapture", onEnd);

      // Only a clean single-finger release flings. Cancelled gestures and gestures that
      // involved a pinch just stop (the lifting finger of a pinch gives noisy velocity).
      if (e.type === "pointerup" && !noFling) {
        startMomentum(e.timeStamp);
      } else {
        samples.length = 0;
      }
    }

    canvas.addEventListener("pointerdown", (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (pointers.size >= 2) return; // ignore a third finger

      stopMomentum(); // grabbing the canvas halts any glide

      if (pointers.size === 0) {
        noFling = false;
        // One style read per gesture, so CSS changes to --grid-size are respected
        baseGrid = readBaseGrid();
        canvas.setAttribute("data-dragging", "");
        // Move/up listeners exist only while dragging
        canvas.addEventListener("pointermove", onMove);
        canvas.addEventListener("pointerup", onEnd);
        canvas.addEventListener("pointercancel", onEnd);
        canvas.addEventListener("lostpointercapture", onEnd);
      }

      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      canvas.setPointerCapture(e.pointerId);
      rebase(e.timeStamp);
    });

    // ---- Wheel / trackpad pinch zoom (zooms around the cursor) ----
    canvas.addEventListener(
      "wheel",
      (e: WheelEvent) => {
        e.preventDefault(); // needs passive: false; also blocks browser page-zoom on ctrl+wheel
        stopMomentum();

        let dy = e.deltaY;
        if (e.deltaMode === 1) dy *= 16; // lines → px
        else if (e.deltaMode === 2) dy *= 400; // pages → px

        const speed = e.ctrlKey ? PINCH_WHEEL_ZOOM_SPEED : WHEEL_ZOOM_SPEED;
        const next = clamp(scale * Math.exp(-dy * speed), MIN_ZOOM, MAX_ZOOM);
        const ratio = next / scale;
        if (ratio === 1) return;

        const r = canvas.getBoundingClientRect();
        const cx = e.clientX - r.left;
        const cy = e.clientY - r.top;
        panX = cx - (cx - panX) * ratio;
        panY = cy - (cy - panY) * ratio;
        scale = next;

        // If a drag is in progress, its baselines are now stale
        if (pointers.size > 0) rebase(e.timeStamp);
        schedule();
      },
      { passive: false },
    );

    render();
  }

  document.querySelectorAll<HTMLElement>("[data-canvas]").forEach(initCanvas);
