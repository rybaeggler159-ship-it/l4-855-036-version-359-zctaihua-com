function initMoviePlayer(sourceUrl) {
  var video = document.getElementById('movie-player');
  var cover = document.getElementById('player-cover');
  var message = document.getElementById('player-message');
  var hls = null;
  var ready = false;
  var requested = false;

  if (!video || !sourceUrl) {
    return;
  }

  function showMessage() {
    if (message) {
      message.hidden = false;
    }
  }

  function hideCover() {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  }

  function playVideo() {
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        if (ready) {
          showMessage();
        }
      });
    }
  }

  function attach() {
    if (ready) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        ready = true;
        if (requested) {
          playVideo();
        }
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            showMessage();
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
      video.addEventListener('loadedmetadata', function () {
        ready = true;
        if (requested) {
          playVideo();
        }
      }, { once: true });
    } else {
      showMessage();
    }
  }

  function start() {
    requested = true;
    hideCover();
    attach();
    playVideo();
  }

  if (cover) {
    cover.addEventListener('click', start);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  video.addEventListener('play', hideCover);
}
