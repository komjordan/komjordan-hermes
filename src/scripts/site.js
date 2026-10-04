const init = () => {
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const dialog = document.querySelector('.command-palette');
  const searchButton = document.querySelector('.search-trigger');
  const closeButton = document.querySelector('.palette-close');
  const searchInput = document.querySelector('#command-search');
  const progress = document.querySelector('#scroll-progress');

  const updateThemeLabel = () => {
    if (!(themeButton instanceof HTMLButtonElement)) return;
    const next = root.dataset.theme === 'dark' ? 'clair' : 'sombre';
    themeButton.setAttribute('aria-label', `Passer au thème ${next}`);
  };

  updateThemeLabel();
  themeButton?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('theme', next);
    updateThemeLabel();
  });

  menuButton?.addEventListener('click', () => {
    if (!(menuButton instanceof HTMLButtonElement) || !(mobileNav instanceof HTMLElement)) return;
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    menuButton.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
    mobileNav.hidden = open;
  });

  const visibleResults = () => dialog ? [...dialog.querySelectorAll('.palette-results a:not([hidden])')] : [];
  let activeIndex = 0;
  const setActive = (index) => {
    const items = visibleResults();
    items.forEach((item) => item.classList.remove('is-active'));
    if (!items.length) return;
    activeIndex = (index + items.length) % items.length;
    items[activeIndex].classList.add('is-active');
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  };
  const openPalette = () => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    dialog.showModal();
    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = '';
      searchInput.dispatchEvent(new Event('input'));
      searchInput.focus();
    }
    setActive(0);
  };
  const closePalette = () => {
    if (dialog instanceof HTMLDialogElement) dialog.close();
  };

  searchButton?.addEventListener('click', openPalette);
  closeButton?.addEventListener('click', closePalette);
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closePalette();
  });
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openPalette();
    }
    if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(activeIndex + 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive(activeIndex - 1); }
    if (event.key === 'Enter') {
      const item = visibleResults()[activeIndex];
      if (item instanceof HTMLAnchorElement) item.click();
    }
  });
  searchInput?.addEventListener('input', () => {
    if (!(searchInput instanceof HTMLInputElement) || !dialog) return;
    const query = searchInput.value.trim().toLowerCase();
    const items = [...dialog.querySelectorAll('.palette-results a')];
    items.forEach((item) => {
      if (!(item instanceof HTMLElement)) return;
      item.hidden = !(item.dataset.search || '').includes(query);
    });
    const empty = dialog.querySelector('.palette-empty');
    if (empty instanceof HTMLElement) empty.hidden = visibleResults().length > 0;
    setActive(0);
  });

  const updateProgress = () => {
    if (!(progress instanceof HTMLElement)) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    const amount = max > 0 ? Math.min(scrollY / max, 1) : 0;
    progress.style.transform = `scaleX(${amount})`;
  };
  updateProgress();
  addEventListener('scroll', updateProgress, { passive: true });

  const filterButtons = document.querySelectorAll('.filter-button');
  const projectRows = document.querySelectorAll('[data-project]');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    if (!(button instanceof HTMLButtonElement)) return;
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    projectRows.forEach((row) => {
      if (!(row instanceof HTMLElement)) return;
      row.hidden = filter !== 'Tous' && row.dataset.category !== filter;
    });
  }));

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  }
};

document.addEventListener('astro:page-load', init);
