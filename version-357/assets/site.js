window.M3U8_SOURCES = [
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e398cb38b257828eeedbcaa0ae2856da/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/77ae15566dde5cfb920bae4712a38399/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/41cb67b47a3668efaea014219666e659/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/31227358d3c181b7168e28ad248cfb4e/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/d0af4221b8947fda8c23f4955947cb58/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e70b98acb53eb889d108057988609efb/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/86ea18f9954dbaf22eff5e16c41b4a25/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/2df81e778442675885257ce3e84c7173/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/af3d3f3b4940cee04efcd8ff2c9eef0a/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/60b4ddb3d166e1239abfc7adf611a6a3/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/a27121d514ff0079e1e81a6678f14e0c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/f0d38b8679a1231eff816a8e04cc1a0c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c66b5309b3b64d15ed856810d6cc0b72/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c99d86ece73a935b77e57d322461ddb5/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fe0c41d994d01211debb24e84e3384a9/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/929fdb8e536c1fc43a83b32d1a838547/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fbc04ae173a0e633458658e80ee78c2a/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/0ba4f146b0e6ea192526706f495d460f/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1e53f0e1aef7ec2fb5f30ef5d309d69c/manifest/video.m3u8",
  "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1116997bf50b78f22bbfaced8975a021/manifest/video.m3u8"
];

function initMobileMenu() {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
  });
}

function initHeroSlider() {
  var hero = document.querySelector('[data-hero]');

  if (!hero) {
    return;
  }

  var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
  var prev = hero.querySelector('[data-hero-prev]');
  var next = hero.querySelector('[data-hero-next]');
  var index = 0;
  var timer = null;

  function show(nextIndex) {
    if (!slides.length) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === index);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  function restart() {
    window.clearInterval(timer);
    timer = window.setInterval(function () {
      show(index + 1);
    }, 5000);
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      show(Number(dot.dataset.heroDot || 0));
      restart();
    });
  });

  if (prev) {
    prev.addEventListener('click', function () {
      show(index - 1);
      restart();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      show(index + 1);
      restart();
    });
  }

  show(0);
  restart();
}

function initFilters() {
  var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

  scopes.forEach(function (scope) {
    var search = scope.querySelector('[data-search-input]') || document.querySelector('[data-search-input]');
    var year = scope.querySelector('[data-filter-year]') || document.querySelector('[data-filter-year]');
    var region = scope.querySelector('[data-filter-region]') || document.querySelector('[data-filter-region]');
    var category = scope.querySelector('[data-filter-category]') || document.querySelector('[data-filter-category]');
    var counter = scope.querySelector('[data-result-count]') || document.querySelector('[data-result-count]');
    var items = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));

    function match(item) {
      var q = search ? search.value.trim().toLowerCase() : '';
      var y = year ? year.value.trim() : '';
      var r = region ? region.value.trim() : '';
      var c = category ? category.value.trim() : '';
      var haystack = [
        item.dataset.title || '',
        item.dataset.year || '',
        item.dataset.region || '',
        item.dataset.genre || '',
        item.dataset.tags || ''
      ].join(' ').toLowerCase();
      var ok = true;

      if (q) {
        ok = ok && haystack.indexOf(q) !== -1;
      }

      if (y) {
        ok = ok && (item.dataset.year || '') === y;
      }

      if (r) {
        ok = ok && (item.dataset.region || '').indexOf(r) !== -1;
      }

      if (c) {
        ok = ok && haystack.indexOf(c.toLowerCase()) !== -1;
      }

      return ok;
    }

    function apply() {
      var visible = 0;

      items.forEach(function (item) {
        var keep = match(item);
        item.classList.toggle('hidden-by-filter', !keep);

        if (keep) {
          visible += 1;
        }
      });

      if (counter) {
        counter.textContent = '当前显示 ' + visible + ' / ' + items.length + ' 部影片';
      }
    }

    [search, year, region, category].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    apply();
  });
}

function initPlayers() {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('[data-video]');
    var playButton = player.querySelector('[data-play-button]');
    var sourceButtons = Array.prototype.slice.call(player.querySelectorAll('[data-source-button]'));
    var note = player.querySelector('[data-player-note]');
    var hlsInstance = null;

    if (!video) {
      return;
    }

    function setNote(message) {
      if (note) {
        note.textContent = message;
      }
    }

    function destroyHls() {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    }

    function loadAndPlay(src) {
      if (!src) {
        setNote('未找到播放地址。');
        return;
      }

      player.classList.add('playing');
      setNote('正在初始化 HLS 播放线路…');

      destroyHls();

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });

        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setNote('播放线路已就绪。');
          video.play().catch(function () {
            setNote('浏览器阻止了自动播放，请再次点击播放器播放。');
          });
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setNote('当前线路加载失败，请尝试备用线路。');
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.addEventListener('loadedmetadata', function onLoaded() {
          video.removeEventListener('loadedmetadata', onLoaded);
          setNote('播放线路已就绪。');
          video.play().catch(function () {
            setNote('浏览器阻止了自动播放，请再次点击播放器播放。');
          });
        });
      } else {
        video.src = src;
        setNote('当前浏览器不支持 HLS.js，也不支持原生 HLS。请使用新版 Chrome、Edge、Safari 或 Firefox。');
      }
    }

    if (playButton) {
      playButton.addEventListener('click', function () {
        loadAndPlay(playButton.dataset.src || video.dataset.src);
      });
    }

    sourceButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        sourceButtons.forEach(function (item) {
          item.classList.remove('active');
        });

        button.classList.add('active');

        if (playButton) {
          playButton.dataset.src = button.dataset.src;
        }

        video.dataset.src = button.dataset.src;
        loadAndPlay(button.dataset.src);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initMobileMenu();
  initHeroSlider();
  initFilters();
  initPlayers();
});
