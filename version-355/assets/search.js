(function() {
  var form = document.querySelector('[data-search-page-form]');
  var input = document.querySelector('[data-search-page-input]');
  var results = document.querySelector('[data-search-results]');
  var title = document.querySelector('[data-search-title]');
  var empty = document.querySelector('[data-search-empty]');
  var params = new URLSearchParams(window.location.search);

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function(ch) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[ch];
    });
  }

  function card(movie) {
    return [
      '<article class="movie-card">',
      '<a href="./' + escapeHtml(movie.file) + '" class="movie-card-link">',
      '<div class="poster">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="poster-shade"></span>',
      '<span class="region-badge">' + escapeHtml(movie.region) + '</span>',
      '<span class="play-symbol">▶</span>',
      '</div>',
      '<div class="movie-card-body">',
      '<h3>' + escapeHtml(movie.title) + '</h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="movie-card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '<div class="movie-card-tags"><span>' + escapeHtml(movie.genre) + '</span></div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function render(query) {
    var q = (query || '').trim().toLowerCase();
    var list = (window.SEARCH_MOVIES || []).filter(function(movie) {
      if (!q) {
        return false;
      }
      var haystack = [movie.title, movie.region, movie.year, movie.type, movie.genre, movie.category, movie.oneLine].concat(movie.tags || []).join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    }).slice(0, 120);

    if (!q) {
      if (title) {
        title.textContent = '热门推荐';
      }
      if (empty) {
        empty.classList.remove('is-visible');
      }
      return;
    }

    if (title) {
      title.textContent = '“' + q + '”的搜索结果';
    }

    if (results) {
      results.innerHTML = list.map(card).join('');
    }

    if (empty) {
      empty.classList.toggle('is-visible', list.length === 0);
    }
  }

  if (input) {
    var initial = params.get('q') || '';
    input.value = initial;
    if (initial) {
      render(initial);
    }

    input.addEventListener('input', function() {
      render(input.value);
    });
  }

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      render(input ? input.value : '');
    });
  }
})();
