/* ═══════════════════════════════════════════════════
   PORTFOLIO — MAIN.JS
   Trinadh Durga Ranganadham
   ═══════════════════════════════════════════════════ */

/* ── Cursor ──────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  let tx = 0, ty = 0, cx = 0, cy = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    cursor.style.left = tx + 'px';
    cursor.style.top  = ty + 'px';
  });

  (function animateTrail() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    trail.style.left = cx + 'px';
    trail.style.top  = cy + 'px';
    requestAnimationFrame(animateTrail);
  })();

  document.querySelectorAll('a, button, .project-card, .filter-tab, .t-dot').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      trail.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      trail.classList.remove('cursor--hover');
    });
  });
})();

/* ── Nav Scroll Effect ───────────────────────────── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => menu.classList.remove('open'));
  });
})();

/* ── Counter Animation ───────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat__num[data-target]');
  let done = false;

  function animate() {
    if (done) return;
    done = true;
    nums.forEach(el => {
      const target = +el.dataset.target;
      const dur    = 2000;
      const start  = performance.now();
      (function step(now) {
        const t    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * target);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      })(start);
    });
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animate();
  }, { threshold: 0.5 });
  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) obs.observe(heroStats);
})();

/* ── Reveal on Scroll ────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── Skill Bars ──────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  bars.forEach(bar => {
    const skill = bar.dataset.skill;
    const level = bar.dataset.level;
    bar.innerHTML = `
      <div class="skill-bar-label">
        <span>${skill}</span>
        <span>${level}%</span>
      </div>
      <div class="skill-bar-track">
        <div class="skill-bar-fill" data-level="${level}"></div>
      </div>
    `;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
          setTimeout(() => {
            fill.style.width = fill.dataset.level + '%';
          }, 200);
        });
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(cat => obs.observe(cat));
})();

/* ── Projects ────────────────────────────────────── */
const MY_PROJECTS = [
  {
    _id: '1',
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard built with HTML, CSS, and JavaScript. Integrated with the OpenWeatherMap API to display real-time weather updates, conditions, and forecasts for any city.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
    category: 'frontend',
    emoji: '🌤️',
    liveUrl: 'https://weather-dashboard-seven-self.vercel.app/',
    githubUrl: 'https://github.com/DurgaTrinadh/FSD-LAB-1.git'
  },
  {
    _id: '2',
    title: 'Campus Lost & Found Portal',
    description: 'A web-based portal for reporting and searching lost items on campus. Designed user-friendly pages with photo upload support, email notifications via EmailJS, and local storage persistence.',
    tags: ['HTML', 'CSS', 'JavaScript', 'EmailJS'],
    category: 'frontend',
    emoji: '🔍',
    liveUrl: 'https://dti-lab.vercel.app/',
    githubUrl: 'https://github.com/DurgaTrinadh/DTI-LAB.git'
  },
  {
    _id: '3',
    title: 'Movix Loop',
    description: 'A sleek and responsive movie web app built with ReactJS and powered by the TMDB API. Browse trending movies, search titles, and add your favorites to a personalized watchlist.',
    tags: ['React', 'TMDB API', 'JavaScript', 'CSS'],
    category: 'fullstack',
    emoji: '🎬',
    liveUrl: 'https://movix-loop.vercel.app/',
    githubUrl: 'https://github.com/DurgaTrinadh/Movix-Loop.git'
  }
];

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!projects.length) {
    grid.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;padding:3rem">No projects found.</p>`;
    return;
  }
  grid.innerHTML = projects.map(p => `
    <article class="project-card" data-cat="${p.category}">
      <div class="project-card__thumb">${p.emoji || '💻'}</div>
      <div class="project-card__body">
        <div class="project-card__tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <h3 class="project-card__title">${p.title}</h3>
        <p class="project-card__desc">${p.description}</p>
        <div class="project-card__links">
          ${p.liveUrl && p.liveUrl !== '#' ? `<a href="${p.liveUrl}" target="_blank" class="project-link">Live Demo ↗</a>` : ''}
          <a href="${p.githubUrl}" target="_blank" class="project-link project-link--gh">GitHub ↗</a>
        </div>
      </div>
    </article>
  `).join('');
}

