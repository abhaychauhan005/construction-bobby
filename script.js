/* ==========================================================================
   CHAUHAN & CO. — shared script (runs on every page)
   ========================================================================== */
(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav scroll state ---------- */
  var navEl = document.getElementById('siteNav');
  function onNavScroll(){
    if(!navEl) return;
    if(window.scrollY > 40) navEl.classList.add('scrolled');
    else navEl.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onNavScroll, {passive:true});
  onNavScroll();

  /* ---------- mobile menu ---------- */
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

  /* ---------- contact form (demo — no backend, shows a confirmation state) ---------- */
  var contactForm = document.getElementById('contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      contactForm.classList.add('submitted');
      var success = document.getElementById('formSuccess');
      if(success) success.classList.add('show');
      var nameField = document.getElementById('fName');
      var successName = document.getElementById('successName');
      if(nameField && successName && nameField.value.trim()){
        successName.textContent = nameField.value.trim().split(' ')[0];
      }
    });
  }

  /* ---------- projects filter ---------- */
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
  if(!heroPin){ return; }

  /* ---------- build the floors + windows ---------- */
  var floorsG = document.getElementById('floors');
  var windowsG = document.getElementById('windows');
  var FLOORS = 7;
  var floorHeight = 58;
  var groundY = 548;
  var buildingX = 368, buildingW = 264;
  var floorEls = [];
  var windowEls = [];

  for(var i=0;i<FLOORS;i++){
    var topY = groundY - (i+1)*floorHeight;
    var slab = document.createElementNS('http://www.w3.org/2000/svg','rect');
    slab.setAttribute('x', buildingX);
    slab.setAttribute('y', topY + floorHeight - 8);
    slab.setAttribute('width', buildingW);
    slab.setAttribute('height', 8);
    slab.setAttribute('fill', '#3A4750');
    slab.setAttribute('opacity', 0);
    slab.style.transition = 'opacity .5s ease, transform .5s ease';
    slab.style.willChange = 'opacity, transform';
    slab.style.transform = 'translateY(14px)';
    slab.style.transformBox = 'fill-box';
    floorsG.appendChild(slab);
    floorEls.push(slab);

    var face = document.createElementNS('http://www.w3.org/2000/svg','rect');
    face.setAttribute('x', buildingX);
    face.setAttribute('y', topY);
    face.setAttribute('width', buildingW);
    face.setAttribute('height', floorHeight - 8);
    face.setAttribute('fill', '#232A30');
    face.setAttribute('opacity', 0);
    face.style.transition = 'opacity .5s ease';
    face.style.willChange = 'opacity';
    floorsG.insertBefore(face, slab);
    floorEls.push(face);

    var winRow = [];
    var winCount = 5;
    var margin = 18;
    var gap = 10;
    var winW = (buildingW - margin*2 - gap*(winCount-1)) / winCount;
    for(var w=0; w<winCount; w++){
      var win = document.createElementNS('http://www.w3.org/2000/svg','rect');
      win.setAttribute('x', buildingX + margin + w*(winW+gap));
      win.setAttribute('y', topY + 12);
      win.setAttribute('width', winW);
      win.setAttribute('height', floorHeight - 8 - 20);
      win.setAttribute('fill', '#3A4750');
      win.setAttribute('opacity', 0);
      win.style.transition = 'opacity .4s ease, fill .4s ease';
      win.style.willChange = 'opacity';
      windowsG.appendChild(win);
      winRow.push(win);
    }
    windowEls.push(winRow);
  }

  var columns = document.querySelectorAll('#columns line');
  var foundation = document.getElementById('foundation');
  var crane = document.getElementById('crane');
  var craneTrolley = document.getElementById('craneTrolley');
  var ghostOutline = document.getElementById('ghostOutline');
  var bgGrid = document.getElementById('bgGrid');
  var bgWarm = document.getElementById('bgWarm');
  var roofDetail = document.getElementById('roofDetail');
  var completeMark = document.getElementById('completeMark');

  function clamp(v,a,b){ return Math.max(a, Math.min(b,v)); }
  function map(v, a, b, c, d){ return clamp((v-a)/(b-a), 0, 1) * (d-c) + c; }

  var stageTexts = document.querySelectorAll('.hero-stage-text');
  var dots = document.querySelectorAll('.hero-progress .dot');
  var scrollHint = document.getElementById('scrollHint');
  var stageRanges = [[0,0.12],[0.12,0.30],[0.30,0.62],[0.62,0.85],[0.85,1.001]];

  function render(p){
    foundation.setAttribute('opacity', p > 0.02 ? 1 : 0);

    var colProgress = map(p, 0.05, 0.28, 100, 0);
    columns.forEach(function(c){ c.setAttribute('stroke-dashoffset', colProgress); });

    for(var i=0;i<FLOORS;i++){
      var start = 0.26 + i*((0.63-0.26)/FLOORS);
      var end = start + 0.03;
      var op = map(p, start, end, 0, 1);
      floorEls[i*2].style.opacity = op;
      floorEls[i*2+1].style.opacity = op;
      floorEls[i*2+1].style.transform = 'translateY(' + (14*(1-op)) + 'px)';
    }

    var winStart = 0.64, winEnd = 0.86;
    var totalWindows = FLOORS*5;
    var idx = 0;
    for(var f=0; f<FLOORS; f++){
      for(var w=0; w<windowEls[f].length; w++){
        var t0 = winStart + (idx/totalWindows)*(winEnd-winStart);
        var t1 = t0 + 0.015;
        var opw = map(p, t0, t1, 0, 1);
        var el = windowEls[f][w];
        el.style.opacity = 0.25 + opw*0.75;
        el.setAttribute('fill', opw > 0.5 ? '#F2A93B' : '#3A4750');
        idx++;
      }
    }

    ghostOutline.setAttribute('opacity', map(p, 0.05, 0.5, 0.55, 0.05));
    bgGrid.setAttribute('opacity', 1 - p*0.8);
    bgWarm.setAttribute('opacity', map(p, 0.62, 0.95, 0, 0.9));

    var sweep = Math.sin(p*Math.PI*3.2) * 165;
    craneTrolley.setAttribute('transform', 'translate(' + (-sweep) + ',0)');
    crane.setAttribute('opacity', 1 - map(p, 0.87, 1, 0, 1));

    roofDetail.setAttribute('opacity', map(p, 0.9, 1, 0, 1));
    completeMark.setAttribute('opacity', map(p, 0.94, 1, 0, 1));

    var activeStage = 0;
    for(var s=0;s<stageRanges.length;s++){
      if(p >= stageRanges[s][0] && p < stageRanges[s][1]) activeStage = s;
    }
    if(p >= 0.999) activeStage = stageRanges.length - 1;
    stageTexts.forEach(function(el){
      el.classList.toggle('active', Number(el.dataset.stage) === activeStage);
    });
    dots.forEach(function(d){
      d.classList.toggle('active', Number(d.dataset.i) === activeStage);
    });

    if(scrollHint) scrollHint.style.opacity = p > 0.03 ? 0 : 1;
  }

  var ticking = false;
  function getProgress(){
    var rect = heroPin.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    if(total <= 0) return 1;
    var scrolled = -rect.top;
    return clamp(scrolled/total, 0, 1);
  }
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(function(){
        render(getProgress());
        ticking = false;
      });
      ticking = true;
    }
  }
  var resizeTimer;
  function onResize(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onScroll, 120);
  }

  if(reduceMotion){
    render(1);
  } else {
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onResize);
    render(getProgress());
  }

  /* ---------- process timeline in-view highlight ---------- */
  var processItems = document.querySelectorAll('.process-item');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, {threshold:0.4});
  processItems.forEach(function(el){ io.observe(el); });

  /* ---------- stat count-up ---------- */
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
      var progress = clamp((ts-startTime)/dur, 0, 1);
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

})();
