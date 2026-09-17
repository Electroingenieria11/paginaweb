document.addEventListener('DOMContentLoaded', () => {
  /* 0. Transición de Entrada Institucional (Fondo Azul Ultra Rápido) */
  const epicSplash = document.getElementById('epicWelcomeSplash');
  if (epicSplash) {
    setTimeout(() => {
      epicSplash.classList.add('epic-fade-out');
      setTimeout(() => {
        if (epicSplash.parentNode) {
          epicSplash.parentNode.removeChild(epicSplash);
        }
      }, 260);
    }, 120);
  }

  /* 1. Header Dinámico con Glassmorphism al Scroll */
  const header = document.querySelector('.header-transparent');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* 1.1 Dropdown 'Acerca de' (solo despliega al clic/hover, sin redirección) */
  const dropdownItems = document.querySelectorAll('.nav-desktop > li.has-dropdown');
  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-link');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('is-open');
        dropdownItems.forEach(d => {
          d.classList.remove('is-open');
          const t = d.querySelector('.nav-link');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Cerrar dropdown al hacer clic en cualquier otra parte
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      dropdownItems.forEach(d => {
        d.classList.remove('is-open');
        const trigger = d.querySelector('.nav-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* 2. Slider Principal Cinematográfico */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-arrow.prev');
  const nextBtn = document.querySelector('.slider-arrow.next');
  let currentSlide = 0;
  let slideTimer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      const isActive = (i === index);
      slide.classList.toggle('active', isActive);
      if (dots[i]) dots[i].classList.toggle('active', isActive);
      if (isActive) {
        const reveals = slide.querySelectorAll('.reveal-left');
        reveals.forEach(el => el.classList.add('is-revealed'));
      }
    });
    currentSlide = index;
  }

  function nextSlide() {
    if (slides.length === 0) return;
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    if (slides.length === 0) return;
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => { nextSlide(); resetSlideTimer(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetSlideTimer(); });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { showSlide(i); resetSlideTimer(); });
  });

  function startSlideTimer() {
    if (slides.length > 0) {
      slideTimer = setInterval(nextSlide, 7000);
    }
  }

  function resetSlideTimer() {
    clearInterval(slideTimer);
    startSlideTimer();
  }

  /* Soporte Touch Swipe en Hero Slider */
  const sliderSection = document.querySelector('.hero-slider-section');
  if (sliderSection) {
    let touchStartX = 0;
    let touchEndX = 0;
    sliderSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetSlideTimer();
      }
    }, { passive: true });
  }

  startSlideTimer();

  /* 3. Carrusel 3D Cover Flow Estable */
  const cards = document.querySelectorAll('.coverflow-card');
  let activeCardIndex = 0;

  function updateCoverflow() {
    cards.forEach((card, i) => {
      card.classList.remove('pos-center', 'pos-left', 'pos-right');
      const offset = (i - activeCardIndex + 3) % 3;
      if (offset === 0) card.classList.add('pos-center');
      else if (offset === 1) card.classList.add('pos-right');
      else if (offset === 2) card.classList.add('pos-left');
    });
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-unit-view')) return;
      if (index !== activeCardIndex) {
        activeCardIndex = index;
        updateCoverflow();
      }
    });
  });

  if (cards.length > 0) {
    updateCoverflow();
  }

  /* 4. Intersection Observer: Revelado Gradual (Fade-Up solo en tarjetas) */
  const revealElements = document.querySelectorAll('.award-card');
  revealElements.forEach(el => el.classList.add('reveal-fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));

  /* 5. Slider de 4 Imágenes en Alumbrado Público */
  const alumbradoSlides = document.querySelectorAll('.alumbrado-slide');
  const alumbradoDots = document.querySelectorAll('.s-dot');
  const alumbradoPrev = document.querySelector('.slider-btn-mini.prev');
  const alumbradoNext = document.querySelector('.slider-btn-mini.next');

  if (alumbradoSlides.length > 0) {
    let activeAlumbradoIndex = 0;
    let alumbradoTimer;

    function switchAlumbradoSlide(index) {
      const total = alumbradoSlides.length;
      const nextIndex = (index + 1) % total;

      alumbradoSlides.forEach((slide, i) => {
        slide.classList.remove('active', 'next-preview');
        if (i === index) {
          slide.classList.add('active');
        } else if (i === nextIndex) {
          slide.classList.add('next-preview');
        }
        if (alumbradoDots[i]) {
          alumbradoDots[i].classList.toggle('active', i === index);
        }
      });

      activeAlumbradoIndex = index;
    }

    function nextAlumbrado() {
      switchAlumbradoSlide((activeAlumbradoIndex + 1) % alumbradoSlides.length);
    }

    function prevAlumbrado() {
      switchAlumbradoSlide((activeAlumbradoIndex - 1 + alumbradoSlides.length) % alumbradoSlides.length);
    }

    if (alumbradoNext && alumbradoPrev) {
      alumbradoNext.addEventListener('click', () => { nextAlumbrado(); restartTimer(); });
      alumbradoPrev.addEventListener('click', () => { prevAlumbrado(); restartTimer(); });
    }

    alumbradoDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => { switchAlumbradoSlide(idx); restartTimer(); });
    });

    function startTimer() {
      alumbradoTimer = setInterval(nextAlumbrado, 4500); // Cambia cada 4.5 segundos
    }

    function restartTimer() {
      clearInterval(alumbradoTimer);
      startTimer();
    }

    switchAlumbradoSlide(0);
    startTimer();
  }

  /* 6. Split Slider: Antes vs Después */
  const splitInput = document.querySelector('.split-range-input');
  const splitImgBefore = document.querySelector('.img-before');
  const splitHandleLine = document.querySelector('.split-handle-line');

  if (splitInput && splitImgBefore && splitHandleLine) {
    splitInput.addEventListener('input', (e) => {
      const val = e.target.value;
      splitImgBefore.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
      splitHandleLine.style.left = `${val}%`;
    });
  }

  /* 7. Acordeón Interactivo FAQ */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    trigger?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* 8. Contadores Numéricos Animados */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    let animated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          let count = 0;
          const speed = target / 50;
          const updateCount = () => {
            count += speed;
            if (count < target) {
              stat.innerText = (target === 45 ? '>' : target === 24 ? '<' : '+') + Math.ceil(count).toLocaleString() + (target === 45 || target === 100 ? '%' : target === 24 ? 'h' : '');
              requestAnimationFrame(updateCount);
            } else {
              stat.innerText = (target === 45 ? '>' : target === 24 ? '<' : '+') + target.toLocaleString() + (target === 45 || target === 100 ? '%' : target === 24 ? 'h' : '');
            }
          };
          updateCount();
        });
      }
    }, { threshold: 0.4 });

    const statsStrip = document.querySelector('.alumbrado-stats-strip');
    if (statsStrip) statsObserver.observe(statsStrip);
  }

  /* 9. Filtro Departamental de Sedes Operativas */
  const deptButtons = document.querySelectorAll('.dept-filter-btn');
  const deptBlocks = document.querySelectorAll('.department-block');

  if (deptButtons.length > 0 && deptBlocks.length > 0) {
    deptButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        deptButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetDept = btn.getAttribute('data-dept');
        deptBlocks.forEach(block => {
          if (targetDept === 'all' || block.getAttribute('data-dept') === targetDept) {
            block.style.display = 'flex';
            block.style.opacity = '0';
            setTimeout(() => {
              block.style.transition = 'opacity 0.35s ease';
              block.style.opacity = '1';
            }, 10);
          } else {
            block.style.display = 'none';
          }
        });
      });
    });
  }

  /* 9.1 Navegación Directa desde Chips y Tarjetas de Ciudades a Sedes de Contacto */
  const cityLinks = document.querySelectorAll('a.city-pill, .emblematic-card-link');
  cityLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHash = link.getAttribute('href');
      if (targetHash && targetHash.startsWith('#')) {
        const targetEl = document.querySelector(targetHash);
        if (targetEl) {
          e.preventDefault();

          // Si la sede está dentro de un bloque departamental oculto, activar el filtro correspondiente
          const parentDeptBlock = targetEl.closest('.department-block');
          if (parentDeptBlock) {
            const deptKey = parentDeptBlock.getAttribute('data-dept');
            const targetBtn = document.querySelector(`.dept-filter-btn[data-dept="${deptKey}"]`) || document.querySelector('.dept-filter-btn[data-dept="all"]');
            if (targetBtn && !targetBtn.classList.contains('active')) {
              targetBtn.click();
            }
          }

          // Desplazamiento suave con compensación del header fijo (90px)
          const headerOffset = 90;
          const elementPosition = targetEl.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Resaltado visual interactivo
          targetEl.classList.remove('branch-card-highlight');
          void targetEl.offsetWidth; // Forzar reflow para reiniciar la animación
          targetEl.classList.add('branch-card-highlight');
          setTimeout(() => {
            targetEl.classList.remove('branch-card-highlight');
          }, 2600);
        }
      }
    });
  });

  /* 10. Menú Móvil Ejecutivo (Drawer Slideout) */
  const navToggle = document.querySelector('.nav-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navOverlay = document.querySelector('.mobile-nav-overlay');
  const drawerClose = document.querySelector('.drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-nav-link, .drawer-btn-quote');

  function openMobileNav() {
    if (!navDrawer) return;
    navDrawer.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.classList.add('nav-open');
    navToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    if (!navDrawer) return;
    navDrawer.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.classList.remove('nav-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', openMobileNav);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeMobileNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer?.classList.contains('active')) {
      closeMobileNav();
    }
  });

  /* 11. Control de Sensibilidad y Estabilidad del Acordeón (Hover Intent) */
  const accordionItems = document.querySelectorAll('.accordion-panel, .gallery-accordion-item');
  if (accordionItems.length > 0) {
    let hoverTimeout = null;

    accordionItems.forEach(item => {
      // Al pasar el cursor, espera 90ms para verificar si la intención es real
      item.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(() => {
          accordionItems.forEach(el => el.classList.remove('active'));
          item.classList.add('active');
        }, 90); // Tolerancia anti-tirones (ignora roces rápidos)
      });

      item.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
      });

      // Al hacer clic, se activa y fija de inmediato
      item.addEventListener('click', (e) => {
        if (e.target.closest('.accordion-action-btn, .panel-btn-action')) {
          return; // Permite navegación sin bloquear el enlace
        }
        clearTimeout(hoverTimeout);
        accordionItems.forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  /* 12. Sistema Dinámico de Detalle de Proyectos (?id=slug) */
  const proyectosData = {
    'carreteras-autopistas': {
      title: 'Carreteras y Autopistas',
      category: 'Infraestructura Vial',
      subtitle: 'Ingeniería de iluminación para corredores de alta velocidad, reducción de accidentabilidad y estricto cumplimiento de uniformidad RETILAP M1 a M3.',
      heroImg: 'assets/alumbrado/footer.webp',
      badges: [
        { icon: 'fa-certificate', text: 'Clase RETILAP M1/M2' },
        { icon: 'fa-lightbulb', text: 'Óptica Asimétrica Tipo II/III' },
        { icon: 'fa-bolt-lightning', text: 'Ahorro Energético > 48%' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP Tipo M1 - M3', sub: 'Luminancia > 1.5 cd/m² y uniformidad global Uo ≥ 0.40' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '120W - 250W LED', sub: 'Drivers programables con curvas de atenuación nocturna' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '155 - 170 lm/W', sub: 'Chips Lumileds / Cree de alta vida útil (> 100.000h L70B10)' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Tipo II / III Asimétrica', sub: 'Lentes PMMA de grado óptico con corte total (Full Cutoff)' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK09', sub: 'Hermeticidad contra lluvia y carcasa en aluminio fundido' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Conector NEMA 7-Pin / Zhaga', sub: 'Telemetría LoRaWAN / Zigbee para monitoreo remoto en tiempo real' }
      ],
      editorialTitle: 'Ingeniería Fotométrica Avanzada para Vías de Alta Velocidad',
      editorial: [
        'La iluminación de autopistas y vías troncales de alta velocidad constituye uno de los desafíos más rigurosos de la ingeniería eléctrica moderna. En Electroingeniería S.A.S. diseñamos e implementamos sistemas fotométricos optimizados para eliminar zonas oscuras y reflejos perturbadores, asegurando que los conductores mantengan una agudeza visual superior aún bajo condiciones climáticas adversas o lluvia intensa.',
        'Cada tramo vial es modelado previamente mediante software especializado (DIALux EVO), calculando con exactitud la luminancia longitudinal, el deslumbramiento incapacitante (TI < 10%) y la uniformidad global requerida por el reglamento técnico RETILAP. Nuestras luminarias integran disipación pasiva de calor de grado aeronáutico, lo que extiende la vida útil nominal a más de 100.000 horas de operación continua sin degradación del flujo luminoso.',
        'Adicionalmente, los sistemas incorporan perfiles de dimerización multinivel automáticos que disminuyen la potencia nominal en horas de baja densidad vehicular (madrugada), generando ahorros adicionales para las concesiones viales y entidades territoriales sin comprometer la seguridad pública.'
      ],
      highlights: [
        'Estudios fotométricos certificados punto a punto con trazabilidad y cumplimiento RETILAP.',
        'Supresores de sobretensión integrados de 10kV / 20kA grado industrial.',
        'Mástiles y brazos galvanizados por inmersión en caliente según norma ASTM A123.',
        'Monitoreo de corriente, tensión y factor de potencia en tiempo real por cada punto de luz.'
      ],
      gallery: [
        { img: 'assets/alumbrado/footer.webp', caption: 'Corredor vial con uniformidad clase M1' },
        { img: 'assets/proyectos/9.jpg', caption: 'Intercambiador vial y glorietas perimetrales' },
        { img: 'assets/alumbrado/Gemini_Generated_Image_c6goduc6goduc6go.jpg', caption: 'Vista panorámica de vía troncal modernizada' },
        { img: 'assets/proyectos/4.jpg', caption: 'Acceso a viaductos y pasos elevados' }
      ]
    },
    'avenidas-bulevares': {
      title: 'Avenidas y Bulevares',
      category: 'Entorno Urbano',
      subtitle: 'Modernización lumínica de corredores urbanos principales, combinando seguridad ciudadana, calidez cromática y diseño estético contemporáneo.',
      heroImg: 'assets/proyectos/9.jpg',
      badges: [
        { icon: 'fa-certificate', text: 'Clase RETILAP M2/C1' },
        { icon: 'fa-eye', text: 'CRI > 75 Ra (Alto Confort)' },
        { icon: 'fa-tower-cell', text: 'Telegestión Inteligente' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP Tipo M2 - M3 / C1', sub: 'Iluminación balanceada tanto vehicular como peatonal' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '80W - 150W LED', sub: 'Curvas de fotocelda electrónica inteligente programable' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '150 - 165 lm/W', sub: 'Temperatura de color neutra calibrada a 4000K / 5000K' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Semiasimétrica Tipo II-M', sub: 'Cobertura transversal óptima en calzadas y andenes paralelos' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK08+', sub: 'Resistencia a vibraciones vehiculares continuas y polución urbana' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Fotoceldas Inteligentes 1-10V', sub: 'Integración a la plataforma central de monitoreo y despacho de cuadrillas' }
      ],
      editorialTitle: 'Transformación del Espacio Público Urbano y Seguridad Ciudadana',
      editorial: [
        'Los bulevares y avenidas metropolitanas son las arterias vivas de las ciudades. La modernización lumínica en estos corredores no solo reduce los índices de criminalidad y accidentalidad, sino que fomenta el dinamismo comercial y eleva la calidad de vida de los habitantes.',
        'Nuestra solución para avenidas implementa ópticas de alta precisión que distribuyen el flujo tanto en las calzadas de circulación vehicular como en las zonas peatonales adyacentes, minimizando la contaminación lumínica hacia los edificios residenciales y el cielo nocturno.',
        'Con cuadrillas operativas en constante monitoreo, aseguramos índices de disponibilidad superiores al 99.5%, respondiendo con inmediatez a cualquier contingencia en las líneas de distribución o luminarias.'
      ],
      highlights: [
        'Reproducción de color CRI > 75 para reconocimiento preciso de peatones y matrículas.',
        'Compatibilidad con cámaras de videovigilancia ciudadana sin parpadeo (flicker-free).',
        'Sistemas de soporte y brazos ornamentales pintados electrostáticamente.',
        'Transición sin interrupción del servicio mediante esquemas de sustitución por etapas.'
      ],
      gallery: [
        { img: 'assets/proyectos/9.jpg', caption: 'Avenida metropolitana con iluminación uniforme' },
        { img: 'assets/alumbrado/Gemini_Generated_Image_c6goduc6goduc6go.jpg', caption: 'Corredor con tecnología LED 5000K' },
        { img: 'assets/alumbrado/footer.webp', caption: 'Bulevar principal con doble calzada' },
        { img: 'assets/proyectos/1.jpg', caption: 'Conexión cívica entre avenidas y paseos peatonales' }
      ]
    },
    'parques-plazas': {
      title: 'Parques y Plazas Públicas',
      category: 'Espacio Cívico',
      subtitle: 'Proyectos lumínicos para la convivencia ciudadana, senderos recreativos y patrimonio histórico con ópticas antideslumbrantes y ambientación cálida.',
      heroImg: 'assets/proyectos/1.jpg',
      badges: [
        { icon: 'fa-certificate', text: 'RETILAP Clase P1-P4' },
        { icon: 'fa-shield-halved', text: 'IK10 Antivandálico' },
        { icon: 'fa-cloud-moon', text: 'Cero Polución Lumínica' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP Clase P1 - P4', sub: 'Iluminación horizontal y vertical para reconocimiento facial nítido' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '40W - 90W LED', sub: 'Luminarias tipo post-top y proyectores de realce arquitectónico' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '140 - 155 lm/W', sub: 'Temperatura cálida/neutra 3000K / 4000K de alta reproducción' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Simétrica Circular / Rotacional', sub: 'Difusión homogénea sin zonas de sombra bajo copas de árboles' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK10 Antivandálico', sub: 'Polímeros de alta resistencia y difusores de policarbonato estabilizado UV' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Sensores Crepusculares y DALI', sub: 'Atenuación nocturna para preservación de fauna y ahorro energético' }
      ],
      editorialTitle: 'Espacios Vivos, Seguros y Acogedores para la Comunidad',
      editorial: [
        'Los parques y plazas constituyen el corazón social de los municipios. La iluminación en estos espacios debe trascender la visibilidad funcional: debe brindar una atmósfera segura, acogedora y armónica con la arborización y el mobiliario urbano.',
        'Electroingeniería diseña proyectos específicos para plazas cívicas que combinan iluminación perimetral para senderos con proyectores dirigidos a monumentos, fuentes y zonas de juegos infantiles. Priorizamos el confort visual (UGR < 19) para evitar el encandilamiento directo de los visitantes.',
        'Todos los elementos instalados cuentan con anclajes antivandálicos y materiales resistentes a la corrosión, garantizando que el patrimonio público se mantenga impecable a lo largo de los años.'
      ],
      highlights: [
        'Excelente reconocimiento facial vertical (Ev > 5 lux) que incrementa la percepción de seguridad.',
        'Diseños arquitectónicos adaptados al estilo colonial o contemporáneo del municipio.',
        'Circuitos soterrados protegidos contra humedad y filtraciones freáticas.',
        'Integración con iluminación de acento en fuentes y elementos escultóricos.'
      ],
      gallery: [
        { img: 'assets/proyectos/1.jpg', caption: 'Parque principal con iluminación perimetral post-top' },
        { img: 'assets/proyectos/7.jpg', caption: 'Iluminación arquitectónica de plaza histórica' },
        { img: 'assets/proyectos/5.jpg', caption: 'Senderos peatonales seguros y arborizados' },
        { img: 'assets/alumbrado/Gemini_Generated_Image_c6goduc6goduc6go.jpg', caption: 'Panorámica de espacio público revitalizado' }
      ]
    },
    'escenarios-deportivos': {
      title: 'Escenarios Deportivos',
      category: 'Deportes & Recreación',
      subtitle: 'Iluminación de alta potencia para canchas polideportivas, estadios y coliseos, con uniformidad certificada y compatibilidad con transmisión televisiva.',
      heroImg: 'assets/proyectos/2.jpg',
      badges: [
        { icon: 'fa-trophy', text: 'Clase I, II y III Deportiva' },
        { icon: 'fa-video', text: 'Flicker < 1% (Broadcast Ready)' },
        { icon: 'fa-eye', text: 'CRI > 80 / TLCI > 85' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP Escenarios Deportivos', sub: 'Niveles de 200 a 750+ lux según categoría de competencia' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '300W - 1200W Proyector', sub: 'Proyectores modulares de alta potencia y disipación térmica activa/pasiva' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '145 - 160 lm/W', sub: 'LED de alta densidad óptica y reproducción cromática superior' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Haces Estrechos y Medios (15° a 60°)', sub: 'Reflectores micro-multifacéticos antideslumbramiento para atletas' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK09', sub: 'Válvula de alivio de presión interna (respirador Gore-Tex)' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Control DMX / DALI por Escenas', sub: 'Modos preconfigurados: Entrenamiento, Competencia y Eventos Especiales' }
      ],
      editorialTitle: 'Potencia Óptica y Cero Parpadeo para la Práctica Deportiva',
      editorial: [
        'La iluminación en escenarios deportivos exige una ingeniería fotométrica de máxima precisión. Tanto para los jugadores en movimiento rápido como para los espectadores y cámaras de video, la uniformidad horizontal y vertical es crítica para evitar sombras engañosas y deslumbramientos peligrosos.',
        'En Electroingeniería realizamos cálculos computarizados que determinan la altura óptima de torres, orientación tridimensional y apertura de haz de cada proyector individualmente, garantizando que no existan zonas muertas en el terreno de juego.',
        'Nuestros sistemas permiten la programación de escenas automáticas: niveles moderados para calentamiento o prácticas aficionadas, y máxima potencia para torneos y finales oficiales, optimizando los costos operativos de la infraestructura comunitaria.'
      ],
      highlights: [
        'Ausencia total de parpadeo estroboscópico, apto para transmisiones HD y cámara lenta.',
        'Torres autosoportadas y monopostes con cálculo estructural para cargas de viento.',
        'Encendido y reencendido instantáneo sin tiempos de espera de enfriamiento.',
        'Tableros de control con protecciones termomagnéticas y diferenciales independientes.'
      ],
      gallery: [
        { img: 'assets/proyectos/2.jpg', caption: 'Cancha polideportiva con proyección LED de alta uniformidad' },
        { img: 'assets/proyectos/8.jpg', caption: 'Complejo deportivo con torres de 18 metros' },
        { img: 'assets/proyectos/4.jpg', caption: 'Iluminación de pista y áreas circundantes' },
        { img: 'assets/proyectos/3.jpg', caption: 'Escenario cubierto con ópticas directas' }
      ]
    },
    'tuneles-deprimidos': {
      title: 'Túneles y Pasos Deprimidos',
      category: 'Infraestructura Crítica',
      subtitle: 'Sistemas de iluminación de transición y zona interior para evitar el efecto "agujero negro" y garantizar la máxima seguridad en accesos vehiculares subterráneos.',
      heroImg: 'assets/proyectos/3.jpg',
      badges: [
        { icon: 'fa-road', text: 'CIE 88 / RETILAP Túneles' },
        { icon: 'fa-sun', text: 'Control Adaptativo Lth' },
        { icon: 'fa-battery-full', text: 'Respaldo UPS Ininterrumpido' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP & Norma CIE 88', sub: 'Control riguroso de luminancia de acceso L20 y contraste visual' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '70W - 240W Modular', sub: 'Atenuación dinámica en tiempo real según luminancímetro exterior' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '145 - 160 lm/W', sub: 'Módulos sellados herméticamente contra gases corrosivos y hollín' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Contraluz (Counter-Beam)', sub: 'Silueteado nítido de obstáculos frente a los faros del vehículo' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK10 / Acero Inox', sub: 'Soportes en acero AISI 316 resistentes a lavado a alta presión' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Control Scada Industrial', sub: 'Sensores de CO/humo acoplados al régimen de ventilación y luz' }
      ],
      editorialTitle: 'Seguridad Visual Extrema y Adaptación Lumínica Continua',
      editorial: [
        'El paso a través de túneles y deprimidos vehiculares representa una de las condiciones visuales más exigentes para el ojo humano. La adaptación entre la intensa luz diurna exterior y el interior del túnel requiere una curva de luminancia gradual en la zona de umbral para evitar la ceguera temporal momentánea.',
        'Implementamos tecnologías con luminancímetros exteriores que leen la luminancia diurna natural y modulan automáticamente la potencia de las primeras filas de proyectores. Así, a pleno mediodía la entrada cuenta con máxima luminancia, mientras que en la noche se reduce para no encandilar.',
        'La durabilidad de los equipos se garantiza mediante envolventes de acero inoxidable y ópticas de vidrio templado a prueba de gases de combustión, polvo y lavados periódicos con agua a presión desinfectante.'
      ],
      highlights: [
        'Sistemas de emergencia con baterías y conmutación automática en milisegundos.',
        'Guía óptica con balizas LED laterales para orientación en caso de humo.',
        'Cableado con aislamiento libre de halógenos y baja emisión de humos tóxicos (LSZH).',
        'Mantenimiento rápido mediante conectores macho-hembra IP68 plug & play.'
      ],
      gallery: [
        { img: 'assets/proyectos/3.jpg', caption: 'Deprimido vehicular con distribución continua counter-beam' },
        { img: 'assets/alumbrado/footer.webp', caption: 'Aproximación y rampa de acceso iluminada' },
        { img: 'assets/proyectos/9.jpg', caption: 'Paso a desnivel urbano con iluminación cenital' },
        { img: 'assets/proyectos/4.jpg', caption: 'Bocas de túnel con transición óptica regulada' }
      ]
    },
    'logistica-suministros': {
      title: 'Puertos y Logística Masiva',
      category: 'Sector Industrial',
      subtitle: 'Iluminación de grandes áreas para patios de contenedores, muelles marítimos y centros de distribución con operación ininterrumpida 24/7.',
      heroImg: 'assets/suministros/pasillo2.jpg',
      badges: [
        { icon: 'fa-anchor', text: 'Resistencia Salina C5-M' },
        { icon: 'fa-arrows-up-down', text: 'Torres High-Mast 30m' },
        { icon: 'fa-shield-halved', text: 'Disponibilidad 99.9%' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP Áreas Industriales y Portuarias', sub: 'Uniformidad en planos verticales para lectura de contenedores' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '400W - 1500W High-Mast', sub: 'Instalación en coronas móviles de 25m a 40m de altura' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '155 - 170 lm/W', sub: 'Reducción radical de carga térmica y consumo en subestaciones' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Asimétrica Extensa y Proyección Dirigida', sub: 'Superación de sombras generadas por grúas pórtico y apilamientos' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP67 / IK09 / C5-M Marino', sub: 'Tratamiento anticorrosivo para ambientes marinos e industriales severos' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Gestión Centralizada BMS/WMS', sub: 'Programación de cuadrantes según rutas operativas activas' }
      ],
      editorialTitle: 'Operación Ininterrumpida 24/7 en Grandes Superficies Logísticas',
      editorial: [
        'Las operaciones portuarias y los patios logísticos no descansan jamás. En estos entornos gigantescos, la visibilidad clara es un factor directo de productividad y supervivencia: maquinaria pesada, camiones articulados y grúas operan simultáneamente en espacios compartidos.',
        'Electroingeniería suministra e instala sistemas de gran altura (High-Mast) con coronas de descenso motorizado, permitiendo realizar el mantenimiento preventivo a nivel de piso con total seguridad para el personal técnico y sin interrumpir la operación portuaria.',
        'Nuestras soluciones cuentan con recubrimientos especiales para resistir la niebla salina más agresiva y vientos huracanados, protegiendo las inversiones de los operadores logísticos de Colombia.'
      ],
      highlights: [
        'Coronas de descenso electromecánico que eliminan el uso de grúas canastilla costosas.',
        'Excelente reproducción cromática para inspección de precintos y códigos de carga.',
        'Resistencia a sobretensiones atmosféricas en zonas de alto nivel ceráunico.',
        'Disminución de hasta un 65% en costos de energía comparado con halogenuros metálicos.'
      ],
      gallery: [
        { img: 'assets/suministros/pasillo2.jpg', caption: 'Patio logístico e iluminación de gran área' },
        { img: 'assets/proyectos/8.jpg', caption: 'Plataforma de maniobra y muelles de carga' },
        { img: 'assets/alumbrado/Gemini_Generated_Image_c6goduc6goduc6go.jpg', caption: 'Centro de distribución y bodegas de almacenamiento' },
        { img: 'assets/proyectos/2.jpg', caption: 'Torres de iluminación perimetral para patios' }
      ]
    },
    'aerodromos-terminales': {
      title: 'Aeródromos y Terminales',
      category: 'Transporte Aéreo & Terrestre',
      subtitle: 'Iluminación de plataformas de aeronaves, bahías de abordaje y terminales de transporte con estricto apego a normas OACI y confort visual para pilotos.',
      heroImg: 'assets/proyectos/4.jpg',
      badges: [
        { icon: 'fa-plane', text: 'Norma OACI Anexo 14' },
        { icon: 'fa-eye-slash', text: 'ULOR = 0% (Cut-off Total)' },
        { icon: 'fa-tower-broadcast', text: 'Libre de Interferencia EMI' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'OACI Anexo 14 & RETILAP', sub: 'Cero emisión lumínica por encima de la horizontal (ULOR = 0%)' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '250W - 800W Proyector', sub: 'Control óptico preciso hacia la superficie de rodadura' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '150 - 165 lm/W', sub: 'Calidad de luz blanca que optimiza la visibilidad de los inspectores' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Asimétrica Forward-Throw Plana', sub: 'Haces confinados estrictamente a las bahías de parqueo' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK09', sub: 'Resistente a vibraciones por propulsión a chorro de turbinas' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Integración con Torre de Control', sub: 'Atenuación remota según itinerarios de arribo y despegue' }
      ],
      editorialTitle: 'Precisión Fotométrica y Seguridad Aeronáutica Internacional',
      editorial: [
        'En las plataformas de aeropuertos y terminales de pasajeros, el requerimiento principal es la compatibilidad visual absoluta con las maniobras de carreteo y aproximación de aeronaves. Un solo reflejo deslumbrante hacia la cabina del piloto o la torre de control puede causar un incidente grave.',
        'Por esta razón, la ingeniería de Electroingeniería emplea proyectores con tecnología de corte óptico total (sharp cut-off) y viseras antideslumbrantes diseñadas a la medida. La luz se confina exactamente donde el personal de tierra realiza el reabastecimiento, embarque y mantenimiento de aeronaves.',
        'Nuestros postes y estructuras metálicas se calculan y certifican para soportar ráfagas de viento extremas y vibraciones cíclicas generadas por el flujo de reactores en pista.'
      ],
      highlights: [
        'Cumplimiento total con los lineamientos de la Aeronáutica Civil y OACI.',
        'Protección contra interferencias electromagnéticas (normas EMI/EMC).',
        'Sistemas de balizamiento de obstáculos de media y baja intensidad en mástiles.',
        'Excelente uniformidad en el plano vertical para inspección de trenes de aterrizaje.'
      ],
      gallery: [
        { img: 'assets/proyectos/4.jpg', caption: 'Plataforma de maniobras y terminal de pasajeros' },
        { img: 'assets/proyectos/8.jpg', caption: 'Zona de parqueo y abordaje de aeronaves' },
        { img: 'assets/proyectos/3.jpg', caption: 'Accesos y vialidades perimetrales del aeropuerto' },
        { img: 'assets/alumbrado/footer.webp', caption: 'Corredor vial de acceso rápido a la terminal' }
      ]
    },
    'zonas-peatonales': {
      title: 'Zonas Peatonales y Ciclorrutas',
      category: 'Movilidad Sostenible',
      subtitle: 'Iluminación a escala humana para andenes, bulevares comerciales, ciclovías y paseos ecológicos, creando entornos seguros e integrados a la naturaleza.',
      heroImg: 'assets/proyectos/5.jpg',
      badges: [
        { icon: 'fa-person-walking', text: 'Escala Humana (4m a 6m)' },
        { icon: 'fa-bicycle', text: 'Ciclorrutas Seguras' },
        { icon: 'fa-shield-halved', text: 'RETILAP Clase P1-P4' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP Clases P1 a P4 & Ciclorrutas', sub: 'Iluminación de contraste para detección de desniveles y peatones' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '30W - 60W LED', sub: 'Consumo ultra eficiente con luminarias de baja altura (4 a 6m)' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '140 - 155 lm/W', sub: 'Temperatura cálida 3000K para un entorno caminable y acogedor' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Longitudinal Estrecha Tipo I / Peatonal', sub: 'Canalización lineal de la luz a lo largo del sendero sin dispersión' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK10 Antivandálico', sub: 'Carcasas de fundición de aluminio y pernos de anclaje de seguridad' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Sensores de Movimiento Radar / PIR', sub: 'Aumento de intensidad al detectar aproximación de ciclistas o peatones' }
      ],
      editorialTitle: 'Entornos Caminables, Amables y Protegidos para la Ciudadanía',
      editorial: [
        'Las ciudades modernas ponen al peatón y al ciclista en el centro del diseño urbano. Sin embargo, los senderos oscuros o deficientemente iluminados generan temor, aislamiento y abandono del espacio público durante las horas de la noche.',
        'Electroingeniería diseña redes de iluminación peatonal con luminarias montadas a baja altura que bañan el suelo de forma continua y suave. Se eliminan las sombras profundas producidas por la vegetación circundante y se logra una visión nítida de rostros y superficies, propiciando la caminata nocturna y el deporte al aire libre.',
        'La integración opcional de sensores de presencia inteligente permite que la iluminación se mantenga en un nivel basal de descanso energético cuando no hay tránsito y se eleve suavemente al 100% al detectar la llegada de personas.'
      ],
      highlights: [
        'Distribución lineal continua sin efecto "cebra" ni manchones de luz intermitentes.',
        'Postes ornamentales de diseño estilizado que complementan el paisajismo municipal.',
        'Redes subterráneas con cajas de inspección herméticas y tapas de seguridad.',
        'Fomento del comercio barrial nocturno y la vida comunitaria saludable.'
      ],
      gallery: [
        { img: 'assets/proyectos/5.jpg', caption: 'Sendero peatonal y ciclorruta arborizada' },
        { img: 'assets/proyectos/1.jpg', caption: 'Paseo cívico en centro histórico' },
        { img: 'assets/alumbrado/Gemini_Generated_Image_c6goduc6goduc6go.jpg', caption: 'Andén urbano remodelado con iluminación LED 3000K' },
        { img: 'assets/proyectos/7.jpg', caption: 'Paseo cultural nocturno' }
      ]
    },
    'corredores-rurales': {
      title: 'Alumbrado en Corredores Rurales e Intermunicipales',
      category: 'Intermunicipal',
      subtitle: 'Extensión y modernización de redes de alumbrado público en vías intermunicipales y veredas, mejorando la seguridad ciudadana y la conectividad vial nocturna.',
      heroImg: 'assets/proyectos/6.jpg',
      badges: [
        { icon: 'fa-road', text: 'Conectividad Rural' },
        { icon: 'fa-shield-halved', text: 'Blindaje Contra Sobretensiones' },
        { icon: 'fa-lightbulb', text: 'Tecnología LED RETILAP' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP & RETIE', sub: 'Seguridad en redes aéreas de baja y media tensión' },
        { icon: 'fa-bolt', label: 'Potencia de Luminaria', value: '60W - 120W LED', sub: 'Fotometría de precisión para curvas y tramos abiertos' },
        { icon: 'fa-tower-broadcast', label: 'Infraestructura de Red', value: 'Conductores ACSR & Postería', sub: 'Líneas reforzadas para soportar intemperie severa' },
        { icon: 'fa-shield-halved', label: 'Supresor de Sobretensión', value: 'DPS 10 kV / 10 kA', sub: 'Protección contra descargas atmosféricas rurales' },
        { icon: 'fa-shield-virus', label: 'Grado de Protección', value: 'IP66 / IK09', sub: 'Hermeticidad frente a polvo, humedad y lluvias intensas' },
        { icon: 'fa-clock', label: 'Disponibilidad de Red', value: 'Operación Continua 99.8%', sub: 'Monitoreo y mantenimiento con cuadrillas técnicas de zona' }
      ],
      editorialTitle: 'Seguridad y Conectividad en Vías Regionales e Interveredales',
      editorial: [
        'En Colombia, los corredores rurales, accesos a veredas y puentes intermunicipales requieren infraestructura eléctrica fiable capaz de superar las distancias y los desafíos topográficos.',
        'Electroingeniería S.A.S. implementa soluciones integrales de electrificación y alumbrado público: tendido de cables de aluminio y cobre certificados, postería de concreto o metálica, y luminarias LED de bajo consumo con protección robusta contra descargas atmosféricas.',
        'Cada proyecto se ejecuta bajo estrictos protocolos RETIE y RETILAP, asegurando una visibilidad homogénea en carretera, previniendo accidentes y fortaleciendo la tranquilidad y el desarrollo socioeconómico de las comunidades rurales.'
      ],
      highlights: [
        'Mejora sustancial en la seguridad de transportadores y habitantes locales.',
        'Luminarias LED con disipación térmica optimizada y vida útil superior a 100.000 horas.',
        'Materiales homologados con dictamen CIDET para larga vida en campo.',
        'Atención de contingencias e inspecciones periódicas de mantenimiento.'
      ],
      gallery: [
        { img: 'assets/proyectos/6.jpg', caption: 'Corredor intermunicipal con luminarias LED de alta visibilidad' },
        { img: 'assets/proyectos/5.jpg', caption: 'Tramo rural iluminado con redes de baja tensión' },
        { img: 'assets/alumbrado/footer.webp', caption: 'Vía de acceso regional con infraestructura modernizada' },
        { img: 'assets/proyectos/8.jpg', caption: 'Intersección vial con iluminación eficiente' }
      ]
    },
    'iluminacion-arquitectonica': {
      title: 'Iluminación Arquitectónica y Monumental',
      category: 'Patrimonio & Fachadas',
      subtitle: 'Puesta en valor de catedrales, puentes emblemáticos, monumentos y edificios cívicos mediante iluminación escénica y realce volumétrico.',
      heroImg: 'assets/proyectos/7.jpg',
      badges: [
        { icon: 'fa-monument', text: 'Realce de Patrimonio' },
        { icon: 'fa-palette', text: 'RGBW Dinámico & DMX512' },
        { icon: 'fa-shield-halved', text: 'Protección Grado IP67' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP Monumental & Artístico', sub: 'Respeto absoluto a la integridad del bien de interés cultural (BIC)' },
        { icon: 'fa-bolt', label: 'Potencia de Proyectores', value: '24W - 300W LED Arquitectónico', sub: 'Control cromático de alta precisión sin fuga de luz residual' },
        { icon: 'fa-palette', label: 'Gama Cromática', value: 'RGBW / Tunable White (2200K - 6500K)', sub: 'Mezcla de color suave y homogénea de 4 canales independientes' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Lentes Elípticos y Wall-Washer', sub: 'Haz rasante para resaltar texturas, cornisas y capiteles' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP67 / IK08 / Vidrio Templado', sub: 'Luminarias sumergibles o de intemperie con anclajes discretos' },
        { icon: 'fa-tower-cell', label: 'Protocolo de Control', value: 'DMX512 / RDM / Art-Net', sub: 'Sincronización de espectáculos de color para festividades patrias' }
      ],
      editorialTitle: 'Puesta en Valor del Patrimonio y Arte Lumínico Nocturno',
      editorial: [
        'La iluminación monumental transforma el patrimonio arquitectónico en el ícono identitario de una región. Más que iluminar una pared, la ingeniería artística de la luz esculpe sombras, acentúa la profundidad de arcos y frisos, y resalta la nobleza de los materiales históricos como la piedra, el ladrillo o la madera.',
        'En Electroingeniería abordamos estos proyectos con la mayor delicadeza patrimonial: los cables y luminarias se mimetizan con las molduras del edificio mediante pintura electrostática personalizada, empleando fijaciones que no deterioran la estructura histórica.',
        'Nuestros sistemas permiten programar escenas luminosas conmemorativas: blanco cálido y solemne para el funcionamiento habitual diario, y paletas cromáticas especiales para fechas patrias, festivales cívicos o campañas de concientización ciudadana.'
      ],
      highlights: [
        'Luminarias de diseño ultra-compacto que no alteran la estética diurna del monumento.',
        'Ópticas rasantes que evitan el deslumbramiento de transeúntes y conductores.',
        'Programación de cronogramas astronómicos para encendido y apagado automatizado.',
        'Protección contra rayos UV e infrarrojos para proteger pinturas y materiales milenarios.'
      ],
      gallery: [
        { img: 'assets/proyectos/7.jpg', caption: 'Fachada de templo histórico con iluminación rasante' },
        { img: 'assets/alumbrado-navideno/1.jpg', caption: 'Intervención lumínica escénica en plaza central' },
        { img: 'assets/proyectos/1.jpg', caption: 'Realce volumétrico de fuentes y elementos cívicos' },
        { img: 'assets/proyectos/3.jpg', caption: 'Puente emblemático con iluminación de acento' }
      ]
    },
    'parqueaderos-comerciales': {
      title: 'Parqueaderos y Plazas Comerciales',
      category: 'Comercio & Servicios',
      subtitle: 'Iluminación de alta eficiencia para áreas de estacionamiento abiertas y subterráneas, facilitando la fluidez vehicular y la seguridad del usuario.',
      heroImg: 'assets/proyectos/8.jpg',
      badges: [
        { icon: 'fa-square-parking', text: 'RETILAP Áreas Comerciales' },
        { icon: 'fa-arrows-split-up-and-left', text: 'Óptica Tipo V Cuadrada' },
        { icon: 'fa-bolt', text: 'Sensor Bi-Level Integrado' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Aplicable', value: 'RETILAP & NTC 2050', sub: 'Uniformidad horizontal mínima Emin/Eprom > 0.33' },
        { icon: 'fa-bolt', label: 'Potencia de Operación', value: '60W - 150W LED', sub: 'Control con sensores de ocupación de microondas integrados' },
        { icon: 'fa-gauge-high', label: 'Eficacia Lumínica', value: '150 - 165 lm/W', sub: 'Reducción de consumo hasta del 70% frente a campanas tradicionales' },
        { icon: 'fa-arrows-split-up-and-left', label: 'Distribución Óptica', value: 'Tipo V Cuadrada / Circular', sub: 'Distribución simétrica de amplio radio para separación amplia de postes' },
        { icon: 'fa-shield-halved', label: 'Grado de Protección', value: 'IP66 / IK08', sub: 'Carcasas de fundición con recubrimiento en polvo termoendurecible' },
        { icon: 'fa-tower-cell', label: 'Telegestión & Control', value: 'Atenuación Bi-Level (20% / 100%)', sub: 'Ahorro dinámico durante las horas de bajo flujo de clientes' }
      ],
      editorialTitle: 'Confort Visual, Seguridad y Eficiencia en Estacionamientos',
      editorial: [
        'Un parqueadero comercial bien iluminado es el primer punto de contacto positivo para los clientes de un centro comercial, hospital, campus universitario o hipermercado. Una iluminación clara transmite de inmediato tranquilidad, orden y confianza en las instalaciones.',
        'Nuestros diseños aprovechan la óptica de distribución Tipo V cuadrada, la cual permite colocar los postes a mayor distancia entre sí cubriendo una cuadrícula regular de cajones de parqueo sin generar sombras oscuras entre vehículos estacionados.',
        'Adicionalmente, incorporamos sensores de movimiento de alta sensibilidad con tecnología bi-level: la iluminación se mantiene a un 20% de su potencia de manera preventiva y sube instantáneamente al 100% al detectar la aproximación de un vehículo o peatón, reduciendo la factura energética al mínimo.'
      ],
      highlights: [
        'Iluminación sin puntos ciegos, facilitando la captura nítida en cámaras CCTV.',
        'Reducción sustancial del número de postes requeridos gracias al haz óptico amplio.',
        'Brazos de montaje dobles y cuádruples en mástiles de 9 a 12 metros.',
        'Disipación térmica optimizada para climas cálidos y alta radiación diurna.'
      ],
      gallery: [
        { img: 'assets/proyectos/8.jpg', caption: 'Parqueadero comercial con distribución cuadrada de luz' },
        { img: 'assets/proyectos/9.jpg', caption: 'Vía de circunvalación y accesos a centro comercial' },
        { img: 'assets/alumbrado/footer.webp', caption: 'Bahías de desaceleración y casetas de control' },
        { img: 'assets/proyectos/2.jpg', caption: 'Plaza de estacionamiento perimetral' }
      ]
    },
    'cuadrillas-operativas': {
      title: 'Cuadrillas Operativas & Mantenimiento',
      category: 'Operación & Gestión de Red',
      subtitle: 'Flota propia de vehículos canastilla, herramientas certificadas dieléctricas y técnicos RETIE/RETILAP para mantenimiento preventivo y correctivo 24/7.',
      heroImg: 'assets/alumbrado/Gemini_Generated_Image_c6goduc6goduc6go.jpg',
      badges: [
        { icon: 'fa-truck-front', text: 'Canastillas Aisladas 46kV' },
        { icon: 'fa-stopwatch', text: 'Atención PQR < 24h' },
        { icon: 'fa-headset', text: 'Disponibilidad 24/7' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa de Seguridad', value: 'Resolución 5018 / RETIE', sub: 'Personal certificado en alturas y trabajo en tensión eléctrica' },
        { icon: 'fa-truck-front', label: 'Flota de Mantenimiento', value: 'Grúas Canastilla Hidráulicas', sub: 'Brazos articulados y telescópicos con aislamiento dieléctrico' },
        { icon: 'fa-clipboard-check', label: 'Gestión Operativa', value: 'App Móvil con Censo Georreferenciado', sub: 'Registro fotográfico y cierre en tiempo real de cada orden de PQR' },
        { icon: 'fa-stopwatch', label: 'Tiempo de Respuesta', value: 'Atención PQR < 24 - 48h', sub: 'Rutas diarias programadas para mantenimiento preventivo masivo' },
        { icon: 'fa-shield-halved', label: 'Equipamiento Técnico', value: 'Herramientas Dieléctricas Certificadas', sub: 'Equipos de medición de aislamiento, pinzas de fuga y telurómetros' },
        { icon: 'fa-headset', label: 'Canal de Atención', value: 'Líneas PBX y Sedes Locales', sub: 'Atención ciudadana permanente y coordinación con alcaldías' }
      ],
      editorialTitle: 'Capacidad Operativa Propia y Confiabilidad en el Servicio',
      editorial: [
        'La infraestructura de alumbrado público solo es tan confiable como el equipo humano y técnico que la mantiene en funcionamiento día tras día. En Electroingeniería no tercerizamos el mantenimiento: contamos con personal propio de ingenieros, técnicos linieros y vehículos especializados desplegados permanentemente en cada municipio concesionado.',
        'Cada cuadrilla opera con vehículos tipo canastilla aislados, dotados de herramientas calibradas y repuestos originales de fábrica en stock permanente. Gracias a nuestra plataforma digital de gestión georreferenciada (GIS), cada luminaria reparada se actualiza en el censo municipal con coordenadas GPS exactas, fecha, tipo de intervención y técnico responsable.',
        'Este rigor operativo nos permite mantener índices de disponibilidad operativa superiores al 99.8% a lo largo de los contratos de concesión, superando ampliamente las exigencias contractuales y regulatorias de la CREG y las administraciones públicas.'
      ],
      highlights: [
        'Mantenimiento preventivo cíclico: limpieza de difusores, ajuste de bornes y revisión de tierras.',
        'Respuesta prioritaria en puntos críticos de seguridad o avenidas de alto flujo.',
        'Plan de contingencia ante tormentas eléctricas y caída de ramas sobre líneas.',
        'Compromiso ambiental con la disposición final certificada de lámparas de desecho.'
      ],
      gallery: [
        { img: 'assets/alumbrado/Gemini_Generated_Image_c6goduc6goduc6go.jpg', caption: 'Cuadrilla técnica en maniobra de canastilla en vía principal' },
        { img: 'assets/suministros/pasillo2.jpg', caption: 'Centro de acopio de materiales y repuestos de reposición' },
        { img: 'assets/proyectos/9.jpg', caption: 'Inspección nocturna de fotometría en terreno' },
        { img: 'assets/alumbrado/footer.webp', caption: 'Mantenimiento preventivo en autopista nacional' }
      ]
    },
    'alumbrado-navideno': {
      title: 'Alumbrado Navideño y Monumental',
      category: 'Temporadas Especiales & Arte',
      subtitle: 'Diseño, fabricación artesanal y montaje integral de espectáculos lumínicos monumentales que dinamizan el turismo, el comercio y el espíritu familiar.',
      heroImg: 'assets/alumbrado-navideno/1.jpg',
      badges: [
        { icon: 'fa-wand-magic-sparkles', text: 'Diseño 100% a la Medida' },
        { icon: 'fa-leaf', text: 'Micro-LED de Ultra Bajo Consumo' },
        { icon: 'fa-shield-halved', text: 'Montaje Certificado RETIE' }
      ],
      specs: [
        { icon: 'fa-certificate', label: 'Normativa Técnica', value: 'RETIE & Seguridad en Intemperie', sub: 'Tableros herméticos con protección diferencial de alta sensibilidad' },
        { icon: 'fa-palette', label: 'Conceptualización', value: 'Temáticas de Identidad Regional', sub: 'Diseño 3D previo y modelado de figuras monumentales' },
        { icon: 'fa-industry', label: 'Fabricación Estructural', value: 'Estructuras Metálicas Soldadas', sub: 'Mano de obra artesanal local con acabados resistentes a vientos' },
        { icon: 'fa-leaf', label: 'Tecnología Lumínica', value: 'Micro-LED de Ultra Bajo Consumo', sub: 'Mangueras luminosas y nodos RGB programables IP67' },
        { icon: 'fa-shield-halved', label: 'Seguridad Ciudadana', value: 'Sistemas Anti-Descarga y Polo a Tierra', sub: 'Aislamiento total al alcance de niños y familias visitantes' },
        { icon: 'fa-clock', label: 'Operación & Desmonte', value: 'Turnos de Guardias Nocturnas', sub: 'Mantenimiento diario durante la temporada y desmonte ordenado' }
      ],
      editorialTitle: 'Magia Visual, Dinamización Comercial y Tradición Familiar',
      editorial: [
        'El alumbrado navideño es una de las expresiones más esperadas por las familias y los comerciantes de cada ciudad. Convierte parques, plazas y bulevares en polos de atracción turística que impulsan la economía local y generan orgullo de pertenencia comunitaria.',
        'En Electroingeniería abordamos el proyecto navideño desde la fase cero: conceptualizamos una historia visual coherente con la fauna, flora y tradiciones de cada municipio. Construimos figuras monumentales de hasta 12 metros de altura empleando varilla de hierro forjada y forrada en materiales reflectantes, decorada con miles de micro-LEDs de bajo consumo energético.',
        'Durante todo el mes de exhibición, disponemos de guardias técnicas permanentes que inspeccionan los circuitos diariamente antes del encendido para garantizar que todas las figuras brillen con esplendor y con la máxima seguridad para los miles de peatones que las disfrutan.'
      ],
      highlights: [
        'Generación masiva de empleo directo para madres cabeza de familia y artesanos locales.',
        'Túneles de luz interactivos con secuencias musicales dinámicas.',
        'Ahorro de más del 80% en energía comparado con las mangueras incandescentes tradicionales.',
        'Servicio llave en mano: diseño, fabricación, montaje, operación, desmonte y almacenamiento.'
      ],
      gallery: [
        { img: 'assets/alumbrado-navideno/1.jpg', caption: 'Parque principal decorado con figuras monumentales' },
        { img: 'assets/alumbrado-navideno/2.jpg', caption: 'Túnel lumínico interactivo de alta concurrencia' },
        { img: 'assets/proyectos/1.jpg', caption: 'Iluminación de árboles y fuentes de agua cívicas' },
        { img: 'assets/proyectos/7.jpg', caption: 'Fachada de catedral intervenida con motivos navideños' }
      ]
    }
  };

  // Función de renderizado para proyecto-detalle.html
  function renderProjectDetail() {
    const titleEl = document.getElementById('project-title');
    if (!titleEl) return; // No estamos en proyecto-detalle.html

    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('id');
    const project = (slug && proyectosData[slug]) ? proyectosData[slug] : proyectosData['carreteras-autopistas'];

    // 1. Título de página y Hero
    document.title = `${project.title} | Alumbrado Público - Electroingeniería S.A.S.`;
    titleEl.textContent = project.title;

    const categoryEl = document.getElementById('project-category');
    if (categoryEl) {
      categoryEl.innerHTML = `<i class="fa-solid fa-layer-group"></i> ${project.category}`;
    }

    const subtitleEl = document.getElementById('project-subtitle');
    if (subtitleEl) {
      subtitleEl.textContent = project.subtitle;
    }

    const heroBgEl = document.getElementById('project-hero-bg');
    if (heroBgEl && project.heroImg) {
      heroBgEl.style.backgroundImage = `url('${project.heroImg}')`;
    }

    // 2. Badges del Hero
    const badgesContainer = document.getElementById('project-badges');
    if (badgesContainer && project.badges) {
      badgesContainer.innerHTML = project.badges.map(b => `
        <span class="detail-badge-item"><i class="fa-solid ${b.icon}"></i> ${b.text}</span>
      `).join('');
    }

    // 3. Ficha Técnica / Grilla de Especificaciones
    const specsGrid = document.getElementById('project-specs-grid');
    if (specsGrid && project.specs) {
      specsGrid.innerHTML = project.specs.map(spec => `
        <div class="spec-card-pro">
          <div class="spec-card-icon">
            <i class="fa-solid ${spec.icon}"></i>
          </div>
          <div class="spec-card-body">
            <h4>${spec.label}</h4>
            <p>${spec.value}</p>
            <small>${spec.sub}</small>
          </div>
        </div>
      `).join('');
    }

    // 4. Memoria Técnica / Editorial
    const editorialHeadlineEl = document.getElementById('editorial-headline');
    if (editorialHeadlineEl && project.editorialTitle) {
      editorialHeadlineEl.textContent = project.editorialTitle;
    }

    const editorialMain = document.getElementById('project-editorial-main');
    if (editorialMain && project.editorial) {
      editorialMain.innerHTML = project.editorial.map(p => `<p>${p}</p>`).join('');
    }

    const highlightsList = document.getElementById('project-highlights-list');
    if (highlightsList && project.highlights) {
      highlightsList.innerHTML = project.highlights.map(h => `
        <li><i class="fa-solid fa-circle-check"></i> <span>${h}</span></li>
      `).join('');
    }

    // 5. Galería de Fotos del Proyecto
    const galleryGrid = document.getElementById('project-gallery-grid');
    if (galleryGrid && project.gallery) {
      galleryGrid.innerHTML = project.gallery.map(g => `
        <div class="detail-gallery-item" title="${g.caption}">
          <img src="${g.img}" alt="${g.caption}" loading="lazy" decoding="async">
        </div>
      `).join('');
    }
  }

  // Ejecutar renderizado
  renderProjectDetail();

  /* ==========================================================================
     OBSERVADOR DE REVEAL LATERAL ESCALONADO
     ========================================================================== */
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-left');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback inmediato para navegadores antiguos
      revealElements.forEach(el => el.classList.add('is-revealed'));
    }
  }

  // Ejecutar observador de revelado
  initScrollReveal();

  /* ==========================================================================
     CONTROL DE MICRO-SLIDERS EN TARJETAS DE CIUDADES
     ========================================================================== */
  document.querySelectorAll('.city-slider-card').forEach(card => {
    const slides = card.querySelectorAll('.city-slide');
    const nextBtn = card.querySelector('.city-nav-btn.next');
    const prevBtn = card.querySelector('.city-nav-btn.prev');
    let currentIndex = 0;

    if (slides.length <= 1) {
      if (nextBtn) nextBtn.style.display = 'none';
      if (prevBtn) prevBtn.style.display = 'none';
      return;
    }

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });
  });

  /* ==========================================================================
     CATÁLOGO INTERACTIVO DE SUMINISTROS (FILTROS, BUSCADOR, MODAL Y RFQ)
     ========================================================================== */
  const catalogGrid = document.getElementById('catalogProductGrid');
  if (catalogGrid) {
    const productCards = catalogGrid.querySelectorAll('.product-card');
    const searchInput = document.getElementById('catalogSearchInput');
    const filterPills = document.querySelectorAll('#catalogFilters .catalog-pill');
    let activeCategory = 'all';

    function filterProducts() {
      const query = (searchInput?.value || '').toLowerCase().trim();
      let visibleCount = 0;

      productCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const specs = (card.getAttribute('data-specs') || '').toLowerCase();
        const text = card.textContent.toLowerCase();

        const matchesCat = (activeCategory === 'all' || cat === activeCategory);
        const matchesQuery = !query || name.includes(query) || specs.includes(query) || text.includes(query);

        if (matchesCat && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const countAll = document.getElementById('countAll');
      if (countAll && activeCategory === 'all' && !query) {
        countAll.textContent = productCards.length;
      }
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category');
        filterProducts();
      });
    });

    searchInput?.addEventListener('input', filterProducts);

    /* Modal de Ficha Técnica */
    const modalBackdrop = document.getElementById('techModalBackdrop');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalCode = document.getElementById('modalCode');
    const modalDesc = document.getElementById('modalDesc');
    const modalSpecsBody = document.getElementById('modalSpecsBody');
    const modalQuoteBtn = document.getElementById('modalQuoteBtn');

    const techSheetDetails = {
      'EI-CND-ACSR': {
        desc: 'Conductores y cables de cobre electrolítico y aluminio (AAC, AAAC, ACSR) desnudos y aislados en XLPE para líneas de transmisión, subtransmisión, distribución y circuitos de fuerza industrial.',
        specs: [
          ['Calibres Disponibles', '#12 AWG a 500 MCM y 750 kcmil'],
          ['Material del Conductor', 'Cobre electrolítico blando 99.9% / Aluminio grado EC / Refuerzo de acero galvanizado (ACSR)'],
          ['Aislamiento Dieléctrico', 'Polietileno reticulado (XLPE) 90°C o Polietileno de Alta Densidad (PEAD)'],
          ['Tensión Nominal de Operación', 'Baja Tensión (600V) y Media Tensión (15 kV a 35 kV apantallado)'],
          ['Resistencia Ambiental', 'Resistente a la intemperie (Weather Resistant), humedad y rayos UV'],
          ['Capacidad de Corriente', 'Alta conductividad y disipación térmica para servicio continuo'],
          ['Certificación Oficial', 'Dictamen de conformidad CIDET y RETIE bajo normas ASTM B231, B232, NTC 1818']
        ]
      },
      'EI-ALM-THHN': {
        desc: 'Alambres eléctricos sólidos monofilamento fabricados en cobre electrolítico de temple suave y aleación de aluminio eléctrico para acometidas residenciales, canalizaciones conduit, tableros y sistemas de puesta a tierra.',
        specs: [
          ['Calibres Comerciales', '#14, #12, #10 y #8 AWG sólidos'],
          ['Material Conductor', 'Cobre recocido 99.9% IACS o Aluminio grado eléctrico serie 8000'],
          ['Aislamiento Termoplástico', 'PVC retardante a la llama con chaqueta de poliamida (Nylon)'],
          ['Tensión Máxima de Servicio', '600 Voltios'],
          ['Temperatura de Operación', '90°C en ambientes secos y húmedos (THHN / THWN-2)'],
          ['Facilidad de Instalación', 'Excelente flexibilidad al curvado en ducterías y bajo coeficiente de fricción'],
          ['Certificación Oficial', 'Sello de calidad CIDET y RETIE bajo norma NTC 1332 / UL 83']
        ]
      },
      'EI-LED-ALU': {
        desc: 'Luminaria LED de alta presión fotométrica certificada bajo el Reglamento Técnico de Iluminación y Alumbrado Público (RETILAP). Diseñada con disipador térmico aerodinámico para climas cálidos y tropicales colombianos.',
        specs: [
          ['Rango de Potencia', '60W, 90W, 120W, 150W, 180W, 240W'],
          ['Eficacia Lumínica', '160 lm/W reales'],
          ['Vida Útil (L70B50)', '> 100,000 horas @ 25°C'],
          ['Grado de Hermeticidad', 'IP66 completo (Óptica y Driver)'],
          ['Resistencia al Impacto', 'IK09 mecánico'],
          ['Supresor de Picos (DPS)', '10 kV / 10 kA integrado'],
          ['Protocolos de Control', '0-10V, DALI-2, Conector NEMA 7-pines / Zhaga'],
          ['Certificación Oficial', 'RETILAP con dictamen CIDET vigente']
        ]
      },
      'EI-CBL-ROLL': {
        desc: 'Cables eléctricos presentados en rollos comerciales de 100 metros y bobinas industriales: cable concéntrico antifraude para acometidas monofásicas y trifásicas, conductores dúplex y tríplex para distribución secundaria.',
        specs: [
          ['Presentación Comercial', 'Rollos sellados de 100m, 200m y carretes de madera de 500m/1000m'],
          ['Tipos de Cable', 'Concéntrico Antifraude (Fase + Neutro helicoidal), Dúplex y Tríplex trenzado'],
          ['Material de Conductores', 'Cobre electrolítico o Aluminio 1350-H19'],
          ['Aislamiento y Cubierta', 'Aislamiento XLPE o PVC con cubierta exterior PE resistente a la abrasión'],
          ['Tensión de Servicio', '600 Voltios'],
          ['Aplicaciones Principales', 'Acometidas aéreas desde transformador a medidor, circuitos de alumbrado y derivaciones'],
          ['Certificación Oficial', 'Conformidad RETIE y CIDET bajo normas NTC 4552 / NTC 2050']
        ]
      }
    };

    productCards.forEach(card => {
      const specBtn = card.querySelector('.btn-spec-view');
      const addBtn = card.querySelector('.btn-add-quote');
      const code = card.getAttribute('data-code');
      const name = card.getAttribute('data-name');

      specBtn?.addEventListener('click', () => {
        const details = techSheetDetails[code] || {
          desc: 'Información técnica garantizada bajo normativa RETIE/RETILAP por Electroingeniería S.A.S.',
          specs: [['Garantía', 'Directa de fábrica'], ['Certificación', 'RETIE / RETILAP']]
        };

        if (modalTitle) modalTitle.textContent = name;
        if (modalCode) modalCode.textContent = code;
        if (modalDesc) modalDesc.textContent = details.desc;

        if (modalSpecsBody) {
          modalSpecsBody.innerHTML = details.specs.map(([label, val]) => `
            <tr>
              <td>${label}</td>
              <td>${val}</td>
            </tr>
          `).join('');
        }

        if (modalQuoteBtn) {
          const encoded = encodeURIComponent(`Hola Electroingeniería, solicito ficha técnica y cotización del material: ${name} (${code})`);
          modalQuoteBtn.href = `https://wa.me/573117194015?text=${encoded}`;
        }

        modalBackdrop?.classList.add('active');
      });

      addBtn?.addEventListener('click', () => {
        addToRfq(code, name);
        addBtn.classList.add('added');
        addBtn.innerHTML = '<i class="fa-solid fa-check"></i> Agregado';
        setTimeout(() => {
          addBtn.classList.remove('added');
          addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Cotizar';
        }, 2000);
      });
    });

    const modalDismissBtn = document.getElementById('modalDismissBtn');
    const closeModal = () => modalBackdrop?.classList.remove('active');
    modalCloseBtn?.addEventListener('click', closeModal);
    modalDismissBtn?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    /* RFQ Drawer & Lista de Cotización */
    const rfqTrigger = document.getElementById('rfqTrigger');
    const rfqDrawer = document.getElementById('rfqDrawer');
    const rfqOverlay = document.getElementById('rfqOverlay');
    const rfqCloseBtn = document.getElementById('rfqCloseBtn');
    const rfqCountBadge = document.getElementById('rfqCountBadge');
    const rfqItemsList = document.getElementById('rfqItemsList');
    const btnRfqWhatsapp = document.getElementById('btnRfqWhatsapp');

    let rfqItems = [];

    function updateRfqUI() {
      if (rfqCountBadge) rfqCountBadge.textContent = rfqItems.length;

      if (!rfqItemsList) return;

      if (rfqItems.length === 0) {
        rfqItemsList.innerHTML = `
          <div style="text-align: center; color: #94A3B8; padding: 40px 10px;">
            <i class="fa-solid fa-cart-arrow-down" style="font-size: 2.5rem; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
            <p style="font-size: 0.95rem; margin: 0;">No has agregado ningún material aún.<br>Haz clic en <strong>"+ Cotizar"</strong> en cualquier producto para incluirlo en tu solicitud.</p>
          </div>
        `;
        if (btnRfqWhatsapp) btnRfqWhatsapp.href = 'https://wa.me/573117194015?text=Hola%20Electroingenier%C3%ADa,%20deseo%20cotizar%20suministros%20el%C3%A9ctricos';
        return;
      }

      rfqItemsList.innerHTML = rfqItems.map((item, idx) => `
        <div class="rfq-item">
          <div>
            <p class="rfq-item-title">${item.name}</p>
            <span class="rfq-item-cat">${item.code}</span>
          </div>
          <button type="button" class="rfq-item-remove" data-index="${idx}" title="Eliminar ítem">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `).join('');

      rfqItemsList.querySelectorAll('.rfq-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(btn.getAttribute('data-index'));
          rfqItems.splice(idx, 1);
          updateRfqUI();
        });
      });

      if (btnRfqWhatsapp) {
        let msg = 'Hola Electroingeniería S.A.S., deseo cotizar la siguiente lista de suministros:\n';
        rfqItems.forEach((it, i) => {
          msg += `${i + 1}. ${it.name} (${it.code})\n`;
        });
        msg += '\nPor favor contactarme con un asesor comercial.';
        btnRfqWhatsapp.href = `https://wa.me/573117194015?text=${encodeURIComponent(msg)}`;
      }
    }

    function addToRfq(code, name) {
      if (!rfqItems.some(item => item.code === code)) {
        rfqItems.push({ code, name });
        updateRfqUI();
      }
      rfqDrawer?.classList.add('active');
      rfqOverlay?.classList.add('active');
    }

    rfqTrigger?.addEventListener('click', () => {
      rfqDrawer?.classList.add('active');
      rfqOverlay?.classList.add('active');
    });

    const closeRfqDrawer = () => {
      rfqDrawer?.classList.remove('active');
      rfqOverlay?.classList.remove('active');
    };

    rfqCloseBtn?.addEventListener('click', closeRfqDrawer);
    rfqOverlay?.addEventListener('click', closeRfqDrawer);
  }

  /* ==========================================================================
     CALCULADORA DE EFICIENCIA Y AHORRO ENERGÉTICO LED (SUMINISTROS)
     ========================================================================== */
  const sliderLuminarias = document.getElementById('sliderLuminarias');
  const selectTecnologia = document.getElementById('selectTecnologia');
  const valLuminarias = document.getElementById('valLuminarias');
  const resPctAhorro = document.getElementById('resPctAhorro');
  const resKwhMes = document.getElementById('resKwhMes');
  const resCo2Ano = document.getElementById('resCo2Ano');

  function updateLedCalculator() {
    if (!sliderLuminarias || !selectTecnologia) return;

    const qty = parseInt(sliderLuminarias.value);
    const oldWatts = parseInt(selectTecnologia.value);
    valLuminarias.textContent = `${qty.toLocaleString('es-CO')} uds`;

    let savedWattsPerLamp = 110;
    let oldTotalWatts = 170;

    if (oldWatts === 70) {
      savedWattsPerLamp = 55;
      oldTotalWatts = 85;
    } else if (oldWatts === 150) {
      savedWattsPerLamp = 110;
      oldTotalWatts = 170;
    } else if (oldWatts === 250) {
      savedWattsPerLamp = 180;
      oldTotalWatts = 280;
    } else if (oldWatts === 400) {
      savedWattsPerLamp = 280;
      oldTotalWatts = 440;
    }

    const pct = ((savedWattsPerLamp / oldTotalWatts) * 100).toFixed(1);
    const kwhMonthly = Math.round((savedWattsPerLamp * qty * 360) / 1000);
    const co2TonsYear = ((kwhMonthly * 12 * 0.164) / 1000).toFixed(1);

    if (resPctAhorro) resPctAhorro.textContent = `${pct}%`;
    if (resKwhMes) resKwhMes.textContent = `${kwhMonthly.toLocaleString('es-CO')} kWh`;
    if (resCo2Ano) resCo2Ano.textContent = `${co2TonsYear} Toneladas`;
  }

  sliderLuminarias?.addEventListener('input', updateLedCalculator);
  selectTecnologia?.addEventListener('change', updateLedCalculator);
  if (sliderLuminarias) updateLedCalculator();

  /* ==========================================================================
     COMPARADOR VISUAL ANTES / DESPUÉS (OBRAS)
     ========================================================================== */
  const baRangeInput = document.getElementById('baRangeInput');
  const baAfterLayer = document.getElementById('baAfterLayer');
  const baHandle = document.getElementById('baHandle');

  if (baRangeInput && baAfterLayer && baHandle) {
    baRangeInput.addEventListener('input', (e) => {
      const val = e.target.value;
      baAfterLayer.style.width = `${val}%`;
      baHandle.style.left = `${val}%`;
    });
  }


  /* ==========================================================================
     FILTRO DE PORTAFOLIO DE OBRAS (OBRAS)
     ========================================================================== */
  const projectFilters = document.querySelectorAll('#projectFilters .catalog-pill');
  const projectCards = document.querySelectorAll('#projectsGrid .project-card');

  projectFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      projectFilters.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     INICIALIZACIÓN SWIPER MODO SCHRÉDER ARCHITECTURAL (.mySchrederSwiper)
     ========================================================================== */
  if (typeof Swiper !== 'undefined' && document.querySelector('.mySchrederSwiper')) {
    const currentCounter = document.getElementById('schreder-current-slide');
    const progressFill = document.getElementById('schreder-progress-fill');
    const totalSlides = 4;

    const updateSliderMetrics = (realIndex) => {
      const activeNumber = (realIndex + 1);
      if (currentCounter) {
        currentCounter.textContent = activeNumber < 10 ? `0${activeNumber}` : activeNumber;
      }
      if (progressFill) {
        const percentage = (activeNumber / totalSlides) * 100;
        progressFill.style.width = `${percentage}%`;
      }
    };

    const swiper = new Swiper('.mySchrederSwiper', {
      slidesPerView: 'auto',
      spaceBetween: 24,
      loop: true,
      speed: 650,
      centeredSlides: false,
      navigation: {
        nextEl: '.swiper-next-btn',
        prevEl: '.swiper-prev-btn',
      },
      grabCursor: true,
      keyboard: {
        enabled: true,
      },
      observer: true,
      observeParents: true,
      watchSlidesProgress: true,
      on: {
        init: function () {
          this.update();
          updateSliderMetrics(this.realIndex || 0);
        },
        slideChange: function () {
          updateSliderMetrics(this.realIndex || 0);
        }
      }
    });
  }

});




