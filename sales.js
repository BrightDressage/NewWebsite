/* Horses for sale: builds the listing page and each horse page from horses.js */
(function () {
  var H = window.BD_HORSES || [];
  var WA = '447771365693';
  var STATUS = { 'available': 'For Sale', 'under-offer': 'Under Offer', 'sold': 'Sold' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function age(h) { return h.born ? (new Date().getFullYear() - h.born) + ' years' : ''; }
  function meta(h) { return [age(h), h.sex, h.height, h.colour].filter(Boolean).join(' · '); }
  function breeding(h) { var b = h.breeding || {}; return b.sire ? esc(b.sire) + (b.damSire ? ' x ' + esc(b.damSire) : '') : ''; }
  function price(h) { return h.status === 'sold' ? 'Sold' : (h.price === 'POA' || !h.price ? 'Price on application' : esc(h.price)); }
  function badge(h) { return '<span class="horse-badge is-' + esc(h.status) + '">' + (STATUS[h.status] || 'For Sale') + '</span>'; }

  // No right-click or drag on photos
  document.addEventListener('contextmenu', function (e) { if (e.target.closest('img, .gallery-main, video')) e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { if (e.target.closest('img')) e.preventDefault(); });

  /* LISTING */
  var grid = document.getElementById('horse-grid');
  if (grid) {
    var filter = 'available';
    function render() {
      var list = H.filter(function (h) { return filter === 'all' || (filter === 'sold' ? h.status === 'sold' : h.status !== 'sold'); });
      if (!list.length) {
        grid.innerHTML = '';
        document.getElementById('sales-empty').hidden = false;
        return;
      }
      document.getElementById('sales-empty').hidden = true;
      grid.innerHTML = list.map(function (h) {
        var p = (h.photos || [])[0] || {};
        return '<a class="horse-card is-' + esc(h.status) + '" href="/sales/' + esc(h.slug) + '">' +
          '<div class="horse-card-img">' + (p.src ? '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || h.name) + '" loading="lazy">' : '') + badge(h) +
          (h.video ? '<span class="horse-badge has-video">&#9654; Video</span>' : '') + '</div>' +
          '<div class="horse-card-body"><h3>' + esc(h.name) + '</h3>' +
          '<p class="horse-card-meta">' + esc(meta(h)) + '</p>' +
          (breeding(h) ? '<p class="horse-card-breeding">' + breeding(h) + '</p>' : '') +
          '<div class="horse-card-foot"><span class="horse-card-price">' + price(h) + '</span><span class="horse-card-link">View &rarr;</span></div></div></a>';
      }).join('');
    }
    document.querySelectorAll('.sales-filter button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.sales-filter button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
        filter = b.getAttribute('data-filter'); render();
      });
    });
    render();
  }

  /* HORSE PAGE */
  var page = document.getElementById('horse');
  if (page) {
    var slug = (new URLSearchParams(location.search).get('h')) || location.pathname.replace(/\/+$/, '').split('/').pop().replace(/\.html$/, '');
    var h = H.filter(function (x) { return x.slug === slug; })[0];
    if (!h) { location.replace('/sales'); return; }
    document.title = h.name + ' | Horses for Sale | Bright Dressage';
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', h.name + ': ' + meta(h) + '. ' + (h.headline || '') + ' For sale through Bright Dressage, Kent.');
    var photos = h.photos || [], i = 0;
    var b = h.breeding || {};
    var waText = encodeURIComponent('Hi Joe, I\'m interested in ' + h.name + ' (' + location.origin + '/sales/' + h.slug + ').');
    var facts = [['Age', h.born ? age(h) + ' (' + h.born + ')' : ''], ['Sex', h.sex], ['Height', h.height], ['Colour', h.colour], ['Studbook', h.studbook], ['Level', h.level], ['Location', h.location]]
      .filter(function (f) { return f[1]; })
      .map(function (f) { return '<li><span>' + f[0] + '</span><b>' + esc(f[1]) + '</b></li>'; }).join('');
    var video = '';
    if (h.video) {
      var v = h.video;
      if (v.youtube) video = '<iframe src="https://www.youtube-nocookie.com/embed/' + esc(v.youtube) + '?rel=0" title="Video of ' + esc(h.name) + '" allow="fullscreen; picture-in-picture" loading="lazy"></iframe>';
      else if (v.vimeo) video = '<iframe src="https://player.vimeo.com/video/' + esc(v.vimeo) + '?dnt=1" title="Video of ' + esc(h.name) + '" allow="fullscreen; picture-in-picture" loading="lazy"></iframe>';
      else if (v.file) video = '<video src="' + esc(v.file) + '" controls playsinline preload="metadata" controlslist="nodownload"></video>';
    }
    var pageUrl = 'https://brightdressage.com/sales/' + h.slug;
    var ICON = {
      wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 012.89 6.99c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 00-3.48-8.41z"/></svg>',
      fb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07"/></svg>',
      x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z"/></svg>',
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 5h20v14H2zm2 2v.5l8 5 8-5V7zm0 2.86V17h16V9.86l-8 5z"/></svg>'
    };
    var others = H.filter(function (x) { return x.slug !== h.slug && x.status !== 'sold'; }).slice(0, 3);

    page.innerHTML =
      '<div class="container"><p class="horse-crumb"><a href="/">Home</a> / <a href="/sales">Horses for Sale</a> / ' + esc(h.name) + '</p>' +
      '<div class="horse-top"><div class="horse-gallery">' +
        '<div class="gallery-main" role="button" tabindex="0" aria-label="Enlarge photo"><img id="g-main" alt=""><span class="gallery-count" id="g-count"></span></div>' +
        (photos.length > 1 ? '<div class="gallery-thumbs">' + photos.map(function (p, n) { return '<button type="button" data-i="' + n + '" aria-label="Photo ' + (n + 1) + '"><img src="' + esc(p.src) + '" alt="" loading="lazy"></button>'; }).join('') + '</div>' : '') +
      '</div>' +
      '<aside class="horse-panel">' + badge(h) + '<h1>' + esc(h.name) + '</h1>' +
        (h.headline ? '<p class="horse-headline">' + esc(h.headline) + '</p>' : '') +
        '<div class="horse-price"><strong>' + price(h) + '</strong>' + (h.priceNote && h.status !== 'sold' ? '<span>' + esc(h.priceNote) + '</span>' : '') + '</div>' +
        '<ul class="horse-facts">' + facts + '</ul>' +
        '<div class="share-box"><span class="share-label">Share this horse</span><div class="share-icons">' +
          '<a class="share-ico" data-share="whatsapp" href="https://wa.me/?text=' + encodeURIComponent(h.name + ' for sale: ' + pageUrl) + '" target="_blank" rel="noopener" aria-label="Share on WhatsApp">' + ICON.wa + '</a>' +
          '<a class="share-ico" data-share="facebook" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '" target="_blank" rel="noopener" aria-label="Share on Facebook">' + ICON.fb + '</a>' +
          '<a class="share-ico" data-share="x" href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(h.name + ' for sale') + '" target="_blank" rel="noopener" aria-label="Share on X">' + ICON.x + '</a>' +
          '<a class="share-ico" data-share="email" href="mailto:?subject=' + encodeURIComponent(h.name + ' for sale') + '&body=' + encodeURIComponent('Have a look at ' + h.name + ': ' + pageUrl) + '" aria-label="Share by email">' + ICON.mail + '</a>' +
        '</div>' +
        '<div class="share-url"><input type="text" readonly value="' + esc(pageUrl) + '" aria-label="Link to this horse"><button type="button" id="share-copy">Copy</button></div>' +
        '</div>' +
        '</aside>' +
      '<div class="horse-about-text"><h2>About</h2>' +
        (h.description || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      '</div>' +
      (h.highlights && h.highlights.length ? '<div class="horse-highlights"><h3>Highlights</h3><ul class="horse-list">' + h.highlights.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' : '') +
      '</div></div>' +

      (video ? '<section class="horse-section alt" id="video"><div class="container"><span class="section-label">Video</span><h2>See ' + esc(h.name) + ' working</h2><div class="horse-video">' + video + '</div></div></section>' : '') +

      '<section class="horse-section horse-info"><div class="container">' +
      (b.sire ? '<div class="horse-breeding"><h3>Breeding</h3><div class="pedigree">' +
        '<div><span>Sire</span><b>' + esc(b.sire) + '</b></div>' +
        '<div><span>Dam</span><b>' + esc(b.dam || '') + '</b></div>' +
        '<div><span>Dam sire</span><b>' + esc(b.damSire || '') + '</b></div></div>' +
        (h.vetting ? '<p class="vetting-note">' + esc(h.vetting) + '</p>' : '') + '</div>' : '') +
      '</div></section>' +

      (h.status !== 'sold' ? '<section class="horse-section" id="enquire"><div class="container horse-enquire"><div>' +
        '<span class="section-label">Enquire</span><h2>Ask about this horse</h2>' +
        '<p>Send a message and Joseph will come back to you with more video, vetting details or a time to view at Cork Farm.</p>' +
        '<p>Prefer to talk? <a href="https://wa.me/' + WA + '?text=' + waText + '" target="_blank" rel="noopener">WhatsApp Joe &rarr;</a></p>' +
      '</div><form class="horse-form" name="contact" method="POST">' +
        '<input type="hidden" name="form-name" value="contact"><input type="hidden" name="service" value="Horse Sales: ' + esc(h.name) + '">' +
        '<p hidden><label>Don\'t fill this in: <input name="bot-field"></label></p>' +
        '<div class="row"><input name="name" placeholder="Your Name" required><input type="email" name="email" placeholder="Email Address" required></div>' +
        '<input name="country" placeholder="Your Country">' +
        '<textarea name="message" required>I\'m interested in ' + esc(h.name) + '. </textarea>' +
        '<button type="submit" class="btn-dark">Send Enquiry</button><p class="form-status" id="form-status" role="status"></p>' +
      '</form></div></section>' : '') +

      (others.length ? '<section class="horse-section alt"><div class="container"><span class="section-label">Also for sale</span><h2>More horses</h2><div class="horse-grid more-horses" id="more"></div></div></section>' : '');

    // Gallery
    var main = document.getElementById('g-main'), count = document.getElementById('g-count');
    function show(n) {
      if (!photos.length) return;
      i = (n + photos.length) % photos.length;
      main.src = photos[i].src; main.alt = photos[i].alt || h.name;
      count.textContent = (i + 1) + ' / ' + photos.length;
      document.querySelectorAll('.gallery-thumbs button').forEach(function (t) { t.classList.toggle('is-active', +t.getAttribute('data-i') === i); });
    }
    show(0);
    document.querySelectorAll('.gallery-thumbs button').forEach(function (t) { t.addEventListener('click', function () { show(+t.getAttribute('data-i')); }); });

    // Lightbox
    var lb = document.createElement('div'); lb.className = 'lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<img alt=""><span class="lb-count"></span><button type="button" class="lb-x" aria-label="Close">&times;</button>' +
      (photos.length > 1 ? '<button type="button" class="lb-p" aria-label="Previous photo">&larr;</button><button type="button" class="lb-n" aria-label="Next photo">&rarr;</button>' : '');
    document.body.appendChild(lb);
    function lbShow() { lb.querySelector('img').src = photos[i].src; lb.querySelector('img').alt = photos[i].alt || h.name; lb.querySelector('.lb-count').textContent = (i + 1) + ' / ' + photos.length; }
    function open() { lbShow(); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('.lb-x').focus(); }
    function close() { lb.hidden = true; document.body.style.overflow = ''; }
    function go(d) { show(i + d); lbShow(); }
    var gm = document.querySelector('.gallery-main');
    gm.addEventListener('click', open);
    gm.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    lb.addEventListener('click', function (e) {
      if (e.target.closest('.lb-x') || e.target === lb) close();
      else if (e.target.closest('.lb-p')) go(-1);
      else if (e.target.closest('.lb-n')) go(1);
    });
    var x0 = null;
    [lb, gm].forEach(function (el) {
      el.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
      el.addEventListener('touchend', function (e) { if (x0 === null) return; var d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 40) { show(i + (d < 0 ? 1 : -1)); if (!lb.hidden) lbShow(); } x0 = null; });
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') go(-1); else if (e.key === 'ArrowRight') go(1);
    });

    // Share: copy link
    var copy = document.getElementById('share-copy');
    copy.addEventListener('click', function () {
      var inp = copy.previousElementSibling; inp.select();
      (navigator.clipboard ? navigator.clipboard.writeText(pageUrl) : Promise.reject()).then(function () { copy.textContent = 'Copied'; }, function () { document.execCommand && document.execCommand('copy'); copy.textContent = 'Copied'; });
      setTimeout(function () { copy.textContent = 'Copy'; }, 2500);
    });

    // Enquiry form
    var f = document.querySelector('.horse-form');
    if (f) f.addEventListener('submit', function (e) {
      e.preventDefault();
      var s = document.getElementById('form-status'), btn = f.querySelector('button');
      btn.disabled = true; btn.textContent = 'Sending...';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() })
        .then(function (r) { if (!r.ok) throw 0; s.textContent = 'Thank you. Joseph will be in touch soon.'; f.reset(); })
        .catch(function () { s.textContent = 'Sorry, that did not send. Please WhatsApp Joe on 07771 365693.'; })
        .finally(function () { btn.disabled = false; btn.textContent = 'Send Enquiry'; });
    });

    // More horses
    var more = document.getElementById('more');
    if (more) more.innerHTML = others.map(function (o) {
      var p = (o.photos || [])[0] || {};
      return '<a class="horse-card" href="/sales/' + esc(o.slug) + '"><div class="horse-card-img"><img src="' + esc(p.src) + '" alt="' + esc(p.alt || o.name) + '" loading="lazy">' + badge(o) + '</div>' +
        '<div class="horse-card-body"><h3>' + esc(o.name) + '</h3><p class="horse-card-meta">' + esc(meta(o)) + '</p>' +
        '<div class="horse-card-foot"><span class="horse-card-price">' + price(o) + '</span><span class="horse-card-link">View &rarr;</span></div></div></a>';
    }).join('');
  }
})();
