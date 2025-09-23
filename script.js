// ================= NAVIGATION MENU =================
const menuBtn = document.querySelector(".menu-btn");
const navigation = document.querySelector(".navigation");

if (menuBtn && navigation) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active");
  });
}

// Close menu when a navigation link is clicked (for mobile)
const navLinks = document.querySelectorAll(".navigation a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) { // Only apply to mobile screens
      menuBtn.classList.remove("active");
      navigation.classList.remove("active");
    }
  });
});

// ================= SIDEBAR HIGHLIGHT =================
const sections = document.querySelectorAll("section");
const sidebarLinks = document.querySelectorAll(".sidebar a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  sidebarLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ================= SMOOTH SCROLL =================
document.querySelectorAll('.navigation .navigation-items a, .sidebar a').forEach(link => {
  if (!link.hash || link.getAttribute('href') === '#') return;

  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.hash);
    if (!target) return;

    const header = document.querySelector('header');
    const offset = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});


// ================= CATEGORY TABS AND DUAL CAROUSELS =================

document.addEventListener('DOMContentLoaded', function() {
    // Category tabs functionality
    const categoryTabs = document.querySelectorAll('.category-tab');
    const carouselContainers = document.querySelectorAll('.carousel-container');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all carousels
            carouselContainers.forEach(carousel => {
                carousel.classList.remove('active');
            });
            
            // Show the selected carousel (without animations)
            const category = this.getAttribute('data-category');
            const targetCarousel = document.getElementById(`${category}-carousel`);
            if (targetCarousel) {
                // Temporarily disable transitions
                targetCarousel.style.transition = 'none';
                targetCarousel.classList.add('active');
                
                // Re-enable transitions after a brief delay
                setTimeout(() => {
                    targetCarousel.style.transition = '';
                }, 50);
            }
        });
    });
    
    // Initialize both carousels
    initializeCarousel('creative-carousel');
    initializeCarousel('alphabet-carousel');
    
    function initializeCarousel(carouselId) {
        const track = document.querySelector(`#${carouselId} .carousel-track`);
        if (track) {
            const slides = Array.from(track.children);
            const prevBtn = document.querySelector(`#${carouselId} .carousel-btn.prev`);
            const nextBtn = document.querySelector(`#${carouselId} .carousel-btn.next`);
            let currentIndex = 0;
            
            function updateSlides() {
                slides.forEach((slide, index) => {
                    slide.className = 'carousel-slide';
                    if (index === currentIndex) {
                        slide.classList.add('active');
                    } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
                        slide.classList.add('left-1');
                    } else if (index === (currentIndex - 2 + slides.length) % slides.length) {
                        slide.classList.add('left-2');
                    } else if (index === (currentIndex + 1) % slides.length) {
                        slide.classList.add('right-1');
                    } else if (index === (currentIndex + 2) % slides.length) {
                        slide.classList.add('right-2');
                    }
                });
            }
            
            function moveNext() {
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlides();
            }
            
            function movePrev() {
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlides();
            }
            
            if (nextBtn) nextBtn.addEventListener('click', moveNext);
            if (prevBtn) prevBtn.addEventListener('click', movePrev);
            
            updateSlides();
        }
    }
});








// ================= SCROLL-TRIGGERED ANIMATIONS =================
function initScrollAnimations() {
  const animatedSections = document.querySelectorAll("section, .hero");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");   // Animate in
      } else {
        entry.target.classList.remove("show"); // Reset when out of view
      }
    });
  }, { threshold: 0.1 });

  animatedSections.forEach(sec => observer.observe(sec));
}

// ================= LOADING SCREEN =================
const fill = document.querySelector('.bar-fill');
const percentText = document.querySelector('.percentage');
const screen = document.getElementById('loading-screen');

let progress = 0;
let displayed = 0;

const interval = setInterval(() => {
  if (progress >= 100) {
    clearInterval(interval);
    if (screen) {
      screen.style.transition = 'opacity 0.5s ease';
      screen.style.opacity = '0';
      setTimeout(() => {
        screen.style.display = 'none';
        // Start scroll animations AFTER loader disappears
        initScrollAnimations();

        // Force hero visible immediately
        const hero = document.querySelector(".hero");
        if (hero) hero.classList.add("show");
      }, 500);
    } else {
      initScrollAnimations();
    }
  } else {
    progress += Math.random() * 5 + 4;
    if (progress > 100) progress = 100;
  }
}, 100);

function updateDisplayed() {
  if (displayed < progress) {
    displayed += (progress - displayed) * 0.1;
    if (displayed > progress) displayed = progress;
    if (percentText) percentText.textContent = Math.floor(displayed) + '%';
    if (fill) fill.style.width = displayed + '%';
  }
  requestAnimationFrame(updateDisplayed);
}
updateDisplayed();
