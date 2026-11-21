// Double D's Automotive — mobile menu + contact form
(function () {
  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Contact form (Web3Forms). Without JavaScript the form still posts normally.
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var button = form.querySelector('button[type="submit"]');
    var key = form.querySelector('[name="access_key"]').value;
    if (!key || key.indexOf('YOUR_') === 0) {
      status.className = 'form-status full err';
      status.textContent = 'The form is not connected yet (missing access key).';
      return;
    }
    button.disabled = true;
    button.textContent = 'Sending…';
    status.className = 'form-status full';
    status.textContent = '';

    fetch(form.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form)
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok && d.success, d: d }; }); })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          status.className = 'form-status full ok';
          status.textContent = 'Thanks — your enquiry has been sent. We\'ll get back to you by email.';
        } else {
          throw new Error((res.d && res.d.message) || 'Send failed');
        }
      })
      .catch(function () {
        status.className = 'form-status full err';
        status.textContent = 'Sorry, something went wrong. Please try again or message us on Messenger.';
      })
      .then(function () {
        button.disabled = false;
        button.textContent = 'Send enquiry';
      });
  });
})();

// Jobs we've done — load and play each loop only while it's on screen; count the numbers up once
(function () {
  var grid = document.querySelector('.jobs-grid');
  if (!grid) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var videos = grid.querySelectorAll('video[data-src]');
  var nums = grid.querySelectorAll('[data-count]');
  if (!('IntersectionObserver' in window)) {
    if (!reduce) videos.forEach(function (v) { v.src = v.dataset.src; v.play().catch(function () {}); });
    return;
  }
  if (!reduce) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src) { v.src = v.dataset.src; }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else if (v.src) { v.pause(); }
      });
    }, { rootMargin: '200px 0px' });
    videos.forEach(function (v) { vio.observe(v); });
  }
  if (reduce) return;
  var counted = false;
  var nio = new IntersectionObserver(function (entries) {
    if (counted || !entries.some(function (e) { return e.isIntersecting; })) return;
    counted = true; nio.disconnect();
    var start = null, dur = 1600;
    function tick(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / dur), ease = 1 - Math.pow(1 - k, 3);
      nums.forEach(function (n) { n.textContent = Math.round(+n.dataset.count * ease); });
      if (k < 1) requestAnimationFrame(tick);
    }
    nums.forEach(function (n) { n.textContent = '0'; });
    requestAnimationFrame(tick);
  }, { threshold: 0.25 });
  nio.observe(grid);
})();
