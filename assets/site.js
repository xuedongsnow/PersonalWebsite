/* Snow Xue Dong — shared behavior for every page.
   Nav highlight · header shadow · scroll fade-ins · Work carousels ·
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
    show(0);
  });

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
