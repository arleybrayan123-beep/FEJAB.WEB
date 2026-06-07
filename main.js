// ============================================
// FEJAB — JavaScript principal (main.js)
// Animaciones, slider, contador, navbar
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ========== NAVBAR: scroll effect ==========
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 60);
    const backBtn = document.getElementById('backToTop');
    if (backBtn) backBtn.classList.toggle('visible', window.scrollY > 400);
  });

  // ========== HAMBURGUESA ==========
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu?.classList.toggle('open');
  });
  // Cerrar al hacer clic en link
  navMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  // ========== BÚSQUEDA ==========
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  searchBtn?.addEventListener('click', () => {
    searchBar?.classList.toggle('open');
    if (searchBar?.classList.contains('open')) searchInput?.focus();
  });
  searchClose?.addEventListener('click', () => searchBar?.classList.remove('open'));

  // ========== HERO SLIDER ==========
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let sliderTimer = null;

  function goToSlide(index) {
    slides[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  function startAutoplay() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });
  document.getElementById('sliderPrev')?.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    startAutoplay();
  });
  document.getElementById('sliderNext')?.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    startAutoplay();
  });

  if (slides.length > 0) {
    startAutoplay();

    // Pausa al hover
    const heroSection = document.querySelector('.hero');
    heroSection?.addEventListener('mouseenter', () => clearInterval(sliderTimer));
    heroSection?.addEventListener('mouseleave', startAutoplay);

    // Soporte táctil
    let touchStartX = 0;
    heroSection?.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX, { passive: true });
    heroSection?.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      startAutoplay();
    });
  }

  // ========== ANIMACIONES DE SCROLL (IntersectionObserver) ==========
  const animateEls = document.querySelectorAll(
    '.animate-fade-up, .animate-from-left, .animate-from-right, .animate-fade-scale'
  );

  const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Aplica delay si está definido
        const delay = entry.target.style.animationDelay || '0s';
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseFloat(delay) * 1000);
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  animateEls.forEach(el => scrollObserver.observe(el));

  // ========== CONTADOR (count-up) ==========
  const countEls = document.querySelectorAll('.count-number');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCount(entry.target, 0, target, 1800);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));

  function animateCount(el, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out-cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(start + range * eased);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = end;
    }
    requestAnimationFrame(update);
  }

  // ========== BOTÓN VOLVER ARRIBA ==========
  document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========== HIGHLIGHT ACTIVO EN NAV SCROLL ==========
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        activeLink?.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(section => sectionObserver.observe(section));

}); // end DOMContentLoaded


// ========== AUTH FORMS ==========
// Login
const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = loginForm.querySelector('.auth-btn');
  const alertEl = document.getElementById('loginAlert');

  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;

  if (!email || !password) {
    showAlert(alertEl, 'error', 'Por favor completa todos los campos.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Iniciando sesión...';

  try {
    // Demo sin Supabase: simulación
    await new Promise(r => setTimeout(r, 1200));

    if (email === 'demo@fejab.org' && password === 'fejab2025') {
      // Guardar sesión demo
      sessionStorage.setItem('fejab_user', JSON.stringify({
        name: 'Usuario Demo',
        email: email,
        club: 'Club FEJAB',
        role: 'miembro'
      }));
      showAlert(alertEl, 'success', '¡Bienvenido! Redirigiendo al dashboard...');
      setTimeout(() => window.location.href = 'dashboard.html', 1200);
    } else {
      showAlert(alertEl, 'error', 'Credenciales incorrectas. Usa demo@fejab.org / fejab2025');
    }
  } catch (err) {
    showAlert(alertEl, 'error', 'Error al iniciar sesión. Intenta de nuevo.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Iniciar sesión';
  }
});

// Registro
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = registerForm.querySelector('.auth-btn');
  const alertEl = document.getElementById('registerAlert');

  const nombre = document.getElementById('regNombre')?.value;
  const email = document.getElementById('regEmail')?.value;
  const club = document.getElementById('regClub')?.value;
  const password = document.getElementById('regPassword')?.value;
  const confirm = document.getElementById('regConfirm')?.value;

  if (!nombre || !email || !password || !confirm) {
    showAlert(alertEl, 'error', 'Por favor completa todos los campos obligatorios.');
    return;
  }
  if (password !== confirm) {
    showAlert(alertEl, 'error', 'Las contraseñas no coinciden.');
    return;
  }
  if (password.length < 6) {
    showAlert(alertEl, 'error', 'La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Creando cuenta...';

  try {
    await new Promise(r => setTimeout(r, 1500));
    showAlert(alertEl, 'success', '¡Cuenta creada! Revisa tu email para confirmar. (Demo: no se envía email real)');
    setTimeout(() => window.location.href = 'login.html', 2500);
  } catch (err) {
    showAlert(alertEl, 'error', 'Error al crear cuenta. Intenta de nuevo.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Crear cuenta';
  }
});

// Dashboard: verificar sesión y cargar datos
const dashboardEl = document.querySelector('.dashboard-page');
if (dashboardEl) {
  const user = JSON.parse(sessionStorage.getItem('fejab_user') || 'null');
  if (!user) {
    window.location.href = 'login.html';
  } else {
    // Llenar datos del usuario
    const nameEls = document.querySelectorAll('[data-user-name]');
    nameEls.forEach(el => el.textContent = user.name);
    const emailEls = document.querySelectorAll('[data-user-email]');
    emailEls.forEach(el => el.textContent = user.email);
    const clubEls = document.querySelectorAll('[data-user-club]');
    clubEls.forEach(el => el.textContent = user.club || 'Sin club asignado');
    const roleEls = document.querySelectorAll('[data-user-role]');
    roleEls.forEach(el => el.textContent = user.role || 'miembro');
  }

  // Logout
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sessionStorage.removeItem('fejab_user');
      window.location.href = 'index.html';
    });
  });
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', () => {
    const inputId = btn.dataset.target;
    const input = document.getElementById(inputId);
    if (input) {
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.classList.toggle('fa-eye', isText);
      btn.classList.toggle('fa-eye-slash', !isText);
    }
  });
});

// Función auxiliar: mostrar alerta
function showAlert(el, type, message) {
  if (!el) return;
  el.className = `alert alert-${type} show`;
  el.innerHTML = `<i class="fa fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
}
