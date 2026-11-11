document.addEventListener('DOMContentLoaded',()=>{
  const menuButton=document.getElementById('menuToggle');
  const nav=document.getElementById('mainNav');
  if(menuButton&&nav){
    menuButton.addEventListener('click',()=>{
      const opened=nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded',String(opened));
      menuButton.textContent=opened?'✕':'☰';
    });
    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded','false');
      menuButton.textContent='☰';
    }));
  }

  const service=document.getElementById('calcService');
  const car=document.getElementById('calcCar');
  const result=document.getElementById('calcResult');
  function calculate(){
    if(!service||!car||!result)return;
    const value=Number(service.value)*Number(car.value);
    result.textContent=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(Math.round(value/50)*50)+' ₽';
  }
  if(service&&car){service.addEventListener('change',calculate);car.addEventListener('change',calculate);calculate();}

  const filters=document.querySelectorAll('[data-filter]');
  const galleryItems=document.querySelectorAll('.gallery-item[data-category]');
  filters.forEach(button=>button.addEventListener('click',()=>{
    filters.forEach(item=>item.classList.remove('active'));
    button.classList.add('active');
    const selected=button.dataset.filter;
    galleryItems.forEach(item=>{
      item.style.display=(selected==='all'||item.dataset.category===selected)?'block':'none';
    });
  }));

  const lightbox=document.getElementById('lightbox');
  const lightboxImage=document.getElementById('lightboxImage');
  const closeLightbox=document.getElementById('lightboxClose');
  document.querySelectorAll('.gallery-item img').forEach(img=>img.addEventListener('click',()=>{
    if(!lightbox||!lightboxImage)return;
    lightboxImage.src=img.src;
    lightboxImage.alt=img.alt;
    lightbox.classList.add('open');
  }));
  function closeBox(){if(lightbox){lightbox.classList.remove('open');if(lightboxImage)lightboxImage.src='';}}
  if(closeLightbox)closeLightbox.addEventListener('click',closeBox);
  if(lightbox)lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeBox();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBox();});

  const reviewForm=document.getElementById('reviewForm');
  const reviewStatus=document.getElementById('reviewStatus');
  const localReviews=document.getElementById('localReviews');
  const storageKey='autoDriveDemoReviews';
  function showLocalReviews(){
    if(!localReviews)return;
    let saved=[];
    try{saved=JSON.parse(localStorage.getItem(storageKey)||'[]');}catch(e){saved=[];}
    localReviews.innerHTML=saved.map(item=>`<article class="review" style="margin-top:12px"><div class="stars">${'★'.repeat(item.rating)}</div><b></b><p></p><small>Сохранено только в этом браузере</small></article>`).join('');
    const cards=localReviews.querySelectorAll('.review');
    cards.forEach((card,index)=>{
      card.querySelector('b').textContent=saved[index].name;
      card.querySelector('p').textContent=saved[index].text;
    });
  }
  if(reviewForm){
    showLocalReviews();
    reviewForm.addEventListener('submit',e=>{
      e.preventDefault();
      const item={name:document.getElementById('reviewName').value.trim(),rating:Number(document.getElementById('reviewRating').value),text:document.getElementById('reviewText').value.trim()};
      if(!item.name||!item.text)return;
      let saved=[];
      try{saved=JSON.parse(localStorage.getItem(storageKey)||'[]');}catch(e){saved=[];}
      saved.unshift(item);saved=saved.slice(0,10);
      try{localStorage.setItem(storageKey,JSON.stringify(saved));}catch(e){
        if(reviewStatus){reviewStatus.textContent='Браузер не разрешил локальное сохранение.';reviewStatus.classList.add('show');}
        return;
      }
      reviewForm.reset();showLocalReviews();
      if(reviewStatus){reviewStatus.textContent='Демо-отзыв сохранён только на этом устройстве. Другие посетители его не увидят.';reviewStatus.classList.add('show');}
    });
  }

  const requestForm=document.getElementById('requestForm');
  if(requestForm){
    requestForm.addEventListener('submit',e=>{
      e.preventDefault();
      const name=document.getElementById('clientName').value.trim();
      const phone=document.getElementById('clientPhone').value.trim();
      const serviceName=document.getElementById('clientService').value;
      const message=document.getElementById('clientMessage').value.trim();
      const status=document.getElementById('requestStatus');
      if(!name||!phone)return;
      if(status){
        status.textContent='Данные проверены в демонстрационном режиме, но никуда не отправлены. Чтобы принимать заявки, подключите сервер или сервис обработки форм.';
        status.classList.add('show');
      }
    });
  }
});
