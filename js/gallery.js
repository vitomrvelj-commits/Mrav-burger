// Horizontal Scroll Gallery with GSAP ScrollTrigger
if (document.getElementById('eventi-gallery')) {
    gsap.registerPlugin(ScrollTrigger);

    window.addEventListener('load', () => {
        const horizontalSection = document.querySelector('.horiz-gallery-wrapper');
        const pinWrap = document.querySelector('.horiz-gallery-strip');

        if (!horizontalSection || !pinWrap) return;

        if (window.innerWidth <= 768) return; // mobile - CSS handles it

        let pinWrapWidth = pinWrap.scrollWidth;
        let horizontalScrollLength = pinWrapWidth - window.innerWidth;

        gsap.to(pinWrap, {
            scrollTrigger: {
                trigger: horizontalSection,
                pin: true,
                scrub: 1,
                start: 'center center',
                end: () => `+=${horizontalScrollLength * 0.35}`,
                invalidateOnRefresh: true
            },
            x: () => -horizontalScrollLength,
            ease: 'none'
        });

        ScrollTrigger.addEventListener('refreshInit', () => {
            pinWrapWidth = pinWrap.scrollWidth;
            horizontalScrollLength = pinWrapWidth - window.innerWidth;
        });
    });
}
