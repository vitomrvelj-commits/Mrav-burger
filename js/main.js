/* ==========================================
   MRAV BURGER & BEER BAR
   Main JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== ELEMENTS ====================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // ==================== NAVBAR SCROLL EFFECT ====================
    let ticking = false;
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // ==================== MOBILE MENU ====================
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
    }
    
    hamburger.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });
    
    // ==================== SMOOTH SCROLL ====================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ==================== SCROLL ANIMATIONS ====================
    const fadeElements = document.querySelectorAll('.section-title, .section-text, .lokacija-item, .instagram-placeholder');
    
    fadeElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
    
    // ==================== BURGER LABELS ANIMATION ====================
    const burgerShowcase = document.getElementById('burgerShowcase');
    const burgerLabels = document.querySelectorAll('.burger-label');
    const burgerArrows = document.querySelectorAll('.burger-showcase .arrow');

    const labelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // CSS handles timing with transition-delay
                burgerArrows.forEach(arrow => arrow.classList.add('visible'));
                burgerLabels.forEach(label => label.classList.add('visible'));
                labelObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (burgerShowcase) {
        labelObserver.observe(burgerShowcase);
    }

    // ==================== BURGER SHOWCASE V2 ANIMATION ====================
    const showcaseBurgerImage = document.querySelector('.showcase-burger-image');
    const showcaseLabel = document.querySelector('.showcase-label');
    const showcaseArrowUp = document.querySelector('.showcase-arrow-up');

    const burgerV2Observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                showcaseBurgerImage.classList.add('animate');
                burgerV2Observer.unobserve(entry.target);

                // After burger animates in (~1s), draw arrow
                setTimeout(() => {
                    if (showcaseArrowUp) {
                        showcaseArrowUp.style.animation = 'drawArrowUp 1.2s ease-out forwards';
                    }
                    // After arrow draws (~1.2s), fade in label
                    setTimeout(() => {
                        if (showcaseLabel) {
                            showcaseLabel.style.animation = 'fadeInLabel 0.6s ease-out forwards';
                        }
                    }, 1200);
                }, 1000);
            }
        });
    }, { threshold: 0.3 });

    if (showcaseBurgerImage) {
        burgerV2Observer.observe(showcaseBurgerImage);
    }
    
    // ==================== CATERING PAGE ANIMATIONS ====================
    const cateringSplitSections = document.querySelectorAll('.catering-split-section');

    if (cateringSplitSections.length > 0) {
        // Set initial hidden states
        cateringSplitSections.forEach(section => {
            const content = section.querySelector('.catering-split-content');
            const image = section.querySelector('.catering-split-image');
            const isReversed = section.classList.contains('catering-split-reverse');

            if (content) content.classList.add(isReversed ? 'catering-anim-right' : 'catering-anim-left');
            if (image) image.classList.add(isReversed ? 'catering-anim-left' : 'catering-anim-right');
        });

        const splitObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const content = section.querySelector('.catering-split-content');
                    const image = section.querySelector('.catering-split-image');

                    if (content) setTimeout(() => content.classList.add('in-view'), 100);
                    if (image) setTimeout(() => image.classList.add('in-view'), 280);

                    splitObserver.unobserve(section);
                }
            });
        }, { threshold: 0.15 });

        cateringSplitSections.forEach(s => splitObserver.observe(s));
    }

    // Feature cards staggered animation
    const featureCards = document.querySelectorAll('.feature-card');
    if (featureCards.length > 0) {
        featureCards.forEach((card, i) => {
            card.classList.add('catering-anim-up');
            card.style.transitionDelay = `${i * 0.1}s`;
        });

        const cardsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    cardsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        featureCards.forEach(card => cardsObserver.observe(card));
    }

    // Catering features title animation
    const cateringFeaturesTitle = document.querySelector('.catering-features-title');
    if (cateringFeaturesTitle) {
        cateringFeaturesTitle.classList.add('catering-anim-up');
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    titleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        titleObserver.observe(cateringFeaturesTitle);
    }

    // ==================== O NAMA PAGE ANIMATIONS ====================
    const onamaPage = document.querySelector('.onama-page');

    if (onamaPage) {
        // Hero title animates in on load
        const onamaHeroTitle = document.querySelector('.onama-hero-title');
        if (onamaHeroTitle) {
            onamaHeroTitle.classList.add('catering-anim-up');
            setTimeout(() => onamaHeroTitle.classList.add('in-view'), 300);
        }

        // Intro section: image from left, content from right
        const introImage = document.querySelector('.onama-intro-image');
        const introContent = document.querySelector('.onama-intro-content');
        if (introImage) introImage.classList.add('catering-anim-left');
        if (introContent) introContent.classList.add('catering-anim-right');

        const onamaIntro = document.querySelector('.onama-intro');
        if (onamaIntro) {
            const introObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (introImage) setTimeout(() => introImage.classList.add('in-view'), 100);
                        if (introContent) setTimeout(() => introContent.classList.add('in-view'), 280);
                        introObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            introObs.observe(onamaIntro);
        }

        // Split sections: detect which child comes first to assign slide direction
        const onamaSplitSections = document.querySelectorAll('.onama-split-section');
        onamaSplitSections.forEach(section => {
            const content = section.querySelector('.onama-split-content');
            const image = section.querySelector('.onama-split-image');
            const imageFirst = section.firstElementChild === image;
            if (content) content.classList.add(imageFirst ? 'catering-anim-right' : 'catering-anim-left');
            if (image) image.classList.add(imageFirst ? 'catering-anim-left' : 'catering-anim-right');
        });

        const onamaSplitObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const content = entry.target.querySelector('.onama-split-content');
                    const image = entry.target.querySelector('.onama-split-image');
                    if (content) setTimeout(() => content.classList.add('in-view'), 100);
                    if (image) setTimeout(() => image.classList.add('in-view'), 280);
                    onamaSplitObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        onamaSplitSections.forEach(s => onamaSplitObs.observe(s));

        // Quote: fade up
        const onamaQuote = document.querySelector('.onama-quote');
        if (onamaQuote) {
            onamaQuote.classList.add('catering-anim-up');
            const quoteObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        quoteObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            quoteObs.observe(onamaQuote);
        }
    }

    // ==================== NEWSLETTER FORM ====================
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            console.log('Newsletter signup:', email);
            alert('Hvala na prijavi!');
            this.reset();
        });
    }
    
    // ==================== CONSOLE LOG ====================
    console.log('%c🍔 Mrav Burger & Beer Bar', 'font-size: 24px; font-weight: bold; color: #D3955B;');
    console.log('%cBurgers worth the bite!', 'font-size: 14px; color: #666;');
});


















