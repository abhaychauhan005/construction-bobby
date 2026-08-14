(function(){
  // Accessible lightbox
  const links = document.querySelectorAll('.gallery-link');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.querySelector('.lightbox-close');

  function openLightbox(project){
    const srcWebp = `/assets/projects/${project}-1200.webp`;
    const srcJpg = `/assets/projects/${project}-1200.jpg`;
    lbImg.src = srcWebp;
    lbImg.onerror = ()=>{ lbImg.src = srcJpg };
    lbCaption.textContent = project.replace(/-/g,' ');
    lightbox.setAttribute('aria-hidden','false');
    lbClose.focus();
  }

  function closeLightbox(){
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
  }

  links.forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const pr = a.dataset.project;
      openLightbox(pr);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLightbox(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLightbox(); });

  // Simple form feedback for Formspree
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      status.textContent = 'Sending…';
      const data = new FormData(form);
      fetch(form.action, {method:'POST',body:data,headers:{'Accept':'application/json'}})
        .then(res=>res.json())
        .then(json=>{
          status.textContent = 'Thanks — we received your message.';
          form.reset();
        }).catch(err=>{
          status.textContent = 'There was an error sending the form. Replace YOUR_FORM_ID with your Formspree form ID.';
        });
    });
  }
})();
