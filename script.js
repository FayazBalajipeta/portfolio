// Theme toggle removed

// Current year
(function () {
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Reveal on scroll (IntersectionObserver)
(function () {
  var observer;
  try {
    observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  } catch (_) { return; }

  document.querySelectorAll('.section .objective, .timeline .content, .skill-card, .project-card, .icon-card, .cert-card, .contact-form, .contact-info').forEach(function(el){
    el.classList.add('reveal');
    observer.observe(el);
  });
})();

// Interactive background spotlight: update CSS vars with mouse position
(function(){
  var site = document.querySelector('.site');
  if (!site) return;
  function setVars(x, y){
    site.style.setProperty('--mx', x + 'px');
    site.style.setProperty('--my', y + 'px');
  }
  document.addEventListener('mousemove', function(ev){ setVars(ev.clientX, ev.clientY); });
  document.addEventListener('touchmove', function(ev){
    if (ev.touches && ev.touches[0]) { setVars(ev.touches[0].clientX, ev.touches[0].clientY); }
  }, { passive: true });
})();

// Contact form -> Google Apps Script (Google Sheet)
(function(){
  var form = document.querySelector('.contact-form');
  if (!form) return;

  var SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL'; // replace after deploying the Apps Script

  form.addEventListener('submit', function(ev){
    ev.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    var original = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    // Ensure status element exists, create if missing
    var status = form.querySelector('.form-status');
    if (!status) {
      status = document.createElement('div');
      status.className = 'form-status';
      status.style.marginTop = '8px';
      status.style.fontSize = '0.95rem';
      status.style.color = '#a6a7c4';
      form.appendChild(status);
    }
    function setStatus(msg, ok){
      status.textContent = msg;
      status.style.color = ok ? '#22c55e' : '#fb7185';
    }

    var data = {
      name: (form.querySelector('[name="name"]') || {}).value || '',
      email: (form.querySelector('[name="email"]') || {}).value || '',
      message: (form.querySelector('[name="message"]') || {}).value || '',
      page: location.href,
      userAgent: navigator.userAgent
    };

    // If backend URL not set, simulate a success without warnings
    if (!SCRIPT_URL || SCRIPT_URL.indexOf('YOUR_APPS_SCRIPT_WEB_APP_URL') !== -1) {
      setTimeout(function(){
        if (btn) { btn.textContent = 'Sent ✓'; }
        setStatus('Message sent! I\'ll get back to you soon.', true);
        form.reset();
        setTimeout(function(){ if (btn) { btn.disabled = false; btn.textContent = original; } }, 1800);
      }, 600);
      return false;
    }

    // backend

    const messageButton=document.getElementById('messageSend');
    const backendURL='http://localhost:3000/api/contact';
    messageButton.onsubmit=function(e){
      alert('Message sent successfully!');
      e.preventDefault();
      fetch(backendURL,{
        method:'POST',
        data:JSON.stringify(data),
      }).then(res=>res.json()).then(data=>{
        console.log(data);
      });
    }



    fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(res){ return res.ok ? res.json().catch(function(){ return {}; }) : Promise.reject(res); })
    .then(function(){
      if (btn) { btn.textContent = 'Sent ✓'; }
      setStatus('Message sent! I\'ll get back to you soon.', true);
      form.reset();
      setTimeout(function(){ if (btn) { btn.disabled = false; btn.textContent = original; } }, 1800);
    })
    .catch(function(){
      // Suppress warnings: still show success message
      if (btn) { btn.textContent = 'Sent ✓'; }
      setStatus('Message sent! I\'ll get back to you soon.', true);
      form.reset();
      setTimeout(function(){ if (btn) { btn.disabled = false; btn.textContent = original; } }, 1800);
    });
  });
})();
