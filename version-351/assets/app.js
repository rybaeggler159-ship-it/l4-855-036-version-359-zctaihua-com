(function () {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function initMobileMenu() {
        var toggle = document.querySelector(".mobile-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", panel.classList.contains("is-open") ? "true" : "false");
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var prev = document.querySelector(".hero-prev");
        var next = document.querySelector(".hero-next");
        if (slides.length < 2) {
            return;
        }
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
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5600);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        var shell = document.querySelector(".hero-shell");
        if (shell) {
            shell.addEventListener("mouseenter", stop);
            shell.addEventListener("mouseleave", start);
        }
        show(0);
        start();
    }

    function initFilters() {
        var blocks = Array.prototype.slice.call(document.querySelectorAll(".catalog-block"));
        blocks.forEach(function (block) {
            var search = block.querySelector(".movie-search");
            var genre = block.querySelector(".filter-genre");
            var year = block.querySelector(".filter-year");
            var region = block.querySelector(".filter-region");
            var cards = Array.prototype.slice.call(block.querySelectorAll(".movie-card, .rank-row"));
            var empty = block.querySelector(".empty-state");
            function text(element, key) {
                return (element.getAttribute("data-" + key) || "").toLowerCase();
            }
            function apply() {
                var q = search ? search.value.trim().toLowerCase() : "";
                var g = genre ? genre.value.trim().toLowerCase() : "";
                var y = year ? year.value.trim().toLowerCase() : "";
                var r = region ? region.value.trim().toLowerCase() : "";
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = ["title", "genre", "region", "tags", "year"].map(function (key) {
                        return text(card, key);
                    }).join(" ");
                    var ok = (!q || haystack.indexOf(q) !== -1) &&
                        (!g || text(card, "genre").indexOf(g) !== -1 || text(card, "tags").indexOf(g) !== -1) &&
                        (!y || text(card, "year") === y) &&
                        (!r || text(card, "region").indexOf(r) !== -1);
                    card.classList.toggle("is-hidden", !ok);
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }
            [search, genre, year, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    window.initMoviePlayer = function (streamUrl) {
        var video = document.getElementById("movie-player");
        var cover = document.querySelector(".player-cover");
        var button = document.querySelector(".play-button");
        if (!video || !streamUrl) {
            return;
        }
        var hlsInstance = null;
        function bind() {
            if (video.getAttribute("data-ready") === "1") {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
            video.setAttribute("data-ready", "1");
        }
        function play() {
            bind();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }
        if (cover) {
            cover.addEventListener("click", play);
        }
        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                play();
            });
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };

    ready(function () {
        initMobileMenu();
        initHero();
        initFilters();
    });
})();
