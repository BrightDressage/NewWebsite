/* COOKIE CONSENT
   Shows a small bar until the visitor chooses. The choice is remembered on their device.
   To switch on Google Analytics later, put the Measurement ID (starts with G-) in GA_ID below.
   Analytics only ever loads after the visitor taps Accept. */
(function () {
  var GA_ID = '';
  var KEY = 'bd-cookie-consent';

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadAnalytics() {
    if (!GA_ID || window.__bdGa) return;
    window.__bdGa = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  var bar;
  function hide() { if (bar) bar.hidden = true; }
  function show() {
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'cookie-bar';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'Cookie choices');
      bar.innerHTML =
        '<p>We use cookies to run the booking calendar and, if you agree, to see how the site is used so we can improve it. <a href="./privacy#cookies">Cookie policy</a></p>' +
        '<div class="cookie-btns">' +
        '<button type="button" data-cookie="declined">Decline</button>' +
        '<button type="button" data-cookie="accepted">Accept</button>' +
        '</div>';
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('[data-cookie]');
        if (!b) return;
        var v = b.getAttribute('data-cookie');
        set(v);
        hide();
        if (v === 'accepted') loadAnalytics();
      });
      document.body.appendChild(bar);
    }
    bar.hidden = false;
  }

  document.addEventListener('click', function (e) {
    var l = e.target.closest('[data-cookie-settings]');
    if (!l) return;
    e.preventDefault();
    show();
  });

  var choice = get();
  if (choice === 'accepted') loadAnalytics();
  else if (choice !== 'declined') show();
})();
