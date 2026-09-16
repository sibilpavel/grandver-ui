/* ==========================================================================
   GrandVer — интерактивность (бургер-меню, панель фильтров)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFilterDrawer();
  initScrollDots();
  initCourseTabs();
  initAccordions();
  initReviewStars();
});

/**
 * Мобильное меню (открывается бургером в шапке)
 */
function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('closeMenuBtn');

  if (!burger || !menu) return;

  const open = () => {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  // Закрываем меню при клике по любой ссылке внутри него
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
}

/**
 * Мобильная панель фильтров (страница каталога)
 */
function initFilterDrawer() {
  const trigger = document.getElementById('filterToggleBtn');
  const drawer = document.getElementById('filterDrawer');
  const overlay = document.getElementById('filterOverlay');
  const closeBtn = document.getElementById('closeFilterBtn');

  if (!trigger || !drawer || !overlay) return;

  const open = () => {
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  trigger.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', close);
}

/**
 * Индикатор скролла (точки под каруселями курсов/книг на мобильных).
 * Точка активна в зависимости от того, какая карточка сейчас видна
 * слева в горизонтальном скролле, плюс по точке можно кликнуть,
 * чтобы перейти к соответствующей карточке.
 */
function initScrollDots() {
  document.querySelectorAll('.h-scroll').forEach((scroller) => {
    const dotsWrap = scroller.nextElementSibling;
    if (!dotsWrap || !dotsWrap.classList.contains('dots')) return;

    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
    const items = Array.from(scroller.children);
    if (!dots.length || !items.length) return;

    const setActive = (index) => {
      dots.forEach((dot, i) => dot.classList.toggle('dot--active', i === index));
    };

    // Клик по точке — скроллим к соответствующей карточке.
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const target = items[Math.round((i / (dots.length - 1)) * (items.length - 1))];
        target?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
    });

    let ticking = false;
    const updateActiveDot = () => {
      ticking = false;
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      if (maxScroll <= 0) {
        setActive(0);
        return;
      }
      const progress = scroller.scrollLeft / maxScroll;
      const index = Math.round(progress * (dots.length - 1));
      setActive(Math.min(dots.length - 1, Math.max(0, index)));
    };

    scroller.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveDot);
      }
    }, { passive: true });

    updateActiveDot();
  });
}

/**
 * Табы на странице курса (Описание / Программа курса / Автор / Отзывы / FAQ).
 * Переключение происходит без перезагрузки страницы, каждому табу
 * соответствует панель с тем же data-tab.
 */
function initCourseTabs() {
  const tabs = document.querySelectorAll('.tabs__link');
  const panels = document.querySelectorAll('.tab-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.tab === target));

      tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });
}

/**
 * Аккордеон для модулей курса и FAQ. Клик по заголовку раскрывает/
 * скрывает описание, стрелка поворачивается через CSS-класс is-open.
 */
function initAccordions() {
  document.querySelectorAll('.accordion-item__head').forEach((head) => {
    head.addEventListener('click', () => {
      head.closest('.accordion-item')?.classList.toggle('is-open');
    });
  });
}

/**
 * Интерактивный выбор оценки в форме отзыва — клик по звезде
 * закрашивает её и все предыдущие.
 */
function initReviewStars() {
  document.querySelectorAll('.review-form__stars').forEach((group) => {
    const stars = Array.from(group.querySelectorAll('svg'));

    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        stars.forEach((s, i) => s.classList.toggle('is-filled', i <= index));
      });
    });
  });
}
