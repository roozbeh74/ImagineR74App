// RRPay - JavaScript Logic

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(15, 23, 42, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Button click handlers
    const claimButtons = document.querySelectorAll('.faucet-card .btn');
    claimButtons.forEach(button => {
        button.addEventListener('click', function() {
            const faucetName = this.parentElement.querySelector('h3').textContent;
            alert(`شما درخواست دریافت ${faucetName} را ثبت کردید!\n\nاین یک نسخه نمایشی است. در نسخه واقعی، ارز به کیف پول شما واریز می‌شود.`);
        });
    });

    // Auth buttons
    const loginBtn = document.querySelector('.btn-outline');
    const signupBtn = document.querySelector('.btn-primary');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            alert('صفحه ورود به حساب کاربری\n\nاین یک نسخه نمایشی فرانت‌اند است.');
        });
    }
    
    if (signupBtn && signupBtn.textContent.trim() === 'ثبت نام') {
        signupBtn.addEventListener('click', function() {
            alert('صفحه ثبت نام\n\nاین یک نسخه نمایشی فرانت‌اند است.');
        });
    }

    // Hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (index === 0) {
                // Start button
                document.querySelector('#faucets').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                // Learn more button
                document.querySelector('#features').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards, faucet cards, and earning items
    const animateElements = document.querySelectorAll('.feature-card, .faucet-card, .earning-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }
        
        updateCounter();
    }

    // Trigger counter animation when stats are visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('50,000')) {
                        animateCounter(stat, 50000);
                    } else if (text.includes('1,000,000')) {
                        animateCounter(stat, 1000000);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    console.log('RRPay Platform Loaded Successfully! 🚀');
});
