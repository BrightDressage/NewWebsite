// BRIGHT DRESSAGE - Calendly booking
//
// ---------------------------------------------------------------------------
// SETUP - paste Joseph's Calendly links below
// ---------------------------------------------------------------------------
// 1. Build the event types in Calendly (Home > Event types).
// 2. Open an event type, choose "Copy link", and paste it in as the url.
// 3. Any option left with an empty url is simply hidden. If a whole category
//    has no links yet, visitors see an enquiry panel instead of an empty
//    calendar, so the page is never broken while the account is being set up.
//
// Online coaching is not tied to yard hours. In Calendly, give the online
// event types their own availability schedule (Availability > + New schedule)
// with early mornings and evenings opened up, so riders in other time zones
// can self-book. Calendly shows every visitor times in their own zone.
// Anything outside that schedule still routes through the "Request Another
// Time" button, which drops the visitor into the contact form with their
// time zone already filled in.
// ---------------------------------------------------------------------------

(function () {
  'use strict';

  var BOOKING_CONFIG = {
    yard: {
      options: [
        { name: 'Private Lesson', detail: '45 minutes at Cork Farm, £55', url: 'https://calendly.com/dressagewithjoe/45min' }
      ]
    },
    online: {
      options: [
        { name: '1:1 Online Coaching', detail: '1 hour via video call, £55', url: 'https://calendly.com/dressagewithjoe/1-1-online-coaching' }
      ]
    }
  };

  // Colours passed to Calendly so the embed matches the site palette.
  var BRAND_PARAMS = {
    hide_gdpr_banner: '1',
    background_color: 'ffffff',
    text_color: '0a0a0a',
    primary_color: 'c9a96e'
  };

  var CALENDLY_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';

  var section = document.getElementById('booking');
  if (!section) return;

  var panel = document.getElementById('booking-panel');
  var optionsEl = section.querySelector('[data-booking-options]');
  var stageEl = section.querySelector('[data-booking-stage]');
  var tabs = Array.prototype.slice.call(section.querySelectorAll('[data-booking-tab]'));
  var infoCards = Array.prototype.slice.call(section.querySelectorAll('[data-booking-info]'));
  if (!optionsEl || !stageEl || !tabs.length) return;

  var chosen = { yard: 0, online: 0 };
  var mountToken = 0;
  var calendlyPromise = null;

  // Only the options that actually have a link pasted in.
  function liveOptions(key) {
    var group = BOOKING_CONFIG[key];
    if (!group || !group.options) return [];
    return group.options.filter(function (opt) {
      return typeof opt.url === 'string' && opt.url.trim() !== '';
    });
  }

  function brandedUrl(raw) {
    var url;
    try {
      url = new URL(raw.trim());
    } catch (err) {
      return null;
    }
    Object.keys(BRAND_PARAMS).forEach(function (key) {
      if (!url.searchParams.has(key)) url.searchParams.set(key, BRAND_PARAMS[key]);
    });
    return url.toString();
  }

  function loadCalendly() {
    if (window.Calendly) return Promise.resolve();
    if (calendlyPromise) return calendlyPromise;
    calendlyPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.onload = function () {
        if (window.Calendly) resolve();
        else reject(new Error('Calendly unavailable'));
      };
      script.onerror = function () {
        calendlyPromise = null;
        reject(new Error('Calendly failed to load'));
      };
      document.head.appendChild(script);
    });
    return calendlyPromise;
  }

  function enquiryLink(label) {
    var link = document.createElement('a');
    link.className = 'btn-outline-dark';
    link.href = '#contact';
    link.textContent = label;
    return link;
  }

  function showNotice(title, body, action) {
    stageEl.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'booking-notice';
    var heading = document.createElement('p');
    heading.className = 'booking-notice-title';
    heading.textContent = title;
    var text = document.createElement('p');
    text.textContent = body;
    wrap.appendChild(heading);
    wrap.appendChild(text);
    if (action) wrap.appendChild(action);
    stageEl.appendChild(wrap);
  }

  function showSkeleton() {
    stageEl.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'booking-skeleton';
    wrap.setAttribute('aria-hidden', 'true');
    var bar = document.createElement('span');
    bar.className = 'booking-skeleton-bar';
    wrap.appendChild(bar);
    var grid = document.createElement('div');
    grid.className = 'booking-skeleton-grid';
    for (var i = 0; i < 28; i++) grid.appendChild(document.createElement('span'));
    wrap.appendChild(grid);
    stageEl.appendChild(wrap);

    var status = document.createElement('p');
    status.className = 'booking-sr';
    status.setAttribute('role', 'status');
    status.textContent = 'Loading availability';
    stageEl.appendChild(status);
  }

  function mount(option) {
    var url = brandedUrl(option.url);
    var token = ++mountToken;

    if (!url) {
      showNotice(
        'That booking link needs checking',
        'The Calendly link for "' + option.name + '" does not look like a valid web address.',
        enquiryLink('Send an Enquiry')
      );
      return;
    }

    showSkeleton();
    loadCalendly().then(function () {
      if (token !== mountToken) return;
      stageEl.innerHTML = '';
      var host = document.createElement('div');
      host.className = 'booking-embed';
      stageEl.appendChild(host);
      window.Calendly.initInlineWidget({ url: url, parentElement: host });
    }).catch(function () {
      if (token !== mountToken) return;
      var direct = document.createElement('a');
      direct.className = 'btn-outline-dark';
      direct.href = option.url;
      direct.target = '_blank';
      direct.rel = 'noopener';
      direct.textContent = 'Open the calendar in a new tab';
      showNotice(
        'The calendar could not load',
        'Calendly may be blocked by your connection or a privacy extension. You can open it directly, or send an enquiry and Joseph will confirm a time by reply.',
        direct
      );
    });
  }

  function render(key) {
    if (!BOOKING_CONFIG[key]) return;

    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-booking-tab') === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
      if (active && panel) panel.setAttribute('aria-labelledby', tab.id);
    });

    infoCards.forEach(function (card) {
      card.hidden = card.getAttribute('data-booking-info') !== key;
    });

    var options = liveOptions(key);

    if (!options.length) {
      optionsEl.hidden = true;
      optionsEl.innerHTML = '';
      showNotice(
        'Live booking opens shortly',
        "Joseph's online calendar is being set up. Until it goes live, send an enquiry with the times that suit you and he'll come straight back to confirm.",
        enquiryLink('Send an Enquiry')
      );
      return;
    }

    var index = Math.min(chosen[key] || 0, options.length - 1);
    chosen[key] = index;

    optionsEl.innerHTML = '';
    optionsEl.hidden = options.length < 2;
    if (options.length > 1) {
      options.forEach(function (option, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'booking-option' + (i === index ? ' is-active' : '');
        btn.setAttribute('aria-pressed', i === index ? 'true' : 'false');
        var name = document.createElement('span');
        name.className = 'booking-option-name';
        name.textContent = option.name;
        btn.appendChild(name);
        if (option.detail) {
          var detail = document.createElement('span');
          detail.className = 'booking-option-detail';
          detail.textContent = option.detail;
          btn.appendChild(detail);
        }
        btn.addEventListener('click', function () {
          if (chosen[key] === i) return;
          chosen[key] = i;
          render(key);
        });
        optionsEl.appendChild(btn);
      });
    }

    mount(options[index]);
  }

  // Hands the visitor to the contact form with their time zone already filled
  // in, for sessions outside the hours published in the calendar.
  function requestAnotherTime(mode) {
    var contactForm = document.querySelector('.contact-form form');
    var contact = document.getElementById('contact');
    if (!contactForm || !contact) return;

    var service = contactForm.querySelector('select[name="service"]');
    var message = contactForm.querySelector('textarea[name="message"]');
    var wanted = mode === 'online' ? 'Online Coaching (Worldwide)' : 'Private Lessons (UK)';

    if (service) {
      Array.prototype.slice.call(service.options).forEach(function (opt) {
        if (opt.text.trim() === wanted) service.value = opt.value;
      });
    }

    if (message && !message.value.trim()) {
      var zone = '';
      try {
        zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      } catch (err) {
        zone = '';
      }
      message.value = mode === 'online'
        ? 'I would like an online session outside the times shown in the calendar.\n\n'
          + 'My time zone: ' + zone + '\n'
          + 'Days and times that suit me: \n'
          + 'Horse and current level: '
        : 'I would like a yard session outside the times shown in the calendar.\n\n'
          + 'Days and times that suit me: \n'
          + 'Travelling from: \n'
          + 'Horse and current level: ';
    }

    contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(function () {
      if (message) message.focus({ preventScroll: true });
    }, 700);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      render(tab.getAttribute('data-booking-tab'));
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var step = e.key === 'ArrowRight' ? 1 : tabs.length - 1;
      var next = tabs[(i + step) % tabs.length];
      next.focus();
      render(next.getAttribute('data-booking-tab'));
    });
  });

  section.querySelectorAll('[data-request-time]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      requestAnotherTime(btn.getAttribute('data-request-time'));
    });
  });

  // Links elsewhere on the page can open a specific tab, e.g. the online
  // coaching call to action.
  document.querySelectorAll('[data-booking-open]').forEach(function (el) {
    el.addEventListener('click', function () {
      render(el.getAttribute('data-booking-open'));
    });
  });

  render('yard');
})();
