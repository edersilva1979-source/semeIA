const menuButton = document.querySelector('.menu_button');
const navLinks = document.querySelector('.nav_links');

if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 900;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.45 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

document.querySelectorAll('.faq_button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq_item');
    const wasOpen = item.classList.contains('open');

    document.querySelectorAll('.faq_item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq_button')?.setAttribute('aria-expanded', 'false');
    });

    if (!wasOpen) {
      item.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

function attachDemoForm(formId, successId) {
  const form = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form || !success) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    success.classList.add('show');
    success.setAttribute('tabindex', '-1');
    success.focus();
    form.reset();

    window.setTimeout(() => {
      success.classList.remove('show');
    }, 7000);
  });
}

attachDemoForm('contactForm', 'contactSuccess');
attachDemoForm('interestForm', 'interestSuccess');

const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
document.querySelectorAll('.nav_links a[data-page]').forEach(link => {
  if (link.dataset.page === currentPage) link.classList.add('active');
});
