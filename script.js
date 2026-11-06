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
