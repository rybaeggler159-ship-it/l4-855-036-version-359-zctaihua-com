(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var next = document.querySelector("[data-hero-next]");
    var prev = document.querySelector("[data-hero-prev]");
    if (!slides.length) {
      return;
    }

    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    if (next) {
      next.addEventListener("click", function () {
        show(active + 1);
        restart();
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(active - 1);
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    show(0);
    restart();
  }

  function initSearchPanels() {
    var panels = Array.prototype.slice.call(document.querySelectorAll("[data-search-panel]"));
    panels.forEach(function (panel) {
      var input = panel.querySelector("[data-search-input]");
      var region = panel.querySelector("[data-filter-region]");
      var year = panel.querySelector("[data-filter-year]");
      var scope = panel.nextElementSibling || document;
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));

      if (scope && scope.querySelectorAll) {
        var scopedCards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
        if (scopedCards.length) {
          cards = scopedCards;
        }
      }

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function apply() {
        var keyword = normalize(input ? input.value : "");
        var regionValue = normalize(region ? region.value : "");
        var yearValue = normalize(year ? year.value : "");

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre")
          ].join(" "));

          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchRegion = !regionValue || normalize(card.getAttribute("data-region")).indexOf(regionValue) !== -1;
          var matchYear = !yearValue || normalize(card.getAttribute("data-year")).indexOf(yearValue) !== -1;

          card.classList.toggle("is-hidden", !(matchKeyword && matchRegion && matchYear));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }
      if (region) {
        region.addEventListener("change", apply);
      }
      if (year) {
        year.addEventListener("change", apply);
      }
    });
  }

  window.initMoviePlayer = function (streamUrl) {
    var frame = document.querySelector("[data-player]");
    var video = document.querySelector("[data-player-video]");
    var button = document.querySelector("[data-play-button]");

    if (!frame || !video || !streamUrl) {
      return;
    }

    var loaded = false;
    var hls = null;

    function playNative() {
      video.src = streamUrl;
      video.play().catch(function () {});
    }

    function playWithHls() {
      hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
    }

    function start() {
      frame.classList.add("is-playing");
      if (!loaded) {
        loaded = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          playNative();
        } else if (window.Hls && Hls.isSupported()) {
          playWithHls();
        } else {
          playNative();
        }
      } else {
        video.play().catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        start();
      }
    });

    video.addEventListener("play", function () {
      frame.classList.add("is-playing");
    });

    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };

  ready(function () {
    initMenu();
    initHero();
    initSearchPanels();
  });
})();
