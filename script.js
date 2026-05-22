/**
 * Cuidado Reproductivo Integral — script.js
 * JavaScript puro: menú, acordeones, galería, formulario,
 * checklist, filtros, animaciones y más.
 */

'use strict';

/* ============================================================
   UTILIDADES
============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. MENÚ HAMBURGUESA
============================================================ */
(function initHamburger() {
  const hamburger = $('#hamburger');
  const navMenu   = $('#nav-menu');
  if (!hamburger || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Cerrar al hacer clic en un enlace
  $$('.nav-link', navMenu).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ============================================================
   2. HEADER SCROLL EFFECT
============================================================ */
(function initHeaderScroll() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ============================================================
   3. ACTIVE NAV LINK (scroll spy)
============================================================ */
(function initScrollSpy() {
  const sections = $$('section[id], div[id]').filter(el =>
    el.tagName === 'SECTION' && el.id
  );
  const navLinks = $$('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = navLinks.find(link =>
          link.getAttribute('href') === `#${entry.target.id}`
        );
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   4. ANIMACIONES AL HACER SCROLL (Intersection Observer)
============================================================ */
(function initFadeAnimations() {
  const elements = $$('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Escalonamiento suave para grupos de elementos
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. ACORDEONES (educación sexual y FAQ)
============================================================ */
(function initAccordions() {
  $$('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.accordion-item');
      const body   = item.querySelector('.accordion-body');
      const isOpen = btn.classList.contains('open');

      // Cerrar todos los del mismo acordeón
      const accordion = btn.closest('.accordion');
      if (accordion) {
        $$('.accordion-btn.open', accordion).forEach(b => {
          b.classList.remove('open');
          b.setAttribute('aria-expanded', 'false');
          b.closest('.accordion-item').querySelector('.accordion-body')
            .classList.remove('open');
        });
      }

      // Abrir el actual si estaba cerrado
      if (!isOpen) {
        btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
      }
    });
  });
})();

/* ============================================================
   6. TARJETAS EXPANDIBLES ("Leer más / Ver más")
============================================================ */
(function initExpandCards() {
  $$('.btn-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;
      const extra = $(`#${targetId}`);
      if (!extra) return;

      const isOpen = extra.classList.contains('open');
      extra.classList.toggle('open', !isOpen);
      btn.classList.toggle('expanded', !isOpen);

      if (isOpen) {
        btn.innerHTML = 'Leer más <i class="fa-solid fa-chevron-down"></i>';
      } else {
        btn.innerHTML = 'Leer menos <i class="fa-solid fa-chevron-down"></i>';
      }
    });
  });
})();

/* ============================================================
   8. FILTRO DE VIDEOS POR CATEGORÍA
============================================================ */
(function initVideoFilter() {
  const filterBtns = $$('.filter-btn');
  const videoCards = $$('.video-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar botones activos
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      videoCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.display = '';
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ============================================================
   9. CHECKLIST INTERACTIVO
============================================================ */
(function initChecklist() {
  const checkboxes = $$('#checklist input[type="checkbox"]');
  const progressFill = $('#checklistProgress');
  const progressMsg  = $('#checklistMsg');
  if (!checkboxes.length) return;

  const total = checkboxes.length;

  function updateProgress() {
    const checked = checkboxes.filter(cb => cb.checked).length;
    const pct = Math.round((checked / total) * 100);

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressMsg) {
      progressMsg.textContent = `${checked} de ${total} hábitos marcados`;
      if (checked === total) {
        progressMsg.textContent = `¡Excelente! Tienes los ${total} hábitos marcados 🌸`;
        progressMsg.style.color = 'var(--menta-dark)';
        progressMsg.style.fontWeight = '700';
      } else {
        progressMsg.style.color = '';
        progressMsg.style.fontWeight = '';
      }
    }
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateProgress);
  });
})();

/* ============================================================
   11. BOTÓN "VOLVER ARRIBA"
============================================================ */
(function initBackToTop() {
  const btn = $('#btnTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.hidden = window.scrollY < 400;
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   12. SCROLL SUAVE PARA TODOS LOS ENLACES INTERNOS
============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    if (!targetId) return;

    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const headerH = $('#header')?.offsetHeight || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();



/* ============================================================
   14. RESALTADO DINÁMICO DE TARJETAS (hover ripple suave)
============================================================ */
(function initCardRipple() {
  $$('.card.card-hover').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
  });
})();

/* ============================================================
   15. ANIMACIÓN DE NÚMEROS / PROGRESO EN CHECKLIST
         (ya manejado en sección checklist)
============================================================ */

/* ============================================================
   16. LAZY LOADING DE SECCIONES (progressive enhancement)
============================================================ */
(function initSectionTracking() {
  // Añadir delay escalonado a tarjetas dentro de grids visibles
  $$('.cards-grid').forEach(grid => {
    $$('.card', grid).forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.06}s`;
    });
  });

  $$('.tips-cards').forEach(grid => {
    $$('.tip-card', grid).forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.06}s`;
    });
  });
})();

/* ============================================================
   17. TECLADO — ACCESIBILIDAD MEJORADA
============================================================ */
(function initKeyboardA11y() {
})();

/* ============================================================
   18. STAGGER ANIMATION PARA TIMELINE
============================================================ */
(function initTimelineAnimation() {
  $$('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.12}s`;
    item.classList.add('fade-in');
  });
})();

/* ============================================================
   19. TOOLTIP SIMPLE PARA BADGES DE TABLA
============================================================ */
(function initTableTooltips() {
  $$('.badge').forEach(badge => {
    badge.setAttribute('tabindex', '0');
    badge.setAttribute('role', 'note');
  });
})();

/* ============================================================
   20. INIT GENERAL — LOG DE BIENVENIDA
============================================================ */
(function init() {
  console.log(
    '%cCuidado Reproductivo Integral\n%cPágina web educativa — JavaScript iniciado correctamente.',
    'color: #b78bd6; font-size: 1.2em; font-weight: bold;',
    'color: #8fd6c8; font-size: 0.9em;'
  );

  // Observador principal de fade-in (re-check por elementos cargados tarde)
  setTimeout(() => {
    const newFades = $$('.fade-in:not(.visible)');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      newFades.forEach(el => obs.observe(el));
    } else {
      newFades.forEach(el => el.classList.add('visible'));
    }
  }, 200);
})();
