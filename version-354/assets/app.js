(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initializeNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initializeBackToTop() {
    var button = document.querySelector("[data-back-top]");

    if (!button) {
      return;
    }

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initializeHero() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        restart();
      });
    });

    if (slides.length > 1) {
      restart();
    }
  }

  function initializeGlobalSearchForms() {
    var forms = Array.prototype.slice.call(document.querySelectorAll(".global-search-form"));

    forms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        var query = input ? input.value.trim() : "";

        if (!query) {
          event.preventDefault();
          window.location.href = form.getAttribute("action") || "search.html";
        }
      });
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initializePageFilter() {
    var input = document.querySelector(".page-filter");
    var grid = document.querySelector("[data-filter-grid]");

    if (!input || !grid) {
      return;
    }

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    input.addEventListener("input", function () {
      var query = normalize(input.value);

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags")
        ].join(" "));

        card.classList.toggle("is-hidden", query && haystack.indexOf(query) === -1);
      });
    });
  }

  function movieCardTemplate(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="movie-cover" href="' + movie.url + '" aria-label="观看 ' + escapeHtml(movie.title) + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async">',
      '    <span class="play-mask">播放</span>',
      '    <span class="cover-region">' + escapeHtml(movie.region) + '</span>',
      '  </a>',
      '  <div class="movie-info">',
      '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p class="movie-line">' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="movie-meta">',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '      <span>' + escapeHtml(movie.genre) + '</span>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initializeSearchPage() {
    var results = document.getElementById("search-results");
    var count = document.getElementById("search-count");
    var input = document.getElementById("site-search-input");
    var region = document.getElementById("site-search-region");
    var year = document.getElementById("site-search-year");
    var clear = document.getElementById("site-search-clear");

    if (!results || !count || !input || !window.SEARCH_INDEX) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    input.value = initialQuery;

    function runSearch() {
      var query = normalize(input.value);
      var selectedRegion = region ? region.value : "";
      var selectedYear = year ? year.value : "";

      var matched = window.SEARCH_INDEX.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.year,
          movie.type,
          movie.genre,
          movie.tags,
          movie.oneLine
        ].join(" "));

        var queryOk = !query || text.indexOf(query) !== -1;
        var regionOk = !selectedRegion || movie.region === selectedRegion;
        var yearOk = !selectedYear || movie.year === selectedYear;

        return queryOk && regionOk && yearOk;
      });

      count.textContent = "共找到 " + matched.length + " 部影片，当前展示前 " + Math.min(120, matched.length) + " 部。";
      results.innerHTML = matched.slice(0, 120).map(movieCardTemplate).join("");
    }

    input.addEventListener("input", runSearch);

    if (region) {
      region.addEventListener("change", runSearch);
    }

    if (year) {
      year.addEventListener("change", runSearch);
    }

    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        if (region) {
          region.value = "";
        }
        if (year) {
          year.value = "";
        }
        runSearch();
      });
    }

    runSearch();
  }

  function initializePlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".player-shell[data-hls-src]"));

    players.forEach(function (shell) {
      var video = shell.querySelector("video");
      var button = shell.querySelector(".player-start");
      var status = shell.querySelector(".player-status");
      var hls = null;
      var initialized = false;

      if (!video || !button) {
        return;
      }

      function setStatus(message) {
        if (status) {
          status.textContent = message || "";
        }
      }

      function playWhenReady() {
        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            setStatus("请再次点击播放按钮开始播放");
          });
        }
      }

      function initializeSource() {
        var source = shell.getAttribute("data-hls-src");

        if (!source) {
          setStatus("未找到播放源");
          return;
        }

        if (initialized) {
          playWhenReady();
          return;
        }

        initialized = true;
        setStatus("正在加载播放源...");

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.addEventListener("loadedmetadata", function () {
            shell.classList.add("is-ready");
            setStatus("");
            playWhenReady();
          }, { once: true });
          video.addEventListener("error", function () {
            setStatus("视频加载失败，请稍后重试");
          });
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });

          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            shell.classList.add("is-ready");
            setStatus("");
            playWhenReady();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus("视频加载失败，请稍后重试");
              if (hls) {
                hls.destroy();
                hls = null;
              }
            }
          });
          return;
        }

        setStatus("当前浏览器不支持 HLS 播放，请更换浏览器重试");
      }

      button.addEventListener("click", initializeSource);

      video.addEventListener("play", function () {
        shell.classList.add("is-playing");
      });

      video.addEventListener("pause", function () {
        shell.classList.remove("is-playing");
      });

      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    initializeNavigation();
    initializeBackToTop();
    initializeHero();
    initializeGlobalSearchForms();
    initializePageFilter();
    initializeSearchPage();
    initializePlayers();
  });
}());
