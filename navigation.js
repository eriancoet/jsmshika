(() => {
  const header = document.getElementById('main-header');
  const topbar = header.previousElementSibling;
  const button = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const desktop = matchMedia('(min-width: 1024px)');
  button.setAttribute('aria-controls', 'mobile-menu');
  button.setAttribute('aria-expanded', 'false');
  function setMenu(open) {
    menu.classList.toggle('hidden', !open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    button.querySelector('i').className = open ? 'fa-solid fa-xmark text-2xl' : 'fa-solid fa-bars text-2xl';
  }
  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      button.focus();
    }
  });
  desktop.addEventListener('change', () => setMenu(false));
  function measure() {
    document.documentElement.style.setProperty('--header-height', `${header.firstElementChild.offsetHeight}px`);
    document.documentElement.style.setProperty('--topbar-height', `${topbar.offsetHeight}px`);
  }
  new ResizeObserver(measure).observe(topbar);
  new ResizeObserver(measure).observe(header.firstElementChild);
  measure();
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      setMenu(false);
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      history.pushState(null, '', link.hash);
    });
  });
  const links = [...header.querySelectorAll('nav a')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-20% 0px -55% 0px' });
  links.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
})();
