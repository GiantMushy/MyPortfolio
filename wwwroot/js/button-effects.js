(function(){
  function emitSparkles(btn, count) {
    const rect = btn.getBoundingClientRect();
    // Ensure a container exists for sparkles
    let container = btn.querySelector('.sparkles');
    if (!container) {
      container = document.createElement('div');
      container.className = 'sparkles';
      container.style.position = 'absolute';
      container.style.inset = '0';
      container.style.pointerEvents = 'none';
      btn.appendChild(container);
    }

    const maxR = Math.max(rect.width, rect.height) * 0.9;
    for (let i = 0; i < count; i++) {
      const s = document.createElement('i');
      s.className = 'sparkle';
      const angle = Math.random() * Math.PI * 2; // 0..2π
      const radius = maxR * (0.5 + Math.random() * 0.7); // outward distance
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      s.style.setProperty('--tx', dx + 'px');
      s.style.setProperty('--ty', dy + 'px');

      container.appendChild(s);

      // trigger animation in next frame
      requestAnimationFrame(() => {
        s.classList.add('spark');
      });

      // cleanup after animation
      s.addEventListener('animationend', () => {
        s.remove();
        // remove container if empty to keep DOM tidy
        if (!container.querySelector('.sparkle')) {
          container.remove();
        }
      }, { once: true });
    }
  }

  function setup() {
    const hoverIntervals = new WeakMap();
    document.querySelectorAll('.btn-sparkle').forEach(btn => {
      btn.style.position = 'relative';

      // Click burst
      btn.addEventListener('click', () => emitSparkles(btn, 14));

      // Hover continuous sparkle (gentle)
      btn.addEventListener('mouseenter', () => {
        if (hoverIntervals.get(btn)) return;
        const id = setInterval(() => emitSparkles(btn, 2), 260);
        hoverIntervals.set(btn, id);
      });
      btn.addEventListener('mouseleave', () => {
        const id = hoverIntervals.get(btn);
        if (id) { clearInterval(id); hoverIntervals.delete(btn); }
      });
      // Also stop on blur/visibility changes just in case
      btn.addEventListener('blur', () => {
        const id = hoverIntervals.get(btn);
        if (id) { clearInterval(id); hoverIntervals.delete(btn); }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
