// smooth scroll do botão para a secção "declaration"
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btnView');
  const target = document.getElementById('declaration');

  if (btn && target) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // animação de micro-feedback
      btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(0.98)' }, { transform: 'scale(1)' }], { duration: 240 });
      // scroll suave, considera offset da navbar fixa
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  }

  // melhora: cliques no indicador (seta) también scroll suave
  document.querySelectorAll('.scroll-indicator').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const href = el.getAttribute('href');
      if (!href) return;
      const node = document.querySelector(href);
      if (!node) return;
      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 70;
      const top = node.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});


// GALERIA: mostrar texto temporário ao clicar numa foto
(function(){
  const buttons = document.querySelectorAll('.img-btn');
  const overlay = document.getElementById('msgOverlay');
  let hideTimer = null;

  if (!buttons.length || !overlay) return;

  function showMsg(text){
    // limpa qualquer timeout anterior
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }

    overlay.textContent = text;
    overlay.setAttribute('aria-hidden', 'false');
    overlay.classList.add('show');

    // esconde após 2000ms
    hideTimer = setTimeout(() => {
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
      hideTimer = null;
    }, 2000);
  }

  // clique e acessibilidade teclado
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = btn.dataset.text || '';
      if (!text) return;
      showMsg(text);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // opcional: fecha se o utilizador tocar em qualquer outro sítio
  document.addEventListener('click', (e) => {
    if (!overlay.classList.contains('show')) return;
    // se clicou fora de um .img-btn, fecha mais cedo
    if (!e.target.closest('.img-btn')) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      overlay.classList.remove('show');
      overlay.setAttribute('aria-hidden', 'true');
    }
  });
})();


// CONTADOR DESDE 24/12/2025
(function(){
    const startDate = new Date("2025-12-24T00:00:00");
    const output = document.getElementById("timeTogether");

    function updateTime(){
        const now = new Date();
        const diff = now - startDate;

        if(diff < 0){
            output.textContent = "A nossa história ainda vai começar ❤️";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        output.textContent = `${days} dias, ${hours} horas e ${minutes} minutos juntos ❤️`;
    }

    updateTime();
    setInterval(updateTime, 60000);
})();



// BOTÃO FINAL + MÚSICA
(function(){

  const btn = document.getElementById("loveBtn");
  const music = document.getElementById("loveMusic");
  const hero = document.querySelector(".final-hero");
  const heartsContainer = document.getElementById("hearts-container");

  if(!btn || !music || !hero) return;

  function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.innerHTML = "❤️";

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (20 + Math.random() * 20) + "px";
    heart.style.animationDuration = (3 + Math.random() * 2) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 5000);
  }

  btn.addEventListener("click", () => {

    hero.classList.add("active");

    // Começar 4 segundos antes do refrão (ajusta conforme a música)
    music.currentTime = 05;

    music.volume = 0;
    music.play();

    // Fade in suave
    let fade = setInterval(() => {
      if (music.volume < 0.9) {
        music.volume += 0.05;
      } else {
        clearInterval(fade);
      }
    }, 200);

    // Criar corações continuamente
    setInterval(createHeart, 300);

    btn.textContent = "Então vamos continuar esta história juntos ❤️";
    btn.disabled = true;
  });

})();




  // fetch horário de Moçambique online
  fetch('https://worldtimeapi.org/api/timezone/Africa/Maputo')
    .then(resp => {
      if (!resp.ok) throw new Error("Falha API tempo");
      return resp.json();
    })
    .then(json => {
      // data/hora no formato ISO retornada pela API
      const serverNow = new Date(json.datetime).getTime();
      serverOffset = serverNow - Date.now();
      updateDisplay(serverNow);

      // atualizar a cada 60s
      setInterval(() => updateDisplay(Date.now() + serverOffset), 60000);
    })
    .catch(err => {
      console.warn("Falha ao buscar hora online, usando relógio local.", err);
      updateDisplay(Date.now());
      setInterval(() => updateDisplay(Date.now()), 60000);
    });