function loadProjects() {
  renderProjects(MY_PROJECTS);
}

function initProjectFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight;
          card.style.animation = '';
        }
      });
    });
  });
}

loadProjects();
setTimeout(initProjectFilter, 100);

/* ── Testimonials ────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "Trinadh is one of the most enthusiastic and hardworking students I have taught. His curiosity for new technologies and dedication to his projects always stands out. He has great potential in software development.",
    name: "Faculty Mentor",
    role: "Pragati Engineering College, CSE Dept.",
    initials: "FM"
  },
  {
    quote: "Working with Trinadh on team projects is always a pleasure. He is collaborative, open to feedback, and genuinely puts effort into making things work. A reliable teammate who keeps pushing the team forward.",
    name: "College Friend & Teammate",
    role: "CSE Batchmate, Pragati Engineering College",
    initials: "CF"
  },
  {
    quote: "Trinadh picks up new tools incredibly fast. Whether it was React, APIs, or new frameworks — he goes from zero to building something real in no time. His passion for learning is genuinely inspiring.",
    name: "Study Group Member",
    role: "Peer, B.Tech CSE",
    initials: "SG"
  }
];

(function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const dots  = document.getElementById('testimonialDots');
  let current = 0;

  track.innerHTML = TESTIMONIALS.map((t, i) => `
    <div class="testimonial-slide ${i === 0 ? 'active' : ''}">
      <p class="testimonial__quote">${t.quote}</p>
      <div class="testimonial__author">
        <div class="testimonial__avatar">${t.initials}</div>
        <div>
          <div class="testimonial__name">${t.name}</div>
          <div class="testimonial__role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');

  dots.innerHTML = TESTIMONIALS.map((_, i) =>
    `<div class="t-dot ${i === 0 ? 'active' : ''}" data-i="${i}"></div>`
  ).join('');

  function goTo(i) {
    document.querySelectorAll('.testimonial-slide')[current].classList.remove('active');
    document.querySelectorAll('.t-dot')[current].classList.remove('active');
    current = i;
    document.querySelectorAll('.testimonial-slide')[current].classList.add('active');
    document.querySelectorAll('.t-dot')[current].classList.add('active');
  }

  dots.querySelectorAll('.t-dot').forEach(d => {
    d.addEventListener('click', () => goTo(+d.dataset.i));
  });

  setInterval(() => goTo((current + 1) % TESTIMONIALS.length), 5000);
})();

/* ── Contact Form ────────────────────────────────── */
(function initContactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const success   = document.getElementById('formSuccess');

  function validate() {
    let ok = true;
    const name    = document.getElementById('name');
    const email   = document.getElementById('email');
    const message = document.getElementById('message');

    [name, email, message].forEach(f => {
      f.classList.remove('error');
      document.getElementById(f.id + 'Error').textContent = '';
    });

    if (!name.value.trim()) {
      name.classList.add('error');
      document.getElementById('nameError').textContent = 'Name is required';
      ok = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.classList.add('error');
      document.getElementById('emailError').textContent = 'Valid email required';
      ok = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      message.classList.add('error');
      document.getElementById('messageError').textContent = 'Message must be at least 10 chars';
      ok = false;
    }
    return ok;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    // Simulate sending (replace with EmailJS or backend integration)
    await new Promise(r => setTimeout(r, 1200));

    form.reset();
    success.classList.add('show');
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
    setTimeout(() => success.classList.remove('show'), 5000);
  });
})();

/* ── Resume Download — handled by native <a download> link ── */

/* ── Active Nav Link ─────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const link = document.querySelector(`.nav__links a[href="#${e.target.id}"]`);
        if (link) link.style.color = 'var(--accent)';
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => obs.observe(s));
})();