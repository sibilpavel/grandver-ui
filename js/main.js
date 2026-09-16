/* ==========================================================================
   GrandVer — интерактивность (бургер-меню, панель фильтров)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFilterDrawer();
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
