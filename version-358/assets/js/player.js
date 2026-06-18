(function () {
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player'));
    players.forEach(function (player) {
      var video = player.querySelector('video');
      var button = player.querySelector('[data-player-button]');
      var status = player.querySelector('[data-player-status]');
      var hlsUrl = player.getAttribute('data-hls');
      var hls = null;
      var initialized = false;

      function setStatus(message) {
        if (status) {
          status.textContent = message;
        }
      }

      function setup() {
        if (initialized || !video || !hlsUrl) {
          return;
        }
        initialized = true;
        video.controls = true;
        setStatus('正在加载视频...');

        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hls.loadSource(hlsUrl);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setStatus('视频已就绪');
            playVideo();
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus('视频加载失败，请刷新后重试');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = hlsUrl;
          video.addEventListener('loadedmetadata', function () {
            setStatus('视频已就绪');
            playVideo();
          }, { once: true });
          video.addEventListener('error', function () {
            setStatus('视频加载失败，请刷新后重试');
          }, { once: true });
        } else {
          setStatus('当前浏览器不支持 HLS 播放');
        }
      }

      function playVideo() {
        if (!video) {
          return;
        }
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            setStatus('点击播放器继续播放');
          });
        }
      }

      function toggle() {
        setup();
        if (!video) {
          return;
        }
        if (video.paused) {
          playVideo();
        } else {
          video.pause();
        }
      }

      if (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          toggle();
        });
      }
      if (video) {
        video.addEventListener('click', toggle);
        video.addEventListener('play', function () {
          player.classList.add('is-playing');
          setStatus('播放中');
        });
        video.addEventListener('pause', function () {
          player.classList.remove('is-playing');
          setStatus('已暂停');
        });
        video.addEventListener('ended', function () {
          player.classList.remove('is-playing');
          setStatus('播放结束');
        });
      }

      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  onReady(initPlayers);
})();
