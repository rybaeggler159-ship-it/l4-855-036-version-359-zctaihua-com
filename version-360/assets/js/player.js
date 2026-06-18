function initMoviePlayer(hlsUrl) {
  const video = document.getElementById('movieVideo');
  const button = document.getElementById('playButton');
  let hls = null;
  let ready = false;

  if (!video || !hlsUrl) {
    return;
  }

  function attach() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
      return;
    }

    video.src = hlsUrl;
  }

  function play() {
    attach();
    if (button) {
      button.classList.add('is-hidden');
    }
    const action = video.play();
    if (action && typeof action.catch === 'function') {
      action.catch(function () {});
    }
  }

  attach();

  if (button) {
    button.addEventListener('click', play);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
