document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector('[data-section="navbar"]');
  const updateNav = () => {
    if (!nav) return;
    const scrolled = window.scrollY > 24;
    nav.classList.toggle('h-20', !scrolled);
    nav.classList.toggle('h-15', scrolled);
    nav.classList.toggle('bg-background/0', !scrolled);
    nav.classList.toggle('backdrop-blur-0', !scrolled);
    nav.classList.toggle('bg-background/80', scrolled);
    nav.classList.toggle('backdrop-blur-sm', scrolled);
  };
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const viewport = document.querySelector('[data-testimonials-viewport]');
  if (viewport) {
    const next = document.querySelector('[data-testimonials-next]');
    const prev = document.querySelector('[data-testimonials-prev]');
    const cardWidth = () => viewport.firstElementChild ? viewport.firstElementChild.getBoundingClientRect().width + 16 : viewport.clientWidth;
    const step = (direction = 1) => {
      const amount = cardWidth() * direction;
      const max = viewport.scrollWidth - viewport.clientWidth;
      const target = viewport.scrollLeft + amount;
      const wrapped = direction > 0 && target >= max - 5 ? 0 : direction < 0 && target <= 0 ? max : target;
      viewport.scrollTo({ left: wrapped, behavior: 'smooth' });
    };
    next?.addEventListener('click', () => step(1));
    prev?.addEventListener('click', () => step(-1));
    let auto = window.setInterval(() => step(1), 5000);
    ['mouseenter', 'focusin'].forEach((evt) => viewport.addEventListener(evt, () => window.clearInterval(auto)));
    ['mouseleave', 'focusout'].forEach((evt) => viewport.addEventListener(evt, () => {
      window.clearInterval(auto);
      auto = window.setInterval(() => step(1), 5000);
    }));
  }

  const tabs = Array.from(document.querySelectorAll('[data-faq-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-faq-panel]'));
  const highlight = document.querySelector('[data-faq-highlight]');
  const setActiveTab = (value) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.faqTab === value;
      tab.classList.toggle('text-primary-cta-text', active);
      tab.classList.toggle('text-foreground', !active);
      tab.classList.toggle('hover:text-foreground/80', !active);
      if (active && highlight) {
        highlight.style.width = `${tab.offsetWidth}px`;
        highlight.style.transform = `translateX(${tab.offsetLeft}px)`;
      }
    });
    panels.forEach((panel) => {
      panel.style.display = panel.dataset.faqPanel === value ? 'flex' : 'none';
    });
  };
  if (tabs.length) {
    const defaultTab = tabs[0].dataset.faqTab;
    setActiveTab(defaultTab);
    tabs.forEach((tab) => tab.addEventListener('click', () => setActiveTab(tab.dataset.faqTab)));
  }

  document.querySelectorAll('[data-faq-item]').forEach((item) => {
    const button = item.querySelector('[data-faq-question]');
    const answer = item.querySelector('[data-faq-answer]');
    const icon = item.querySelector('svg');
    const toggle = () => {
      const isOpen = answer.classList.contains('grid-rows-[1fr]');
      const siblings = item.parentElement?.querySelectorAll('[data-faq-item]') || [];
      siblings.forEach((sibling) => {
        const siblingAnswer = sibling.querySelector('[data-faq-answer]');
        const siblingIcon = sibling.querySelector('svg');
        siblingAnswer?.classList.remove('grid-rows-[1fr]', 'pt-4');
        siblingAnswer?.classList.add('grid-rows-[0fr]');
        siblingIcon?.classList.remove('rotate-45');
      });
      if (!isOpen) {
        answer.classList.remove('grid-rows-[0fr]');
        answer.classList.add('grid-rows-[1fr]', 'pt-4');
        icon?.classList.add('rotate-45');
      }
    };
    button?.addEventListener('click', toggle);
  });
});
