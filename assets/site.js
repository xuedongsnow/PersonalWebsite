/* Snow Xue Dong — shared behavior for every page.
   Nav highlight · header shadow · scroll fade-ins · Work carousels + lightbox ·
   Artist sort + filter · click-to-play YouTube · optional Google Analytics. */
(function(){
  'use strict';

  // ---- Google Analytics ---------------------------------------------------
  // Paste your Measurement ID below (it looks like "G-XXXXXXXXXX") to switch on
  // Google Analytics for the whole site. Leave it empty to keep analytics off.
  var GA_MEASUREMENT_ID = '';
  if (GA_MEASUREMENT_ID) {
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
  }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Highlight the current page in the nav ------------------------------
  var here = (location.pathname.split('/').pop() || 'index.html');
  if (here === '') here = 'index.html';
  Array.prototype.slice.call(document.querySelectorAll('.nav-btn')).forEach(function(a){
    if (a.getAttribute('href') === here) a.classList.add('active');
  });

  // ---- Subtle shadow on the sticky header once scrolled -------------------
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function(){
      header.classList.toggle('scrolled', window.scrollY > 4);
    }, { passive: true });
  }

  // ---- Fade-and-rise as elements enter the screen -------------------------
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function(el){ io.observe(el); });
  }

  // ---- External links: add a ↗ arrow + "(opens in a new tab)" for screen readers
  // Applies to link buttons and project-detail links that have target="_blank".
  Array.prototype.slice.call(document.querySelectorAll('.link-btn[target="_blank"], .spec-row a[target="_blank"]')).forEach(function(a){
    var last = a.lastChild;
    var icon = document.createElement('span');
    icon.className = 'ext-icon';
    icon.setAttribute('aria-hidden', 'true');
    if (last && last.nodeType === 3 && /\S/.test(last.nodeValue)) {
      // Keep the last word and the arrow together so the arrow never wraps onto its own line
      var m = last.nodeValue.match(/^([\s\S]*?)(\S+\s*)$/);
      var glue = document.createElement('span');
      glue.className = 'ext-glue';
      glue.textContent = m[2].replace(/\s+$/, '');
      glue.appendChild(icon);
      last.nodeValue = m[1];
      a.appendChild(glue);
    } else {
      a.appendChild(icon);
    }
    var sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = ' (opens in a new tab)';
    a.appendChild(sr);
  });

  // ---- Work: image carousels (each project is independent) ----------------
  Array.prototype.slice.call(document.querySelectorAll('.carousel')).forEach(function(car){
    var track = car.querySelector('.track');
    var slides = car.querySelectorAll('.slide');
    var dots = Array.prototype.slice.call(car.querySelectorAll('.dot'));
    var prev = car.querySelector('.arrow-prev');
    var next = car.querySelector('.arrow-next');
    var n = slides.length, i = 0;
    function show(k){
      i = (k + n) % n;
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      dots.forEach(function(d, di){ d.classList.toggle('active', di === i); });
    }
    if (prev) prev.addEventListener('click', function(){ show(i - 1); });
    if (next) next.addEventListener('click', function(){ show(i + 1); });
    dots.forEach(function(d, di){ d.addEventListener('click', function(){ show(di); }); });
    car.showSlide = show;
    show(0);
  });

  // ---- Work: click an image to view it enlarged (lightbox) -----------------
  // Caption comes from the image's data-caption="…" (falls back to its alt text).
  var lbImgs = Array.prototype.slice.call(document.querySelectorAll('.work-media .slide img'));
  if (lbImgs.length && window.HTMLDialogElement) {
    var tri = function(d){ return '<svg class="tri" viewBox="0 0 12 14"><path d="' + d + '"/></svg>'; };
    var lb = document.createElement('dialog');
    lb.className = 'lightbox';
    lb.setAttribute('aria-label', 'Enlarged image');
    lb.innerHTML =
      '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-arrow lb-prev" aria-label="Previous image">' + tri('M12 0 L0 7 L12 14 Z') + '</button>' +
      '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption>' +
      '<p class="lb-count"></p></figure>' +
      '<button class="lb-arrow lb-next" aria-label="Next image">' + tri('M0 0 L12 7 L0 14 Z') + '</button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('.lb-img'), lbCap = lb.querySelector('.lb-caption'), lbCount = lb.querySelector('.lb-count');
    var group = [], gi = 0, gCar = null;

    function lbShow(k){
      gi = (k + group.length) % group.length;
      var src = group[gi];
      lbImg.src = src.currentSrc || src.src;
      lbImg.alt = src.alt;
      lbCap.textContent = src.getAttribute('data-caption') || src.alt || '';
      lbCount.textContent = group.length > 1 ? (gi + 1) + ' / ' + group.length : '';
    }
    function lbOpen(img){
      gCar = img.closest('.carousel');
      group = Array.prototype.slice.call((gCar || img.parentNode).querySelectorAll('.slide img'));
      lb.classList.toggle('single', group.length < 2);
      lbShow(group.indexOf(img));
      document.documentElement.classList.add('lb-open');
      lb.showModal();
    }
    lb.addEventListener('close', function(){
      document.documentElement.classList.remove('lb-open');
      if (gCar && gCar.showSlide) gCar.showSlide(gi);   // leave the card on the image last viewed
    });
    lb.querySelector('.lb-close').addEventListener('click', function(){ lb.close(); });
    lb.querySelector('.lb-prev').addEventListener('click', function(){ lbShow(gi - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function(){ lbShow(gi + 1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) lb.close(); });   // click the dimmed area
    lb.addEventListener('keydown', function(e){
      if (group.length < 2) return;
      if (e.key === 'ArrowLeft') lbShow(gi - 1);
      if (e.key === 'ArrowRight') lbShow(gi + 1);
    });
    var tx = null;   // swipe left/right on phones
    lb.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function(e){
      if (tx === null || group.length < 2) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 40) lbShow(gi + (dx < 0 ? 1 : -1));
    });

    // Corner "expand" icon on each frame with images (CSS shows it on touch screens only)
    Array.prototype.slice.call(document.querySelectorAll('.work-media .viewport')).forEach(function(vp){
      if (!vp.querySelector('.slide img')) return;
      var hint = document.createElement('span');
      hint.className = 'zoom-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-6.5 6.5M10 20H4v-6M4 20l6.5-6.5"/></svg>';
      vp.appendChild(hint);
    });
    document.addEventListener('touchstart', function(){}, { passive: true });   // lets iOS show the :active press effect

    lbImgs.forEach(function(img){
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', 'Enlarge image' + (img.alt ? ': ' + img.alt : ''));
      img.addEventListener('click', function(){ lbOpen(img); });
      img.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lbOpen(img); }
      });
    });
  }

  // ---- Artist: newest-first sort + category filter ------------------------
  var grid = document.getElementById('art-grid');
  if (grid) {
    var items = Array.prototype.slice.call(grid.children);
    items.sort(function(a,b){ return (b.getAttribute('data-date')||'').localeCompare(a.getAttribute('data-date')||''); });
    items.forEach(function(it){ grid.appendChild(it); });

    var fbtns = Array.prototype.slice.call(document.querySelectorAll('.filter-btn'));
    fbtns.forEach(function(fb){
      fb.addEventListener('click', function(){
        fbtns.forEach(function(x){ x.classList.toggle('active', x === fb); });
        var cat = fb.getAttribute('data-filter');
        grid.classList.add('fading');
        setTimeout(function(){
          Array.prototype.slice.call(grid.children).forEach(function(it){
            it.style.display = (cat === 'all' || it.getAttribute('data-category') === cat) ? '' : 'none';
          });
          grid.classList.remove('fading');
        }, reduce ? 0 : 260);
      });
    });
  }

  // ---- YouTube: load the player only after a click (no autoplay on load) --
  Array.prototype.slice.call(document.querySelectorAll('.yt-facade')).forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.getAttribute('data-id');
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = 'YouTube video player';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allowfullscreen', '');
      btn.parentNode.replaceChild(iframe, btn);
    });
  });

})();
