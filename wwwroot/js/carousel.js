// Project detail carousel: slides glide horizontally with a crossfade,
// wrap around at the ends, and can be driven by arrows or position dots.
(function () {
  function initCarousel(root) {
    var track = root.querySelector('.carousel-track');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.children);
    var dots = Array.prototype.slice.call(root.querySelectorAll('.carousel-dot'));
    if (slides.length === 0) return;

    var index = 0;

    function go(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      slides.forEach(function (s, j) { s.classList.toggle('active', j === index); });
      dots.forEach(function (d, j) { d.classList.toggle('active', j === index); });
    }

    var prev = root.querySelector('.carousel-prev');
    var next = root.querySelector('.carousel-next');
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
    dots.forEach(function (dot, j) {
      dot.addEventListener('click', function () { go(j); });
    });

    // Left/right arrow keys work while the carousel (or its controls) has focus.
    root.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowLeft') { go(index - 1); ev.preventDefault(); }
      if (ev.key === 'ArrowRight') { go(index + 1); ev.preventDefault(); }
    });

    go(0);
  }

  function setup() {
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
