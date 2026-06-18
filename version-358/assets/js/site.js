(function () {
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5500);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilterPanels() {
    var containers = Array.prototype.slice.call(document.querySelectorAll('[data-card-container]'));
    containers.forEach(function (container) {
      var cards = Array.prototype.slice.call(container.querySelectorAll('[data-card]'));
      var panel = container.closest('main').querySelector('.filter-panel');
      if (!panel || !cards.length) {
        return;
      }
      var input = panel.querySelector('[data-card-filter]');
      var yearSelect = panel.querySelector('[data-filter-select="year"]');
      var typeSelect = panel.querySelector('[data-filter-select="type"]');
      var empty = container.parentElement.querySelector('[data-empty-state]');

      fillSelect(yearSelect, uniqueValues(cards, 'year').sort().reverse());
      fillSelect(typeSelect, uniqueValues(cards, 'type').sort());

      function applyFilters() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.genre
          ].join(' ').toLowerCase();
          var ok = true;
          if (keyword && haystack.indexOf(keyword) === -1) {
            ok = false;
          }
          if (year && card.dataset.year !== year) {
            ok = false;
          }
          if (type && card.dataset.type !== type) {
            ok = false;
          }
          card.hidden = !ok;
          if (ok) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [input, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilters);
          control.addEventListener('change', applyFilters);
        }
      });
    });
  }

  function uniqueValues(cards, key) {
    var set = new Set();
    cards.forEach(function (card) {
      if (card.dataset[key]) {
        set.add(card.dataset[key]);
      }
    });
    return Array.from(set);
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function initSearchForms() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (input && !input.value.trim()) {
          event.preventDefault();
          input.focus();
        }
      });
    });
  }

  function initSearchPage() {
    var results = document.querySelector('[data-search-results]');
    if (!results || !window.MOVIE_SEARCH_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.querySelector('[data-search-input]');
    var empty = document.querySelector('[data-search-empty]');
    var suggestions = document.querySelector('[data-search-suggestions]');

    if (input) {
      input.value = query;
    }
    if (!query) {
      results.innerHTML = '';
      if (empty) {
        empty.hidden = true;
      }
      return;
    }

    var lower = query.toLowerCase();
    var matches = window.MOVIE_SEARCH_INDEX.filter(function (item) {
      var text = [
        item.title,
        item.region,
        item.type,
        item.year,
        item.genre,
        (item.tags || []).join(' '),
        item.oneLine
      ].join(' ').toLowerCase();
      return text.indexOf(lower) !== -1;
    }).slice(0, 80);

    results.innerHTML = matches.map(function (item) {
      return searchCard(item);
    }).join('');
    if (empty) {
      empty.hidden = matches.length !== 0;
    }
    if (suggestions) {
      suggestions.hidden = matches.length !== 0;
    }
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function searchCard(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span>#' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a href="' + escapeHtml(item.url) + '" class="movie-card-link">' +
      '<div class="poster-frame">' +
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<span class="region-badge">' + escapeHtml(item.region) + '</span>' +
      '<span class="play-hover" aria-hidden="true">▶</span>' +
      '</div>' +
      '<div class="movie-card-body">' +
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      '<p>' + escapeHtml(item.oneLine) + '</p>' +
      '<div class="meta-row"><span>' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.year) + '</span></div>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</a>' +
      '</article>';
  }

  onReady(function () {
    initMenu();
    initHero();
    initFilterPanels();
    initSearchForms();
    initSearchPage();
  });
})();
