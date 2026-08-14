/* ==========================================================================
   CHAUHAN & CO. — shared script (modified: added lightbox, accessible form submission, conditional GSAP load)
   ========================================================================== */
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav scroll state (unchanged) ---------- */
  var navEl = document.getElementById('siteNav');
  function onNavScroll(){
    if(!navEl) return;
    if(window.scrollY > 40) navEl.classList.add('scrolled');
    else navEl.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onNavScroll, {passive:true});
  onNavScroll();

  /* ---------- mobile menu (unchanged) ---------- */
  var burger = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('mobileMenu');
  if(burger && mobileMenu){
    function closeMenu(){
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
    function toggleMenu(){
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mobileMenu.classList.toggle('open', !open);
      document.body.classList.toggle('menu-open', !open);
    }
    burger.addEventListener('click', toggleMenu);
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- contact form (accessible, sends to Formspree if configured) ---------- */
  (function(){
    var contactForm = document.getElementById('contactForm');
    var formMessage = document.getElementById('formMessage');
    var formSuccess = document.getElementById('formSuccess');
    var successName = document.getElementById('successName');

    if(contactForm){
      contactForm.addEventListener('submit', function(e){
        e.preventDefault();
        // Basic built-in form validation
        if(!contactForm.checkValidity()){
          contactForm.reportValidity();
          return;
        }

        var submitBtn = contactForm.querySelector('button[type="submit"]');
        if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

        // POST to action (Formspree example)
        fetch(contactForm.action, {
          method: contactForm.method || 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(contactForm)
        }).then(function(res){
          if(res.ok){
            contactForm.reset();
            // accessible feedback
            var nameField = document.getElementById('fName');
            if(nameField && successName) successName.textContent = (nameField.value || 'there').trim().split(' ')[0] || 'there';
            if(formSuccess) formSuccess.classList.add('show');
            if(formMessage){ formMessage.textContent = 'Thanks — your message was sent. A site lead will call within one business day.'; formMessage.classList.add('show'); }
          } else {
            return res.json().then(function(data){ throw data; });
          }
        }).catch(function(){
          if(formMessage){ formMessage.textContent = 'Sorry — something went wrong. Please try again or email site@chauhanandco.build'; formMessage.classList.add('error','show'); }
        }).finally(function(){
          if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = 'Send message →'; }
        });
      });
    }
  })();

  /* ---------- projects filter (unchanged) ---------- */
  var filterBar = document.querySelector('.filter-bar');
  if(filterBar){
    var filterBtns = filterBar.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.project-card');
    filterBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        filterBtns.forEach(function(b){ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed','true');
        var filter = btn.dataset.filter;
        cards.forEach(function(card){
          var show = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hidden', !show);
        });
      });
    });
  }

  /* ================================================================
     Everything below only runs on the home page (needs #heroPin)
     ================================================================ */
  var heroPin = document.getElementById('heroPin');

  /* Build floors + windows (unchanged block) */
  if(heroPin){
    /* --- original hero building setup (kept exactly as before) --- */
    /* ... code omitted for brevity in this preview — keep the original hero rendering code from your file ... */
  }

  /* ---------- process timeline in-view highlight (unchanged) ---------- */
  var processItems = document.querySelectorAll('.process-item');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, {threshold:0.4});
  processItems.forEach(function(el){ io.observe(el); });

  /* ---------- stat count-up (unchanged) ---------- */
  var statEls = document.querySelectorAll('.stat b');
  function formatVal(el, val){
    var fmt = el.dataset.format;
    var suffix = el.dataset.suffix || '';
    if(fmt === 'msq'){ return (val/1000000).toFixed(1) + 'M' + suffix; }
    return Math.round(val) + suffix;
  }
  function countUp(el){
    var target = Number(el.dataset.count);
    var dur = 1400;
    var startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.max(0, Math.min(1, (ts-startTime)/dur));
      var eased = 1 - Math.pow(1-progress, 3);
      el.textContent = formatVal(el, target*eased);
      if(progress < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var statIo = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        countUp(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.6});
  statEls.forEach(function(el){ statIo.observe(el); });

  /* ---------- LIGHTBOX (new, lightweight) ---------- */
  (function(){
    var lb = document.getElementById('lightbox');
    if(!lb) return;
    var inner = lb.querySelector('.lightbox-inner');
    var closeBtn = lb.querySelector('.lightbox-close');

    function openLB(imgSrc, alt){
      inner.innerHTML = '';
      var img = document.createElement('img');
      img.src = imgSrc;
      img.alt = alt || '';
      img.loading = 'eager';
      inner.appendChild(img);
      lb.setAttribute('aria-hidden','false');
      document.body.classList.add('modal-open');
      // trap focus: send focus to close button
      if(closeBtn) closeBtn.focus();
    }

    function closeLB(){
      lb.setAttribute('aria-hidden','true');
      inner.innerHTML = '';
      document.body.classList.remove('modal-open');
    }

    document.querySelectorAll('.project-card img.proj-thumb').forEach(function(img){
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function(){
        openLB(img.currentSrc || img.src, img.alt);
      });
      // also make project-card openable via keyboard (Enter)
      var card = img.closest('.project-card');
      if(card){
        card.addEventListener('keydown', function(e){
          if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            openLB(img.currentSrc || img.src, img.alt);
          }
        });
      }
    });

    if(closeBtn) closeBtn.addEventListener('click', closeLB);
    lb.addEventListener('click', function(e){ if(e.target === lb) closeLB(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLB(); });
  })();

  /* ---------- conditional non-blocking GSAP load (optional) ---------- */
  (function(){
    // If you want GSAP for advanced animations, it will be loaded async here.
    if(typeof gsap === 'undefined' && !reduceMotion){
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js';
      s.defer = true;
      s.onload = function(){ /* run optional animation hooks here */ };
      document.head.appendChild(s);
    }
  })();

})();