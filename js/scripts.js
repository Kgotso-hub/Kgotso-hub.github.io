// ---------- Dark mode (persisted + respects system preference) ----------
const toggleBtn = document.getElementById('toggleMode');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedMode = localStorage.getItem('theme');

function applyMode(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  if (toggleBtn) toggleBtn.textContent = isDark ? '☀️' : '🌙';
}

applyMode(savedMode ? savedMode === 'dark' : prefersDark);

if (toggleBtn) {
  toggleBtn.addEventListener('click', function () {
    const isDark = !document.body.classList.contains('dark-mode');
    applyMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ---------- Scroll progress bar + sticky header shadow ----------
const progressBar = document.getElementById('scrollProgress');
const header = document.getElementById('siteHeader');
const backToTopBtn = document.getElementById('backToTop');

function onScroll() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + '%';
  if (header) header.classList.toggle('scrolled', scrollTop > 10);
  if (backToTopBtn) backToTopBtn.classList.toggle('visible', scrollTop > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Scrollspy: highlight the current section in the nav ----------
const sections = document.querySelectorAll('main .section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

if ('IntersectionObserver' in window) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => spyObserver.observe(section));
}

// ---------- Reveal-on-scroll animations ----------
if (!('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

// ---------- Typed / rotating role tagline ----------
const roles = [
  'Full-Stack Software Developer',
  'C# / ASP.NET Engineer',
  'React & TypeScript Developer',
  'SQL Server Performance Tuner'
];
const typedEl = document.getElementById('typedRole');

if (typedEl) {
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 35 : 65);
  }
  typeLoop();
}

// ---------- Turn comma-separated skill text into pill badges ----------
document.querySelectorAll('.pill-list').forEach((p) => {
  const items = p.textContent.split(',').map((s) => s.trim()).filter(Boolean);
  p.innerHTML = '';
  items.forEach((item) => {
    const span = document.createElement('span');
    span.className = 'skill-pill';
    span.textContent = item;
    p.appendChild(span);
  });
});

// ---------- Copy email to clipboard ----------
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', function () {
    const text = btn.getAttribute('data-copy');
    navigator.clipboard.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = original; }, 1500);
    });
  });
});
