document.addEventListener('DOMContentLoaded', () => {
    const creditsContent = document.querySelector('.credits-content');
    const creditSections = document.querySelectorAll('.credit-section');
    const restartBtn = document.querySelector('.restart-btn');
    
    let isAnimating = false;

    function startCredits() {
        if (isAnimating) return;
        
        isAnimating = true;
        creditsContent.classList.add('scrolling');
        
        // Fade in sections sequentially
        creditSections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '1';
            }, index * 2000); // 2 second delay between each section
        });

        // Reset after animation completes
        setTimeout(() => {
            isAnimating = false;
            creditsContent.classList.remove('scrolling');
            creditSections.forEach(section => {
                section.style.opacity = '0';
            });
        }, 20000); // Match this with the CSS animation duration
    }

    // Start credits roll automatically
    startCredits();

    // Restart button functionality
    restartBtn.addEventListener('click', () => {
        if (!isAnimating) {
            creditsContent.style.transform = 'translateY(100%)';
            setTimeout(() => {
                startCredits();
            }, 100);
        }
    });
});

// Optional: Add keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        restartCredits();
    }
}); 