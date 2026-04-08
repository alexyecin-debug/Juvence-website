// ============================================
// JUVENCE - Main Script (Super Animated)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Smooth Page Load ----------
  document.body.classList.add('loaded');

  // ---------- Mobile Navigation ----------
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  // ---------- Active Nav Link ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Scroll Reveal System ----------
  // Supports: fade-in, slide-left, slide-right, slide-up, scale-in, stagger-children
  const animatedEls = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .slide-up, .scale-in, .stagger-children');
  if (animatedEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger children animation
          if (entry.target.classList.contains('stagger-children')) {
            const children = entry.target.children;
            Array.from(children).forEach((child, i) => {
              child.style.transitionDelay = `${i * 0.1}s`;
              child.classList.add('visible');
            });
          }
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    animatedEls.forEach(el => observer.observe(el));
  }

  // ---------- Hero Text Reveal ----------
  const heroBrand = document.querySelector('.hero__brand');
  if (heroBrand) {
    // Split letters for animation
    const text = heroBrand.innerHTML;
    // Animate hero elements sequentially
    const heroElements = [
      document.querySelector('.hero__brand'),
      document.querySelector('.hero__tagline'),
      document.querySelector('.hero__desc'),
      document.querySelector('.hero__scroll')
    ].filter(Boolean);

    heroElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 200);
    });
  }

  // ---------- Page Header Reveal ----------
  const pageHeader = document.querySelector('.page-header');
  if (pageHeader) {
    const headerElements = pageHeader.querySelectorAll('.page-header__sub, h1, p');
    headerElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150 + i * 150);
    });
  }

  // ---------- Counter Animation ----------
  const counters = document.querySelectorAll('.metric__value');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateValue(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  function animateValue(el) {
    const text = el.textContent.trim();
    const hasPlus = text.startsWith('+');
    const hasPercent = text.endsWith('%');
    const hasDot = text.includes('.');

    // Extract numeric value
    let numStr = text.replace(/[^0-9.]/g, '');
    const target = parseFloat(numStr);

    if (isNaN(target) || target === 0) return;

    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      let current = target * eased;

      let display;
      if (hasDot) {
        display = current.toFixed(1);
      } else {
        display = Math.round(current).toString();
      }

      if (hasPlus) display = '+' + display;
      if (hasPercent) display = display + '%';

      // Special cases
      if (text === '24/7') {
        el.textContent = '24/7';
        return;
      }

      el.textContent = display;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ---------- Magnetic Buttons ----------
  document.querySelectorAll('.btn, .card, .diff-col, .case-card, .value-card').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = el.classList.contains('btn') ? 0.3 : 0.05;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });

  // ---------- Parallax on Scroll ----------
  const parallaxElements = document.querySelectorAll('.hero, .service-block__visual');
  if (parallaxElements.length) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;

          // Hero parallax
          const hero = document.querySelector('.hero');
          if (hero && scrollY < window.innerHeight) {
            const brand = hero.querySelector('.hero__brand');
            const tagline = hero.querySelector('.hero__tagline');
            const desc = hero.querySelector('.hero__desc');
            if (brand) brand.style.transform = `translateY(${scrollY * 0.15}px)`;
            if (tagline) tagline.style.transform = `translateY(${scrollY * 0.1}px)`;
            if (desc) desc.style.transform = `translateY(${scrollY * 0.05}px)`;

            // Fade out hero on scroll
            const opacity = 1 - (scrollY / (window.innerHeight * 0.7));
            hero.style.opacity = Math.max(0, opacity);
          }

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ---------- Cursor Glow (Desktop only) ----------
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ---------- Tilt Effect on Cards ----------
  document.querySelectorAll('.proof-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });

  // ---------- Smooth Scroll for Anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- Timeline Phase Stagger ----------
  const phases = document.querySelectorAll('.phase');
  if (phases.length) {
    const phaseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate all phases with stagger
          phases.forEach((phase, i) => {
            setTimeout(() => {
              phase.classList.add('phase--visible');
            }, i * 200);
          });
          phaseObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (phases[0]) phaseObserver.observe(phases[0]);
  }

  // ---------- FAQ Accordion ----------
  document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const wasOpen = item.classList.contains('open');

      document.querySelectorAll('.faq__item').forEach(i => i.classList.remove('open'));

      if (!wasOpen) {
        item.classList.add('open');
      }
    });
  });

  // ---------- Contact Form ----------
  const form = document.querySelector('.contact-form');
  if (form && form.getAttribute('action')) {
    // Formspree handles submission — just show feedback
    form.addEventListener('submit', () => {
      const btn = form.querySelector('.btn');
      btn.textContent = 'Envoi...';
      btn.style.background = '#10B981';
    });

    // Focus glow on inputs
    form.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('form-group--focused');
      });
      input.addEventListener('blur', () => {
        input.parentElement.classList.remove('form-group--focused');
      });
    });
  }

  // ---------- Nav Background on Scroll ----------
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    });
  }

  // ---------- Section Label Typewriter ----------
  const sectionLabels = document.querySelectorAll('.section__label');
  if (sectionLabels.length) {
    const labelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;
          el.textContent = '';
          el.style.borderRight = '2px solid var(--blue)';

          let i = 0;
          const interval = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) {
              clearInterval(interval);
              setTimeout(() => { el.style.borderRight = 'none'; }, 600);
            }
          }, 50);

          labelObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    sectionLabels.forEach(el => labelObserver.observe(el));
  }

  // ---------- Comparison Table Row Reveal ----------
  const compRows = document.querySelectorAll('.comparison__row');
  if (compRows.length) {
    const rowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          compRows.forEach((row, i) => {
            setTimeout(() => {
              row.classList.add('comp-row--visible');
            }, i * 100);
          });
          rowObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (compRows[0]) rowObserver.observe(compRows[0]);
  }

  // ---------- Industry Tags Wave ----------
  const industryTags = document.querySelectorAll('.industry-tag');
  if (industryTags.length) {
    const tagObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          industryTags.forEach((tag, i) => {
            setTimeout(() => {
              tag.classList.add('tag--visible');
            }, i * 60);
          });
          tagObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (industryTags[0]) tagObserver.observe(industryTags[0]);
  }

  // ---------- Service Block Visual Pulse ----------
  document.querySelectorAll('.service-block__visual').forEach(visual => {
    const svg = visual.querySelector('svg');
    if (svg) {
      const visObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            svg.classList.add('icon-pulse');
          } else {
            svg.classList.remove('icon-pulse');
          }
        });
      }, { threshold: 0.5 });
      visObserver.observe(visual);
    }
  });
});
