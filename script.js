document.addEventListener('DOMContentLoaded', () => {

  // --- 2. Navbar Scroll Style ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 3. Scroll Reveal (Intersection Observer) ---
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once animated, we don't need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(reveal => {
    revealObserver.observe(reveal);
  });

  // --- 4. Dynamic SVG Scroll Path Animation ---
  const routePath = document.getElementById('route-path');
  const routeHighlightPath = document.getElementById('route-highlight-path');
  const pathMarkers = document.querySelectorAll('.route-svg-marker');
  
  if (routePath) {
    const pathLength = routePath.getTotalLength();
    
    // Set up path dash styles to hide it initially
    routePath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    routePath.style.strokeDashoffset = pathLength;
    
    if (routeHighlightPath) {
      routeHighlightPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
      routeHighlightPath.style.strokeDashoffset = pathLength;
    }
    
    const handleScrollPath = () => {
      const container = document.querySelector('.main-content-flow');
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const containerHeight = containerRect.height;
      
      // Calculate how far down the container the scroll is (from 0 to 1)
      const viewportHeight = window.innerHeight;
      const elementTopRelative = containerRect.top;
      
      // Starts drawing when the container top enters the bottom of screen
      // Ends drawing when container bottom reaches bottom of screen
      let progress = (viewportHeight - elementTopRelative) / (containerHeight + viewportHeight * 0.2);
      
      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress));
      
      // Map progress to dashoffset
      const drawOffset = pathLength * (1 - progress);
      routePath.style.strokeDashoffset = drawOffset;
      
      if (routeHighlightPath) {
        routeHighlightPath.style.strokeDashoffset = drawOffset;
      }
      
      // Activate markers based on drawing progress
      pathMarkers.forEach(marker => {
        const markerProgress = parseFloat(marker.getAttribute('data-progress') || '0');
        if (progress >= markerProgress) {
          marker.classList.add('active');
        } else {
          marker.classList.remove('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScrollPath);
    // Initial run
    handleScrollPath();
  }

  // --- 5. Testimonial Carousel Slider ---
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const btnPrev = document.querySelector('.btn-carousel-nav.prev');
  const btnNext = document.querySelector('.btn-carousel-nav.next');
  
  if (track && cards.length > 0) {
    let currentIndex = 0;
    
    const updateCarousel = () => {
      // Calculate card spacing
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 30; // matching CSS gap
      const offset = currentIndex * (cardWidth + gap);
      
      track.style.transform = `translateX(-${offset}px)`;
      
      // Disable nav buttons if bounds reached
      const visibleCount = getVisibleCardsCount();
      btnPrev.style.opacity = currentIndex === 0 ? '0.4' : '1';
      btnPrev.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
      
      btnNext.style.opacity = currentIndex >= (cards.length - visibleCount) ? '0.4' : '1';
      btnNext.style.pointerEvents = currentIndex >= (cards.length - visibleCount) ? 'none' : 'auto';
    };
    
    const getVisibleCardsCount = () => {
      const width = window.innerWidth;
      if (width <= 600) return 1;
      if (width <= 900) return 2;
      return 3;
    };
    
    btnNext.addEventListener('click', () => {
      const visibleCount = getVisibleCardsCount();
      if (currentIndex < cards.length - visibleCount) {
        currentIndex++;
        updateCarousel();
      }
    });
    
    btnPrev.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });
    
    // Auto-update carousel on window resize to ensure correct pixel dimensions
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Reset index bounds on resize
        const visibleCount = getVisibleCardsCount();
        if (currentIndex > cards.length - visibleCount) {
          currentIndex = Math.max(0, cards.length - visibleCount);
        }
        updateCarousel();
      }, 100);
    });
    
    // Initialize state
    updateCarousel();
  }

  // --- 5.5 Interactive Package Map Switcher ---
  const packagesData = [
    {
      title: "Kashmir Honeymoon",
      rating: "5.0",
      reviews: "(45)",
      price: "₹24,999",
      img: "Kashmir image.png",
      tag: "BEST SELLER"
    },
    {
      title: "Himachal Scenic Escape",
      rating: "4.8",
      reviews: "(32)",
      price: "₹28,750",
      img: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
      tag: "TRENDING"
    },
    {
      title: "Uttarakhand Spiritual Tour",
      rating: "4.9",
      reviews: "(50)",
      price: "₹34,125",
      img: "uttrakhand.png",
      tag: "POPULAR"
    },
    {
      title: "Char Dham Sacred Journey",
      rating: "5.0",
      reviews: "(62)",
      price: "₹46,170",
      img: "chardham.jpg",
      tag: "PILGRIMAGE"
    },
    {
      title: "Manali Adventure Retreat",
      rating: "4.7",
      reviews: "(28)",
      price: "₹15,115",
      img: "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=600&q=80",
      tag: "ADVENTURE"
    }
  ];

  const floatingCards = document.querySelectorAll('.map-floating-card');
  const featuredCard = document.querySelector('.featured-pkg-card');

  if (featuredCard && floatingCards.length > 0) {
    const pkgImg = featuredCard.querySelector('.pkg-img');
    const pkgTag = featuredCard.querySelector('.pkg-tag');
    const pkgTitle = featuredCard.querySelector('.pkg-title');
    const pkgRatingVal = featuredCard.querySelector('.pkg-rating .rating-val');
    const pkgRatingCount = featuredCard.querySelector('.pkg-rating .rating-count');
    const pkgPrice = featuredCard.querySelector('.pkg-price');

    floatingCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all floating cards
        floatingCards.forEach(c => c.classList.remove('active'));
        // Add active to clicked card
        card.classList.add('active');

        // Get index
        const index = parseInt(card.getAttribute('data-index') || '0');
        const data = packagesData[index];

        // Animate transition on featured card
        featuredCard.style.opacity = '0';
        featuredCard.style.transform = 'translateY(10px)';

        setTimeout(() => {
          pkgImg.src = data.img;
          pkgImg.alt = data.title;
          pkgTag.textContent = data.tag;
          pkgTitle.textContent = data.title;
          pkgRatingVal.textContent = data.rating;
          pkgRatingCount.textContent = data.reviews;
          pkgPrice.textContent = data.price;

          featuredCard.style.opacity = '1';
          featuredCard.style.transform = 'translateY(0)';
        }, 300);
      });
    });
  }

  // --- 6. Form Submission / Active States ---
  const bookingForm = document.querySelector('.booking-bar');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const destination = document.getElementById('dest').value;
      const month = document.getElementById('month').value;
      const travelers = document.getElementById('travelers').value;
      
      alert(`Quote request submitted!\nDestination: ${destination}\nTravel Month: ${month}\nTravelers: ${travelers}`);
    });
  }

  // Handle all "Get Free Quote" clicks
  const quoteBtns = document.querySelectorAll('.btn-quote, .btn-booking-submit');
  quoteBtns.forEach(btn => {
    if (btn.tagName !== 'BUTTON' || btn.type !== 'submit') {
      btn.addEventListener('click', () => {
        alert('Thank you for your interest! A customized travel quote will be generated for you.');
      });
    }
  });


  // =============================================
  // === 8.5 INTERACTIVE SCROLL PARALLAX BACKGROUND ===
  // =============================================
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  
  const handleParallaxScroll = () => {
    const scrollY = window.scrollY;
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const heroHeight = hero.offsetHeight;
    if (scrollY > heroHeight) return;
    
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed') || '0');
      if (speed === 0) return;
      
      const yOffset = scrollY * speed;
      layer.style.setProperty('--parallax-y', `${yOffset}px`);
    });
  };
  
  window.addEventListener('scroll', handleParallaxScroll, { passive: true });
  handleParallaxScroll();


  // =============================================
  // === 9. DAY-TO-NIGHT SCROLLING COLOR SHIFT ===
  // =============================================
  const dayNightColors = [
    { r: 250, g: 242, b: 225 },  // Warm sunrise gold
    { r: 245, g: 239, b: 230 },  // Bright parchment (default)
    { r: 235, g: 228, b: 215 },  // Late afternoon amber
    { r: 210, g: 205, b: 195 },  // Dusky twilight
    { r: 170, g: 168, b: 170 },  // Deep dusk
    { r: 60,  g: 55,  b: 70  }   // Pre-night (blends into footer)
  ];

  function lerpColor(a, b, t) {
    return {
      r: Math.round(a.r + (b.r - a.r) * t),
      g: Math.round(a.g + (b.g - a.g) * t),
      b: Math.round(a.b + (b.b - a.b) * t)
    };
  }

  function handleDayNight() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight <= 0) return;
    
    // Progress from 0 (top) to 1 (bottom)
    let progress = Math.max(0, Math.min(1, scrollTop / docHeight));
    
    // Map progress to color array segments
    const segments = dayNightColors.length - 1;
    const segProgress = progress * segments;
    const segIndex = Math.min(Math.floor(segProgress), segments - 1);
    const segT = segProgress - segIndex;
    
    const color = lerpColor(dayNightColors[segIndex], dayNightColors[segIndex + 1], segT);
    
    document.documentElement.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  }

  window.addEventListener('scroll', handleDayNight);
  handleDayNight(); // Initial call

  // =============================================
  // === 10. IGLOO-STYLE INTERACTIVE ANIMATIONS ===
  // =============================================

  // --- A. Mouse-following Glowing Blobs ---
  const glowBlob1 = document.querySelector('.glow-blob-1');
  const glowBlob2 = document.querySelector('.glow-blob-2');
  const glowBlob3 = document.querySelector('.glow-blob-3');

  let targetBlobX = window.innerWidth / 2;
  let targetBlobY = window.innerHeight / 2;
  let currentBlobX = targetBlobX;
  let currentBlobY = targetBlobY;

  document.addEventListener('mousemove', (e) => {
    targetBlobX = e.clientX;
    targetBlobY = e.clientY;
  });

  function updateGlowBlobs() {
    const lerpFactor = 0.04; // Very slow and smooth float
    currentBlobX += (targetBlobX - currentBlobX) * lerpFactor;
    currentBlobY += (targetBlobY - currentBlobY) * lerpFactor;

    if (glowBlob1) {
      // Blob 1 moves in opposition to mouse slightly
      const xOffset = (currentBlobX - window.innerWidth / 2) * 0.15;
      const yOffset = (currentBlobY - window.innerHeight / 2) * 0.15;
      glowBlob1.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }

    if (glowBlob2) {
      // Blob 2 moves with mouse
      const xOffset = (currentBlobX - window.innerWidth / 2) * -0.1;
      const yOffset = (currentBlobY - window.innerHeight / 2) * -0.1;
      glowBlob2.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }

    if (glowBlob3) {
      // Blob 3 directly trails mouse coordinates
      const xOffset = (currentBlobX - window.innerWidth / 2) * 0.3;
      const yOffset = (currentBlobY - window.innerHeight / 2) * 0.3;
      glowBlob3.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }

    requestAnimationFrame(updateGlowBlobs);
  }
  updateGlowBlobs();

  // --- B. 3D Parallax Card Tilt Effect ---
  const tiltCards = document.querySelectorAll('.destination-card, .featured-pkg-card, .testimonial-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      
      // Calculate cursor position inside the card relative to the center
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Map coordinates from -0.5 to 0.5
      const rotateX = ((mouseY / cardHeight) - 0.5) * -15; // Max 15 degrees tilt
      const rotateY = ((mouseX / cardWidth) - 0.5) * 15;
      
      // Apply transforms
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
      card.style.boxShadow = `
        ${-rotateY * 1.5}px ${rotateX * 1.5}px 30px rgba(11, 19, 37, 0.12),
        0 15px 35px rgba(0, 0, 0, 0.05)
      `;
    });

    card.addEventListener('mouseleave', () => {
      // Reset smoothly
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
      card.style.boxShadow = '';
    });
  });

  // --- C. Magnetic Button Physics ---
  const magneticButtons = document.querySelectorAll('.btn-quote, .btn-primary, .btn-video, .btn-dark, .btn-booking-submit, .pkg-arrow-btn, .btn-carousel-nav');

  magneticButtons.forEach(btn => {
    const btnSpan = btn.querySelector('span');
    
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const btnWidth = rect.width;
      const btnHeight = rect.height;
      
      // Button center point
      const btnCenterX = rect.left + btnWidth / 2;
      const btnCenterY = rect.top + btnHeight / 2;
      
      // Distance from mouse to center
      const distDeltaX = e.clientX - btnCenterX;
      const distDeltaY = e.clientY - btnCenterY;
      
      const pullX = distDeltaX * 0.35; // Pull strength
      const pullY = distDeltaY * 0.35;
      
      btn.style.transform = `translate(${pullX}px, ${pullY}px)`;
      
      if (btnSpan) {
        // Inner text moves less to create 3D parallax depth
        btnSpan.style.transform = `translate(${pullX * 0.25}px, ${pullY * 0.25}px)`;
      }
    });

    btn.addEventListener('mouseleave', () => {
      // Return to base position
      btn.style.transform = '';
      if (btnSpan) {
        btnSpan.style.transform = '';
      }
    });
  });

  // --- D. Hero Title Text Splitting & Entrance Reveal ---
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    // Split by <br> or spaces
    const parts = originalText.split(/(<br\s*\/?>)/gi);
    
    let resultHTML = '';
    
    parts.forEach(part => {
      if (part.toLowerCase().startsWith('<br')) {
        resultHTML += part;
      } else {
        const words = part.split(' ');
        words.forEach((word, idx) => {
          if (word.trim()) {
            resultHTML += `<span class="word-span"><span class="word-inner">${word}</span></span>${idx < words.length - 1 ? ' ' : ''}`;
          }
        });
      }
    });
    
    heroTitle.innerHTML = resultHTML;
    
    // Trigger the reveal class after a tiny timeout
    setTimeout(() => {
      heroTitle.classList.add('revealed');
    }, 200);
  }

  // --- E. Mobile Navigation Drawer Toggle ---
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  
  if (menuToggleBtn && mobileNavDrawer) {
    const toggleDrawer = () => {
      menuToggleBtn.classList.toggle('open');
      mobileNavDrawer.classList.toggle('open');
      document.body.classList.toggle('drawer-open');
    };
    
    menuToggleBtn.addEventListener('click', toggleDrawer);
    
    // Close drawer when clicking any link
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggleBtn.classList.remove('open');
        mobileNavDrawer.classList.remove('open');
        document.body.classList.remove('drawer-open');
      });
    });
  }

});
