document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  //  Mobile nav toggle
  // ============================================================
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', function () {
    toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ============================================================
  //  Scroll progress bar
  // ============================================================
  var progressBar = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  });

  // ============================================================
  //  Navbar shadow on scroll
  // ============================================================
  var navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ============================================================
  //  Intersection Observer — reveal elements on scroll
  // ============================================================
  var revealElements = document.querySelectorAll(
    '.section, .project-card, .edu-card, .skill-group, .contact-card, .interests, .stat-card, .about-text'
  );

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, idx) {
      if (entry.isIntersecting) {
        // Stagger delay within the same frame
        var siblings = Array.from(entry.target.parentNode.children).filter(function (c) {
          return c.classList.contains('reveal') || c.matches('.project-card, .stat-card, .skill-group, .contact-card');
        });
        var index = siblings.indexOf(entry.target);
        var delay = index >= 0 ? index * 60 : 0;

        setTimeout(function () {
          entry.target.classList.add('visible');
        }, delay);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // ============================================================
  //  Particle system (floating sparkles / energy dots)
  // ============================================================
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var PARTICLE_COUNT = 80;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  resizeCanvas();

  // Color palette for particles
  var colors = [
    'rgba(124,58,237,',   // purple
    'rgba(244,63,94,',    // rose
    'rgba(6,182,212,',    // cyan
    'rgba(168,85,247,',   // light purple
    'rgba(251,113,133,',  // light rose
  ];

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4 - 0.2,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    };
  }

  // Initialize particles
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {
      p.pulse += p.pulseSpeed;
      var currentOpacity = p.opacity + Math.sin(p.pulse) * 0.15;
      currentOpacity = Math.max(0.05, Math.min(0.6, currentOpacity));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + currentOpacity + ')';
      ctx.fill();

      // Occasional glow for larger particles
      if (p.size > 2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (currentOpacity * 0.25) + ')';
        ctx.fill();
      }

      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
    });

    requestAnimationFrame(drawParticles);
  }

  drawParticles();

  // Resize canvas on window resize
  var resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 200);
  });

  // Update canvas height on scroll (for dynamic pages)
  // Debounced to avoid performance issues
  var scrollTimeout;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function () {
      var newHeight = document.documentElement.scrollHeight;
      if (newHeight !== canvas.height) {
        canvas.height = newHeight;
      }
    }, 200);
  });

});
