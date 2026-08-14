(function(){
  // Accessible lightbox
  const links = document.querySelectorAll('.gallery-link');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.querySelector('.lightbox-close');

  function openLightbox(project){
    if(!lbImg) return;
    const srcWebp = `assets/projects/${project}-1200.webp`;
    const srcJpg = `assets/projects/${project}-1200.jpg`;
    lbImg.src = srcWebp;
    lbImg.onerror = ()=>{ lbImg.src = srcJpg };
    lbCaption.textContent = project.replace(/-/g,' ');
    lightbox.setAttribute('aria-hidden','false');
    if(lbClose) lbClose.focus();
  }

  function closeLightbox(){
    if(!lightbox) return;
    lightbox.setAttribute('aria-hidden','true');
    if(lbImg) lbImg.src = '';
  }

  links.forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const pr = a.dataset.project;
      openLightbox(pr);
    });
  });

  if(lbClose) lbClose.addEventListener('click', closeLightbox);
  if(lightbox) lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLightbox(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLightbox(); });

  // Simple form feedback for Formspree with placeholder guard
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();

      // Guard: prevent sending to Formspree placeholder ID
      if(form.action && form.action.includes('YOUR_FORM_ID')){
        if(status) status.textContent = 'Form is not configured: replace YOUR_FORM_ID in contact.html with your Formspree form ID before submitting.';
        return;
      }

      if(status) status.textContent = 'Sending…';
      const data = new FormData(form);
      fetch(form.action, {method:'POST',body:data,headers:{'Accept':'application/json'}})
        .then(res=>res.json())
        .then(json=>{
          if(status) status.textContent = 'Thanks — we received your message.';
          form.reset();
        }).catch(err=>{
          if(status) status.textContent = 'There was an error sending the form. Please check your Formspree configuration.';
        });
    });
  }

  // GSAP scroll-scrubbed hero (register if available)
  function initHeroScrub(){
    if(!(window.gsap && window.ScrollTrigger)) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const hero = document.querySelector('#hero-scrub');
    if(!hero) return;
    const layers = hero.querySelectorAll('.hero-layer');
    const caption = hero.querySelector('.hero-caption');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=1200',
        scrub: 1,
        pin: true
      }
    });

    // Parallax-like movement: foreground moves fastest
    if(layers[0]) tl.fromTo(layers[0], {y:0, scale:1.12}, {y:-360, scale:1, ease:'none'}, 0);
    if(layers[1]) tl.fromTo(layers[1], {y:0, scale:1.06}, {y:-220, scale:1, ease:'none'}, 0);
    if(layers[2]) tl.fromTo(layers[2], {y:0, scale:1.02}, {y:-100, scale:1, ease:'none'}, 0);

    if(caption) tl.fromTo(caption, {y:0, opacity:1}, {y:-200, opacity:0, ease:'none'}, 0);
  }

  // Wait for GSAP scripts if they are deferred
  if(window.gsap && window.ScrollTrigger){
    initHeroScrub();
  } else {
    window.addEventListener('load', initHeroScrub);
  }

})();
