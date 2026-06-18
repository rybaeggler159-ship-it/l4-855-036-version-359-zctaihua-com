(function() {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var siteNav = document.querySelector('[data-site-nav]');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function() {
      siteNav.classList.toggle('is-open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');
  if (backTop) {
    backTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function() {
        showSlide(index + 1);
      }, 5000);
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        showSlide(i);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        showSlide(index + 1);
        startTimer();
      });
    }

    startTimer();
  }

  var filterPanel = document.querySelector('[data-filter-panel]');
  if (filterPanel) {
    var search = filterPanel.querySelector('[data-filter-search]');
    var region = filterPanel.querySelector('[data-filter-region]');
    var year = filterPanel.querySelector('[data-filter-year]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));
    var empty = document.querySelector('[data-empty-state]');

    function applyFilters() {
      var term = search ? search.value.trim().toLowerCase() : '';
      var regionValue = region ? region.value : '';
      var yearValue = year ? year.value : '';
      var visible = 0;

      cards.forEach(function(card) {
        var matchesTerm = !term || (card.getAttribute('data-title') || '').indexOf(term) !== -1 || (card.getAttribute('data-genre') || '').toLowerCase().indexOf(term) !== -1;
        var matchesRegion = !regionValue || card.getAttribute('data-region') === regionValue;
        var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var show = matchesTerm && matchesRegion && matchesYear;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [search, region, year].forEach(function(control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  }
})();
