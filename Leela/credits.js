document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const welcomeOverlay = document.querySelector('.welcome-overlay');
    const creditsContainer = document.querySelector('.credits-container');
    const creditSections = document.querySelectorAll('.credit-section');
    const restartBtn = document.querySelector('.restart-btn');

    // Initial animations
    setTimeout(() => {
        welcomeOverlay.classList.add('hidden');
        creditsContainer.classList.add('visible');
        animateSectionsOnScroll();
    }, 3000);

    // Scroll animations
    function animateSectionsOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2
        });

        creditSections.forEach(section => {
            observer.observe(section);
        });
    }

    // Sparkle effect on team member hover
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mousemove', createSparkle);
    });

    function createSparkle(e) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Get position relative to the hovered element
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        this.appendChild(sparkle);
        
        // Remove sparkle after animation
        setTimeout(() => sparkle.remove(), 1000);
    }

    // Achievement hover effect
    const achievements = document.querySelectorAll('.achievement-list li');
    achievements.forEach(achievement => {
        achievement.addEventListener('mouseenter', () => {
            achievement.style.transform = 'scale(1.05)';
        });
        achievement.addEventListener('mouseleave', () => {
            achievement.style.transform = 'scale(1)';
        });
    });

    // Fire effect for team members
    function addFireEffect(teamMember) {
        const fireContainer = document.createElement('div');
        fireContainer.className = 'fire-container';
        
        const fireEffect = document.createElement('div');
        fireEffect.className = 'fire-effect';
        
        const img = teamMember.querySelector('img');
        const imgClone = img.cloneNode(true);
        
        fireContainer.appendChild(fireEffect);
        fireContainer.appendChild(imgClone);
        img.replaceWith(fireContainer);
    }

    // Create confetti
    function createConfetti() {
        const colors = ['#ff4d4d', '#ff9933', '#ffff66', '#66ff66', '#66ffff', '#ff66ff'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.opacity = Math.random();
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // Show congratulations message
    function showCongrats() {
        const congrats = document.createElement('div');
        congrats.className = 'congrats-message';
        congrats.textContent = '🎉 Congratulations to Our Amazing Team! 🎉';
        document.body.appendChild(congrats);
        
        // Remove message after animation
        setTimeout(() => {
            congrats.style.animation = 'congratsPopup 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse';
            setTimeout(() => congrats.remove(), 1000);
        }, 3000);
    }

    // Initialize effects
    teamMembers.forEach(member => {
        addFireEffect(member);
        
        member.addEventListener('mouseenter', () => {
            createConfetti();
            showCongrats();
        });
    });

    // Enhanced restart animation
    restartBtn.addEventListener('click', () => {
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Reset animations
        welcomeOverlay.classList.remove('hidden');
        creditsContainer.classList.remove('visible');
        creditSections.forEach(section => {
            section.classList.remove('visible');
        });

        // Add celebration effects on restart
        createConfetti();
        showCongrats();

        // Restart animation sequence
        setTimeout(() => {
            welcomeOverlay.classList.add('hidden');
            creditsContainer.classList.add('visible');
            animateSectionsOnScroll();
        }, 3000);
    });

    // Dynamic community contributors
    const communitySection = document.querySelector('#community-contributors');
    if (communitySection) {
        // Simulated API call to get contributors
        // Replace this with actual API call in production
        const contributors = [
            { name: 'Contributor 1', contributions: 'Bug fixes' },
            { name: 'Contributor 2', contributions: 'Documentation' },
            { name: 'Contributor 3', contributions: 'Feature development' }
        ];

        const contributorsList = document.createElement('div');
        contributorsList.className = 'contributors-list';

        contributors.forEach(contributor => {
            const contributorElement = document.createElement('div');
            contributorElement.className = 'contributor';
            contributorElement.innerHTML = `
                <h3>${contributor.name}</h3>
                <p>${contributor.contributions}</p>
            `;
            contributorsList.appendChild(contributorElement);
        });

        communitySection.appendChild(contributorsList);
    }

    // Social links hover effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });

    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Optional: Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Show welcome overlay
            welcomeOverlay.classList.remove('hidden');
        } else if (e.key === 'ArrowDown') {
            // Scroll to next section
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        } else if (e.key === 'ArrowUp') {
            // Scroll to previous section
            window.scrollBy({
                top: -window.innerHeight,
                behavior: 'smooth'
            });
        }
    });

    // Create multiple cursor trails
    const numTrails = 5;
    const trails = [];

    for (let i = 0; i < numTrails; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push(trail);
    }

    // Create photo interaction container
    const photoInteraction = document.createElement('div');
    photoInteraction.className = 'photo-interaction';
    document.body.appendChild(photoInteraction);

    // Create celebration message
    const celebrationMessage = document.createElement('div');
    celebrationMessage.className = 'celebration-message';
    celebrationMessage.textContent = '🎉 Amazing Team! 🎉\nThank you for making Code Kottu possible!';
    document.body.appendChild(celebrationMessage);

    // Mouse movement handler
    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update cursor trails with delay
        trails.forEach((trail, index) => {
            setTimeout(() => {
                trail.style.left = `${mouseX}px`;
                trail.style.top = `${mouseY}px`;
            }, index * 50);
        });

        // Calculate mouse speed for trail size
        const speed = Math.sqrt(
            Math.pow(mouseX - prevX, 2) + 
            Math.pow(mouseY - prevY, 2)
        );

        if (speed > 20) {
            trails.forEach(trail => trail.classList.add('active'));
            setTimeout(() => {
                trails.forEach(trail => trail.classList.remove('active'));
            }, 150);
        }

        prevX = mouseX;
        prevY = mouseY;
    });

    // Photo interaction effects
    const teamPhotoContainer = document.querySelector('.team-photo-container');

    if (teamPhotoContainer) {
        teamPhotoContainer.addEventListener('mousemove', (e) => {
            const rect = teamPhotoContainer.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            teamPhotoContainer.style.setProperty('--mouse-x', x + '%');
            teamPhotoContainer.style.setProperty('--mouse-y', y + '%');
        });

        teamPhotoContainer.addEventListener('mouseenter', () => {
            photoInteraction.classList.add('active');
            celebrationMessage.classList.add('active');
            
            // Create floating hearts and sparkles
            const createEffect = (type) => {
                const element = document.createElement('div');
                element.className = type;
                
                if (type === 'heart') {
                    element.innerHTML = '❤️';
                }
                
                const startX = Math.random() * window.innerWidth;
                const startY = window.innerHeight;
                const endX = (Math.random() - 0.5) * 200;
                const endY = -Math.random() * 200;
                
                element.style.left = startX + 'px';
                element.style.top = startY + 'px';
                element.style.setProperty('--end-x', endX + 'px');
                element.style.setProperty('--end-y', endY + 'px');
                
                photoInteraction.appendChild(element);
                
                setTimeout(() => element.remove(), 2000);
            };

            // Create multiple effects
            const effectInterval = setInterval(() => {
                createEffect('heart');
                createEffect('sparkle-effect');
            }, 200);

            // Stop effects after 3 seconds
            setTimeout(() => {
                clearInterval(effectInterval);
                celebrationMessage.classList.add('hiding');
                setTimeout(() => {
                    celebrationMessage.classList.remove('active', 'hiding');
                    photoInteraction.classList.remove('active');
                }, 500);
            }, 3000);
        });
    }
});