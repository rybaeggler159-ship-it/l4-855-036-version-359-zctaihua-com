(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  const input = document.querySelector('.js-filter-input');
  const category = document.querySelector('.js-filter-category');
  const region = document.querySelector('.js-filter-region');
  const cards = Array.from(document.querySelectorAll('.js-card-list .movie-card'));

  function params() {
    return new URLSearchParams(window.location.search);
  }

  function applyInitialQuery() {
    if (!input) {
      return;
    }
    const q = params().get('q');
    if (q) {
      input.value = q;
    }
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }
    const q = normalize(input ? input.value : '');
    const c = category ? category.value : '';
    const r = region ? region.value : '';

    cards.forEach(function (card) {
      const text = normalize(card.dataset.search || card.textContent);
      const categoryMatch = !c || card.dataset.category === c;
      const regionMatch = !r || (card.dataset.region || '').indexOf(r) !== -1;
      const queryMatch = !q || text.indexOf(q) !== -1;
      card.classList.toggle('is-filter-hidden', !(categoryMatch && regionMatch && queryMatch));
    });
  }

  applyInitialQuery();

  if (input) {
    input.addEventListener('input', filterCards);
  }
  if (category) {
    category.addEventListener('change', filterCards);
  }
  if (region) {
    region.addEventListener('change', filterCards);
  }

  filterCards();
})();
