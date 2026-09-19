// Project card behaviour:
//  - cards show the still (first frame) of their current image; gifs only play while hovered
//  - hover arrows step through the project's numbered images (wrap-around)
//  - arrow clicks never open the project detail view
//  - on touch devices (no hover), the card nearest the middle of the screen auto-plays
//    its gif as you scroll — one at a time
(function () {
  var touchMq = window.matchMedia ? window.matchMedia('(hover: none)') : { matches: false };

  function setup() {
    var cardApis = [];

    document.querySelectorAll('.project-card[data-slides]').forEach(function (card) {
      var slides;
      try { slides = JSON.parse(card.dataset.slides); } catch (e) { return; }
      if (!slides || slides.length === 0) return;

      var img = card.querySelector('.card-thumbnail');
      if (!img) return;

      var index = 0;
      var hovered = false;
      var autoplaying = false;

      function show() {
        var slide = slides[index];
        var desired = (hovered || autoplaying) ? slide.src : slide.still;
        // While a gif is actually animating, the card gets a class so overlays
        // (like the time badge) can step back and give the gameplay focus.
        card.classList.toggle('card-playing', desired === slide.src && slide.src !== slide.still);
        if (img.getAttribute('src') !== desired) {
          // Clearing src first makes gifs restart from their first frame.
          img.src = '';
          img.src = desired;
        }
      }

      function step(delta) {
        index = (index + delta + slides.length) % slides.length;
        show();
      }

      card.addEventListener('mouseenter', function () { hovered = true; show(); });
      card.addEventListener('mouseleave', function () { hovered = false; show(); });

      var prev = card.querySelector('.card-arrow-prev');
      var next = card.querySelector('.card-arrow-next');
      [[prev, -1], [next, 1]].forEach(function (pair) {
        var btn = pair[0], delta = pair[1];
        if (!btn) return;
        btn.addEventListener('click', function (ev) {
          ev.stopPropagation();
          ev.preventDefault();
          step(delta);
        });
        btn.addEventListener('keydown', function (ev) { ev.stopPropagation(); });
      });

      cardApis.push({
        el: card,
        setAutoplay: function (on) {
          if (autoplaying === on) return;
          autoplaying = on;
          show();
        }
      });
    });

    // ----- Touch-device scroll autoplay -----
    // A horizontal band across the middle of the screen decides which card has
    // "attention": when a card enters the band its gif plays, and the previous
    // one stops. No-ops entirely on hover-capable (mouse) devices.
    if ('IntersectionObserver' in window && cardApis.length > 0) {
      var current = null;
      var inBand = [];

      function apiFor(el) {
        for (var i = 0; i < cardApis.length; i++) {
          if (cardApis[i].el === el) return cardApis[i];
        }
        return null;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var api = apiFor(entry.target);
          if (!api) return;
          var pos = inBand.indexOf(api);
          if (entry.isIntersecting && pos === -1) inBand.push(api);
          if (!entry.isIntersecting && pos !== -1) inBand.splice(pos, 1);
        });

        if (!touchMq.matches) return;

        // Two neighbouring cards can touch the band at once — play only the
        // one whose centre is closest to the middle of the screen.
        var best = null;
        var bestDist = Infinity;
        var mid = window.innerHeight / 2;
        inBand.forEach(function (api) {
          var r = api.el.getBoundingClientRect();
          var d = Math.abs((r.top + r.bottom) / 2 - mid);
          if (d < bestDist) { bestDist = d; best = api; }
        });

        if (best !== current) {
          if (current) current.setAutoplay(false);
          current = best;
          if (current) current.setAutoplay(true);
        }
      }, { rootMargin: '-35% 0px -35% 0px', threshold: 0 });

      cardApis.forEach(function (api) { observer.observe(api.el); });

      // If the device stops being touch-like (e.g. tablet gets a mouse), stop any autoplay.
      if (touchMq.addEventListener) {
        touchMq.addEventListener('change', function () {
          if (!touchMq.matches && current) {
            current.setAutoplay(false);
            current = null;
          }
        });
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
