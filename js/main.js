/* ==========================================================================
   GrandVer — интерактивность (бургер-меню, панель фильтров)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAccountMenu();
  initLessonPanel();
  initFilterDrawer();
  initScrollDots();
  initCourseTabs();
  initAccordions();
  initReviewStars();
  initProfilePhoto();
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
 * Меню личного кабинета на мобильных (открывается по иконке профиля
 * в шапке или по иконке рядом с заголовком «Мои курсы»): показывает
 * аватар и разделы кабинета вместо прямого перехода на страницу.
 * На десктопе иконка профиля просто ведёт на account.html.
 */
function initAccountMenu() {
  const menu = document.getElementById('accountMenu');
  const trigger = document.getElementById('accountMenuBtn');
  const closeBtn = document.getElementById('closeAccountMenuBtn');
  const accountLink = document.getElementById('accountLink');

  if (!menu) return;

  const open = () => {
    menu.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  trigger?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  accountLink?.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      e.preventDefault();
      open();
    }
  });
}

/**
 * Страница урока (course-lesson.html): на мобильных программа курса
 * и сам урок — два отдельных экрана. Клик по открытому уроку в
 * списке показывает панель урока, крестик возвращает к программе.
 * На десктопе оба блока видны одновременно, переключатель не нужен.
 */
function initLessonPanel() {
  const layout = document.getElementById('lessonLayout');
  const openBtn = document.getElementById('openLessonBtn');
  const closeBtn = document.getElementById('closeLessonBtn');

  if (!layout || !openBtn) return;

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    layout.classList.add('is-lesson-open');
  });

  closeBtn?.addEventListener('click', () => {
    layout.classList.remove('is-lesson-open');
  });
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

/**
 * Профиль: предпросмотр выбранного фото сразу в аватаре.
 */
function initProfilePhoto() {
  const input = document.getElementById('profilePhotoInput');
  const preview = document.getElementById('profilePhotoPreview');

  if (!input || !preview) return;

  input.addEventListener('change', () => {
    const file = input.files && input.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = () => { preview.src = reader.result; };
    reader.readAsDataURL(file);
  });
}