(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function runFilter(input) {
    var scopeSelector = input.getAttribute('data-scope');
    var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
    if (!scope) {
      return;
    }

    var query = normalize(input.value);
    var select = document.querySelector('[data-filter-select][data-scope="' + scopeSelector + '"]');
    var region = select ? normalize(select.value) : '';
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.filter-card'));
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre')
      ].join(' '));
      var cardRegion = normalize(card.getAttribute('data-region'));
      var matchedQuery = !query || haystack.indexOf(query) !== -1;
      var matchedRegion = !region || cardRegion.indexOf(region) !== -1;
      var visibleCard = matchedQuery && matchedRegion;
      card.classList.toggle('is-filter-hidden', !visibleCard);
      if (visibleCard) {
        visible += 1;
      }
    });

    var holder = input.closest('.toolbar-card');
    var count = holder ? holder.querySelector('[data-filter-count]') : null;
    if (count) {
      count.textContent = visible + ' 部匹配影片';
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-search-input]')).forEach(function (input) {
    input.addEventListener('input', function () {
      runFilter(input);
    });

    var scopeSelector = input.getAttribute('data-scope');
    var select = document.querySelector('[data-filter-select][data-scope="' + scopeSelector + '"]');
    if (select) {
      select.addEventListener('change', function () {
        runFilter(input);
      });
    }
  });

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q');
  if (query) {
    var firstSearch = document.querySelector('[data-search-input]');
    if (firstSearch) {
      firstSearch.value = query;
      runFilter(firstSearch);
    }
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var active = 0;
    var timer = null;

    function show(index) {
      active = index % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function start() {
      if (slides.length <= 1) {
        return;
      }
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(index);
        start();
      });
    });

    start();
  }
})();
