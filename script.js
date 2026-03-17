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


// ================= GALLERY FILTER & LIGHTBOX =================
document.addEventListener('DOMContentLoaded', function() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentLightboxIndex = 0;
    let visibleItems = [];

    // Category filter
    function applyFilter(category) {
        galleryItems.forEach(item => {
            if (item.getAttribute('data-category') === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    // Apply default filter on load
    applyFilter('alphabet');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            applyFilter(this.getAttribute('data-category'));
        });
    });

    // Get currently visible items
    function getVisibleItems() {
        return Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
    }

    // Open lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            visibleItems = getVisibleItems();
            currentLightboxIndex = visibleItems.indexOf(this);
            openLightbox();
        });
    });

    function openLightbox() {
        const img = visibleItems[currentLightboxIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCounter.textContent = (currentLightboxIndex + 1) + ' / ' + visibleItems.length;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox();
    });

    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % visibleItems.length;
        openLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    });
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
