/* ==========================================================================
   GrandVer — интерактивность (бургер-меню, панель фильтров)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFilterDrawer();
  initScrollDots();
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
