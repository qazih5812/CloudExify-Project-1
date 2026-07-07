// =========================================================
// QAZI HAMMAD — PORTFOLIO SCRIPT
// Sections: Nav, Theme toggle, Typewriter, Skill bars,
//           Project filter, Contact form, Easter egg
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Mobile nav ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  /* ---------------- Theme toggle (Signature Feature #1) ---------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);
  updateThemeButtonLabel(savedTheme);

  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeButtonLabel(next);
  });

  function updateThemeButtonLabel(theme) {
    themeToggle.textContent = theme === 'dark' ? 'theme --toggle' : 'theme --toggle (light)';
  }

  /* ---------------- Typewriter hero intro (Signature Feature #2) ---------------- */
  const phrases = [
    'AI & Python Developer',
    'Software Engineering Student',
    'CloudExify Intern',
    'Building things with code'
  ];
  const typedEl = document.getElementById('typedRole');
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
      setTimeout(typeLoop, 65);
    } else {
      charIndex--;
      typedEl.textContent = current.substring(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(typeLoop, 300);
        return;
      }
      setTimeout(typeLoop, 35);
    }
  }
  typeLoop();
  // blinking cursor after the typed text
  typedEl.insertAdjacentHTML('afterend', '<span class="cursor-blink" aria-hidden="true"></span>');

  /* ---------------- Skill bars: ASCII fill, animate once on scroll ---------------- */
  const BAR_LENGTH = 24; // number of characters in the ascii bar

  document.querySelectorAll('.skill').forEach(skillEl => {
    const track = skillEl.querySelector('.bar-track');
    const target = parseInt(skillEl.dataset.percent, 10);
    // draw an empty bar immediately so layout doesn't jump
    renderBar(track, 0);
    skillEl._targetPercent = target;
  });

  function renderBar(track, percent) {
    const filled = Math.round((percent / 100) * BAR_LENGTH);
    const empty = BAR_LENGTH - filled;
    track.innerHTML =
      '[<span class="fill-chars">' + '█'.repeat(filled) + '</span>' +
      '░'.repeat(empty) + ']';
  }

  function animateBar(skillEl) {
    const track = skillEl.querySelector('.bar-track');
    const target = skillEl._targetPercent;
    let current = 0;
    const step = Math.max(1, Math.round(target / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      renderBar(track, current);
    }, 20);
  }

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBar(entry.target);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.skill').forEach(el => skillObserver.observe(el));

  /* ---------------- Project filter ---------------- */
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = card.dataset.tags.split(',');
        const show = (filter === 'all' || tags.includes(filter));
        card.hidden = !show;
      });
    });
  });

  /* ---------------- Contact form validation (no backend — Month 2) ---------------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.name;
    const emailInput = form.email;
    const messageInput = form.message;

    const nameField = document.getElementById('nameField');
    const emailField = document.getElementById('emailField');
    const messageField = document.getElementById('messageField');

    const emailOK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim());
    const nameOK = nameInput.value.trim() !== '';
    const messageOK = messageInput.value.trim() !== '';

    nameField.classList.toggle('error', !nameOK);
    emailField.classList.toggle('error', !emailOK);
    messageField.classList.toggle('error', !messageOK);

    if (!nameOK || !emailOK || !messageOK) {
      showStatus('Please fill all fields with a valid email.', 'error');
      return;
    }

    // No backend yet (that's Month 2) — simulate a success state
    showStatus('Thanks, ' + nameInput.value.trim() + '! Your message has been noted.', 'success');
    form.reset();
    [nameField, emailField, messageField].forEach(f => f.classList.remove('error'));
  });

  function showStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form-status show ' + type;
  }

  /* ---------------- Hidden easter egg: Konami code ---------------- */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiProgress = 0;
  const badge = document.getElementById('easterEggBadge');

  document.addEventListener('keydown', (e) => {
    const key = e.key;
    if (key === konami[konamiProgress]) {
      konamiProgress++;
      if (konamiProgress === konami.length) {
        badge.classList.add('show');
        setTimeout(() => badge.classList.remove('show'), 4000);
        konamiProgress = 0;
      }
    } else {
      konamiProgress = (key === konami[0]) ? 1 : 0;
    }
  });

});
