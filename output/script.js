/**
 * ParaguayDoc Landing Page
 * Interactive features and form validation
 */

(function() {
    'use strict';

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================

    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu on button click
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = navToggle.contains(event.target);

            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL NAVIGATION
    // ========================================

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Don't prevent default for empty anchors
            if (href === '#' || href === '#!') {
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();

                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // STICKY HEADER ON SCROLL
    // ========================================

    const header = document.getElementById('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add scrolled class for shadow effect
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // ========================================
    // FAQ ACCORDION
    // ========================================

    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;

            // Close all other FAQs (optional: comment out for multi-open behavior)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherQuestion.nextElementSibling.classList.remove('active');
                }
            });

            // Toggle current FAQ
            this.setAttribute('aria-expanded', !isExpanded);
            answer.classList.toggle('active');
        });
    });

    // ========================================
    // FORM VALIDATION
    // ========================================

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        // Input validation functions
        const validators = {
            name: function(value) {
                if (!value.trim()) {
                    return 'Пожалуйста, введите ваше имя';
                }
                if (value.trim().length < 2) {
                    return 'Имя должно содержать минимум 2 символа';
                }
                return null;
            },

            email: function(value) {
                if (!value.trim()) {
                    return 'Пожалуйста, введите email';
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Пожалуйста, введите корректный email';
                }
                return null;
            },

            phone: function(value) {
                if (!value.trim()) {
                    return 'Пожалуйста, введите номер телефона';
                }
                const phoneRegex = /^[\d\s\+\-\(\)]+$/;
                if (!phoneRegex.test(value)) {
                    return 'Пожалуйста, введите корректный номер телефона';
                }
                if (value.replace(/\D/g, '').length < 10) {
                    return 'Номер телефона слишком короткий';
                }
                return null;
            },

            consent: function(checked) {
                if (!checked) {
                    return 'Необходимо согласие на обработку данных';
                }
                return null;
            }
        };

        // Real-time validation
        const validateField = function(field) {
            const fieldName = field.name;
            const value = field.type === 'checkbox' ? field.checked : field.value;
            const errorElement = document.getElementById(fieldName + 'Error');

            if (validators[fieldName]) {
                const errorMessage = validators[fieldName](value);

                if (errorMessage) {
                    field.classList.add('error');
                    if (errorElement) {
                        errorElement.textContent = errorMessage;
                    }
                    return false;
                } else {
                    field.classList.remove('error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                    return true;
                }
            }

            return true;
        };

        // Add blur event listeners for real-time validation
        const formFields = contactForm.querySelectorAll('input[required], textarea[required]');
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });

            // Clear error on input
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Validate all fields
            let isValid = true;
            const requiredFields = ['name', 'email', 'phone', 'consent'];

            requiredFields.forEach(fieldName => {
                const field = contactForm.elements[fieldName];
                if (field && !validateField(field)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                // Scroll to first error
                const firstError = contactForm.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
                return;
            }

            // If validation passes, submit the form
            submitForm();
        });

        // Form submission handler
        function submitForm() {
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Disable submit button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            // Simulate form submission (replace with actual API call)
            setTimeout(function() {
                // Show success message
                const successMessage = document.getElementById('formSuccess');
                if (successMessage) {
                    successMessage.style.display = 'block';

                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Reset form
                    contactForm.reset();

                    // Re-enable button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;

                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        successMessage.style.display = 'none';
                    }, 5000);
                }

                // Log form data (for development)
                console.log('Form submitted with data:', data);

                // In production, you would send the data to your backend:
                // fetch('/api/contact', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(data)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     // Handle success
                // })
                // .catch(error => {
                //     // Handle error
                // });
            }, 1500);
        }
    }

    // ========================================
    // BACK TO TOP BUTTON
    // ========================================

    const backToTopButton = document.getElementById('backToTop');

    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 500) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Scroll to top on click
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================

    // Observe elements for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe service cards, pricing cards, etc.
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .trust-card, .additional-card, .timeline-item'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // ========================================
    // KEYBOARD NAVIGATION ENHANCEMENTS
    // ========================================

    // Escape key closes mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            navToggle.focus();
        }
    });

    // Tab trapping in mobile menu
    if (navMenu) {
        const focusableElements = navMenu.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        navMenu.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && navMenu.classList.contains('active')) {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });
    }

    // ========================================
    // PERFORMANCE OPTIMIZATIONS
    // ========================================

    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll event listeners
    const optimizedScrollHandler = debounce(function() {
        // Any additional scroll handlers can be added here
    }, 100);

    window.addEventListener('scroll', optimizedScrollHandler);

    // ========================================
    // LAZY LOADING IMAGES (if any images are added)
    // ========================================

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ========================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ========================================

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.pageYOffset + 100;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

    // ========================================
    // INITIALIZE
    // ========================================

    // Set initial state
    document.addEventListener('DOMContentLoaded', function() {
        console.log('ParaguayDoc landing page loaded successfully');

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.scrollBehavior = 'auto';

            animatedElements.forEach(el => {
                el.style.opacity = '1';
                el.style.animation = 'none';
            });
        }

        // Update active nav link on load
        updateActiveNavLink();
    });

    // ========================================
    // ANALYTICS TRACKING (optional)
    // ========================================

    // Track button clicks
    function trackEvent(category, action, label) {
        // Integrate with your analytics platform
        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }

        console.log('Event tracked:', category, action, label);
    }

    // Track CTA clicks
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('Engagement', 'click', this.textContent.trim());
        });
    });

    // Track form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('Form', 'submit', 'Contact Form');
        });
    }

    // ========================================
    // SERVICE WORKER REGISTRATION (PWA support)
    // ========================================

    // Uncomment to enable PWA features
    // if ('serviceWorker' in navigator) {
    //     window.addEventListener('load', function() {
    //         navigator.serviceWorker.register('/sw.js').then(
    //             function(registration) {
    //                 console.log('ServiceWorker registration successful');
    //             },
    //             function(err) {
    //                 console.log('ServiceWorker registration failed: ', err);
    //             }
    //         );
    //     });
    // }

})();
