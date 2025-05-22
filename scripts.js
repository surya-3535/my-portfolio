(() => {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function randomColor() {
    const colors = ['#60a5fa', '#f59e42', '#fff', '#3b82f6', '#2563eb'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createParticles(num) {
    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2.5 + 1.5,
        color: randomColor(),
        opacity: Math.random() * 0.7 + 0.3
      });
    }
    return arr;
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = 0.08 + (1 - dist / 120) * 0.12;
          ctx.strokeStyle = particles[i].color;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    }
  }

  function updateParticles() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
  }

  function animate() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animate);
  }

  function setParticles() {
    let num = Math.floor((width * height) / 3500);
    particles = createParticles(num);
  }
  setParticles();
  window.addEventListener('resize', setParticles);

  animate();
})();

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('darkModeToggle');
  const body = document.body;

  // Helper: set mode and persist
  function setMode(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }

  // Initial mode: check localStorage or system preference
  (function () {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setMode(true);
    } else {
      setMode(false);
    }
  })();

  // Toggle on button click
  toggleBtn.addEventListener('click', () => {
    setMode(!body.classList.contains('dark-mode'));
  });

  const form = document.getElementById('contactForm');
  const statusText = document.getElementById('formStatus');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusText.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      statusText.style.color = 'red';
      statusText.textContent = 'Please fill in all fields.';
      return;
    }

    statusText.style.color = '#1f4287';
    statusText.textContent = 'Opening your email client...';

    // Construct mailto link
    const mailtoEmail = 'bandojusuryaprakash3528@gmail.com';
    const subject = encodeURIComponent(`Contact from ${name} via Portfolio`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    // Open user's email client
    window.location.href = `mailto:${mailtoEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      statusText.style.color = '#1f4287';
      statusText.textContent = 'If your email client did not open, please send your message manually to bandojusuryaprakash3528@gmail.com.';
      form.reset();
    }, 1600);
  });

  const faders = document.querySelectorAll('.fade-section');
  const options = { threshold: 0.25 };

  const appearOnScroll = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  faders.forEach(fader => appearOnScroll.observe(fader));
});
