(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initTopButton() {
    document.querySelectorAll("[data-top-button]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  function initHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    if (!slides.length) return;
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(parseInt(dot.getAttribute("data-hero-dot"), 10) || 0);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
      var search = scope.querySelector(".js-search");
      var region = scope.querySelector(".js-filter-region");
      var year = scope.querySelector(".js-filter-year");
      var type = scope.querySelector(".js-filter-type");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
      var empty = scope.querySelector("[data-no-results]");

      function apply() {
        var q = (search && search.value ? search.value : "").trim().toLowerCase();
        var r = region && region.value ? region.value : "";
        var y = year && year.value ? year.value : "";
        var t = type && type.value ? type.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          var ok = true;
          if (q && haystack.indexOf(q) === -1) ok = false;
          if (r && card.getAttribute("data-region") !== r) ok = false;
          if (y && card.getAttribute("data-year") !== y) ok = false;
          if (t && card.getAttribute("data-type") !== t) ok = false;
          card.classList.toggle("is-hidden", !ok);
          if (ok) visible += 1;
        });

        if (empty) empty.classList.toggle("is-visible", visible === 0);
      }

      [search, region, year, type].forEach(function (input) {
        if (input) input.addEventListener("input", apply);
        if (input) input.addEventListener("change", apply);
      });
    });
  }

  window.initMoviePlayer = function (src) {
    var box = document.querySelector("[data-player]");
    if (!box) return;
    var video = box.querySelector("video");
    var overlay = box.querySelector(".player-overlay");
    var state = box.querySelector(".player-state");
    if (!video || !src) return;
    var attached = false;
    var hls = null;

    function message(text) {
      if (state) state.textContent = text || "";
    }

    function attach() {
      if (attached) return;
      attached = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          message("");
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) message("播放暂时不可用");
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        message("播放暂时不可用");
      }
    }

    function play() {
      attach();
      if (overlay) overlay.classList.add("is-hidden");
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {
          if (overlay) overlay.classList.remove("is-hidden");
        });
      }
    }

    function toggle() {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    }

    if (overlay) overlay.addEventListener("click", play);
    video.addEventListener("click", toggle);
    video.addEventListener("play", function () {
      if (overlay) overlay.classList.add("is-hidden");
    });
    video.addEventListener("pause", function () {
      if (overlay) overlay.classList.remove("is-hidden");
    });
    window.addEventListener("pagehide", function () {
      if (hls) hls.destroy();
    });
    attach();
  };

  ready(function () {
    initMenu();
    initTopButton();
    initHero();
    initFilters();
  });
})();
