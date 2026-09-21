document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;

  const container = document.querySelector('.projects-carousel-container, .mySchrederSwiper');
  if (!container) return;

  const projectSwiper = new Swiper(container, {
    slidesPerView: 'auto',
    spaceBetween: 24,
    centeredSlides: false,
    grabCursor: true,
    speed: 750, // Transición cinemática fluida, ni rápida ni lenta
    easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // Easing suave industrial
    loop: true,
    loopedSlides: 6, // Evita que se quede en blanco o salte bruscamente
    watchSlidesProgress: true,
    resistance: true,
    resistanceRatio: 0.85,
    
    // Navegación con flechas
    navigation: {
      nextEl: '.swiper-button-next-custom, .swiper-next-btn',
      prevEl: '.swiper-button-prev-custom, .swiper-prev-btn',
    },

    // Actualización de la barra de progreso (01 — 04)
    on: {
      init: function () {
        updateProgressCounter(this);
      },
      slideChange: function () {
        updateProgressCounter(this);
      }
    }
  });

  function updateProgressCounter(swiperInstance) {
    const totalRealSlides = swiperInstance.slides.length - (swiperInstance.loopedSlides ? swiperInstance.loopedSlides * 2 : 0);
    const realIndex = (swiperInstance.realIndex + 1);
    const currentEl = document.querySelector('.carousel-num-current, #schreder-current-slide');
    const totalEl = document.querySelector('.carousel-num-total');
    const progressBar = document.querySelector('.carousel-progress-line-fill, #schreder-progress-fill');

    if (currentEl) currentEl.textContent = String(realIndex).padStart(2, '0');
    if (totalEl) totalEl.textContent = String(totalRealSlides > 0 ? totalRealSlides : 4).padStart(2, '0');
    if (progressBar) {
      const percentage = (realIndex / (totalRealSlides > 0 ? totalRealSlides : 4)) * 100;
      progressBar.style.width = `${percentage}%`;
    }
  }
});

