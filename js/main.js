// main.js
document.addEventListener('DOMContentLoaded', function () {
    // Initialize components
    initMobileMenu();
    initLanguageSelector();
    initModals();
    initFAQAccordion();
    initCountdown();
    initPasswordToggle();
    initPasswordStrength();
    initCookieBanner();
    initAnimations();
    initCTAButton();
    initFormValidation();
    initImageErrorHandling();
    initToastContainer();

        // Prüfe, ob wir auf einer Legal-Seite sind
    const legalContainer = document.querySelector('.legal-container');
    if (legalContainer) {
        initLegalCardTouchFeedback();
    }
});



// Initialize CTA button
function initCTAButton() {
    const registerCTABtn = document.querySelector('.show-register-cta');
    const registerModal = document.getElementById('registerModal');

    if (registerCTABtn && registerModal) {
        registerCTABtn.addEventListener('click', function () {
            openModal(registerModal);
        });
    }
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileCloseBtn = document.querySelector('.mobile-close-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const nav = document.querySelector('nav');
    const body = document.body;

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            body.classList.toggle('mobile-menu-open');
        });
    }

    // Der Button ist bereits im HTML definiert, wir müssen nur den Event Listener hinzufügen
    if (mobileCloseBtn && nav) {
        mobileCloseBtn.addEventListener('click', function () {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('mobile-menu-open');
        });
    }

    if (mobileMenuOverlay && nav) {
        mobileMenuOverlay.addEventListener('click', function () {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.classList.remove('mobile-menu-open');
        });
    }
}

// Language Selector
function initLanguageSelector() {
    const langSelector = document.querySelector('.lang-selector');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const currentLang = document.querySelector('.current-lang');
    const flagIcon = document.querySelector('.lang-selector .flag-icon');

    if (langSelector && langDropdown) {
        langSelector.addEventListener('click', function (e) {
            e.preventDefault();
            langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
            this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });

        document.addEventListener('click', function (e) {
            // Schließen Sie das Dropdown nur, wenn weder auf den Selektor noch auf eine Option geklickt wurde
            if (!langSelector.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.style.display = 'none';
                langSelector.setAttribute('aria-expanded', 'false');
            }
        });

        langOptions.forEach(function (option) {
            option.addEventListener('click', function (e) {
                e.preventDefault();

                // Remove active class from all options
                langOptions.forEach(opt => opt.classList.remove('active'));

                // Add active class to clicked option
                this.classList.add('active');

                // Update current language display
                const selectedLang = this.textContent.trim().substring(0, 2).toUpperCase();
                currentLang.textContent = selectedLang;

                // Update flag
                const newFlagSrc = this.querySelector('.flag-icon').src;
                flagIcon.src = newFlagSrc;

                // Close dropdown
                langDropdown.style.display = 'none';
                langSelector.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

function openModal(modal) {
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hilfsfunktion zum Schließen aller Modals
function closeAllModals() {
    if (loginModal) loginModal.style.display = 'none';
    if (registerModal) registerModal.style.display = 'none';
    document.body.style.overflow = '';
}

// Modals
function initModals() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const closeModals = document.querySelectorAll('.close-modal');
    const showRegister = document.querySelector('.show-register');
    const showLogin = document.querySelector('.show-login');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal(loginModal);
        });
    }

    if (registerBtn && registerModal) {
        registerBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal(registerModal);
        });
    }

    if (closeModals) {
        closeModals.forEach(function (closeBtn) {
            closeBtn.addEventListener('click', closeAllModals);
        });
    }

    if (showRegister && registerModal && loginModal) {
        showRegister.addEventListener('click', function (e) {
            e.preventDefault();
            loginModal.style.display = 'none';
            openModal(registerModal);
        });
    }

    if (showLogin && loginModal && registerModal) {
        showLogin.addEventListener('click', function (e) {
            e.preventDefault();
            registerModal.style.display = 'none';
            openModal(loginModal);
        });
    }

    // Close modals when clicking outside the content
    window.addEventListener('click', function (e) {
        if (e.target === loginModal || e.target === registerModal) {
            closeAllModals();
        }
    });
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length) {
        faqItems.forEach(function (item) {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', function () {
                // Toggle active class
                item.classList.toggle('active');

                // Close other items
                faqItems.forEach(function (otherItem) {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        });
    }
}

// Countdown timer
function initCountdown() {
    function getNextSeasonDate() {
        const now = new Date();
        let nextMonth = now.getMonth() + 1;
        let nextYear = now.getFullYear();

        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }

        // Set date to first day of next month at 18:15
        const nextSeasonDate = new Date(nextYear, nextMonth, 1, 18, 15, 0);

        // Check if current date is after the 1st of the current month at 18:15
        if (now.getDate() > 1 || (now.getDate() === 1 && now.getHours() >= 18 && now.getMinutes() >= 15)) {
            return nextSeasonDate;
        } else {
            // If it's still before or on the 1st at 18:15, use the current month's date
            return new Date(now.getFullYear(), now.getMonth(), 1, 18, 15, 0);
        }
    }

    function updateCountdown() {
        const countdownDays = document.getElementById('countdown-days');
        const countdownHours = document.getElementById('countdown-hours');
        const countdownMinutes = document.getElementById('countdown-minutes');
        const countdownSeconds = document.getElementById('countdown-seconds');
        const nextSeasonDate = document.getElementById('next-season-date');

        if (countdownDays && countdownHours && countdownMinutes && countdownSeconds) {
            const nextSeason = getNextSeasonDate();
            const now = new Date();
            const diff = nextSeason - now;

            // Calculate days, hours, minutes and seconds
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Update the display
            countdownDays.textContent = days.toString().padStart(2, '0');
            countdownHours.textContent = hours.toString().padStart(2, '0');
            countdownMinutes.textContent = minutes.toString().padStart(2, '0');
            countdownSeconds.textContent = seconds.toString().padStart(2, '0');

            // Update next season date text
            if (nextSeasonDate) {
                const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
                nextSeasonDate.textContent = `Nächste Saison beginnt am 01. ${monthNames[nextSeason.getMonth()]} ${nextSeason.getFullYear()} um 18:15 Uhr`;
            }
        }
    }

    // Initialize countdown
    updateCountdown();
    // Update countdown every second
    setInterval(updateCountdown, 1000);
}

// Password toggle visibility
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    if (toggleButtons.length) {
        toggleButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const passwordField = this.previousElementSibling;
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);

                // Change icon
                const icon = this.querySelector('i');
                if (type === 'text') {
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
}

// Password strength meter
function initPasswordStrength() {
    const passwordField = document.getElementById('reg-password');
    const strengthBar = document.querySelector('.strength-progress');
    const strengthText = document.querySelector('.strength-text');

    if (passwordField && strengthBar && strengthText) {
        passwordField.addEventListener('input', function () {
            const password = this.value;
            const strength = checkPasswordStrength(password);

            // Update progress bar
            strengthBar.style.width = strength.percentage + '%';
            strengthBar.style.background = strength.color;

            // Update text
            strengthText.textContent = 'Passwort-Stärke: ' + strength.text;
        });
    }

    // Function to check password strength
    function checkPasswordStrength(password) {
        let strength = {
            percentage: 0,
            color: '#ff3333',
            text: 'Zu schwach'
        };

        // Check length
        if (password.length >= 8) {
            strength.percentage += 20;
        }

        // Check for uppercase letters
        if (/[A-Z]/.test(password)) {
            strength.percentage += 20;
        }

        // Check for lowercase letters
        if (/[a-z]/.test(password)) {
            strength.percentage += 20;
        }

        // Check for numbers
        if (/[0-9]/.test(password)) {
            strength.percentage += 20;
        }

        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) {
            strength.percentage += 20;
        }

        // Determine text and color based on percentage
        if (strength.percentage >= 80) {
            strength.text = 'Sehr stark';
            strength.color = '#4cd137';
        } else if (strength.percentage >= 60) {
            strength.text = 'Stark';
            strength.color = '#7bed9f';
        } else if (strength.percentage >= 40) {
            strength.text = 'Mittel';
            strength.color = '#ffb142';
        } else if (strength.percentage >= 20) {
            strength.text = 'Schwach';
            strength.color = '#ff793f';
        }

        return strength;
    }
}

// Allgemeine Funktion für Event-Binding
function bindEvent(element, eventType, handler) {
    if (element) {
        element.addEventListener(eventType, handler);
    }
}

// Cookie Banner
// Cookie Banner
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptAllButton = document.getElementById('accept-all-cookies');
    const acceptNecessaryButton = document.getElementById('accept-necessary-cookies');
    const saveSettingsButton = document.getElementById('save-cookie-settings');
    const detailsToggle = document.getElementById('cookie-details-toggle');
    const detailsContent = document.getElementById('cookie-details');
    const analyticsCheckbox = document.getElementById('analytics');
    const marketingCheckbox = document.getElementById('marketing');

    if (!cookieBanner) return;

    // Prüfen, ob Cookies bereits akzeptiert wurden
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        cookieBanner.style.display = 'none';
        return;
    }

    // Allgemeine Funktion für Event-Binding
    function bindEvent(element, eventType, handler) {
        if (element) {
            element.addEventListener(eventType, handler);
        }
    }

    // Hilfsfunktion zum Speichern der Cookie-Einstellungen
    function saveCookiePreferences(analytics = false, marketing = false) {
        localStorage.setItem('cookiesAccepted', 'true');
        localStorage.setItem('analyticsCookies', analytics);
        localStorage.setItem('marketingCookies', marketing);
        cookieBanner.style.display = 'none';
    }

    // Details ein-/ausblenden
    bindEvent(detailsToggle, 'click', function () {
        detailsContent.classList.toggle('active');
        this.classList.toggle('active');
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
        this.querySelector('.toggle-text').textContent = expanded ? 'Details anzeigen' : 'Details ausblenden';
    });

    // Alle Cookies akzeptieren
    bindEvent(acceptAllButton, 'click', function () {
        if (analyticsCheckbox) analyticsCheckbox.checked = true;
        if (marketingCheckbox) marketingCheckbox.checked = true;
        saveCookiePreferences(true, true);
        showToast('Alle Cookies wurden akzeptiert', 'success');
    });

    // Nur notwendige Cookies akzeptieren
    bindEvent(acceptNecessaryButton, 'click', function () {
        if (analyticsCheckbox) analyticsCheckbox.checked = false;
        if (marketingCheckbox) marketingCheckbox.checked = false;
        saveCookiePreferences(false, false);
        showToast('Nur notwendige Cookies wurden akzeptiert', 'info');
    });

    // Benutzerdefinierte Cookie-Einstellungen speichern
    bindEvent(saveSettingsButton, 'click', function () {
        saveCookiePreferences(analyticsCheckbox.checked, marketingCheckbox.checked);
        showToast('Deine Cookie-Einstellungen wurden gespeichert', 'success');
    });
}

// Funktion zum Initialisieren des Toast-Containers
function initToastContainer() {
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

// Show toast notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');

    if (toastContainer) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        let iconClass = '';
        switch (type) {
            case 'success':
                iconClass = 'fa-check-circle';
                break;
            case 'error':
                iconClass = 'fa-exclamation-circle';
                break;
            case 'warning':
                iconClass = 'fa-exclamation-triangle';
                break;
            case 'info':
            default:
                iconClass = 'fa-info-circle';
                break;
        }

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto-hide toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Close button functionality
        toast.querySelector('.toast-close').addEventListener('click', function () {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
    }
}

// Scroll animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fadeUp');

    function revealOnScroll() {
        animatedElements.forEach(function (element) {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight - 50) && (elementBottom > 0);

            if (isVisible) {
                element.style.animationPlayState = 'running';
            }
        });
    }

    // Check elements on load
    revealOnScroll();

    // Check elements on scroll
    window.addEventListener('scroll', revealOnScroll);

    // Stats counter animation
    function animateValue(element, start, end, duration) {
        if (!element) return;

        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Function to check if element is in viewport
    function isElementInViewport(el) {
        if (!el) return false;

        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Statistiken animieren, wenn sie in den Viewport gelangen
    const statsSection = document.querySelector('.stats-section');
    const statsItems = [
        {id: 'manager-count', endValue: 12487},
        {id: 'leagues-count', endValue: 248},
        {id: 'online-count', endValue: 1872},
        {id: 'season-count', endValue: 37}
    ];
    let statsAnimated = false;

    function checkStats() {
        if (!statsAnimated && statsSection && isElementInViewport(statsSection)) {
            statsItems.forEach(item => {
                const element = document.getElementById(item.id);
                if (element) {
                    animateValue(element, 0, item.endValue, 2000);
                }
            });
            statsAnimated = true;
        }
    }

    // Initial check
    checkStats();

    // Check on scroll
    window.addEventListener('scroll', checkStats);
}

// Formularvalidierung für Login- und Registrierungsformulare
function initFormValidation() {
    const loginForm = document.querySelector('.login-form');
    const registerForm = document.querySelector('.register-form');

    // Allgemeine Funktion zur Überprüfung leerer Felder
    function validateRequiredFields(form, fields) {
        for (const field of fields) {
            const value = form.querySelector(field).value.trim();
            if (!value) {
                showToast('Bitte fülle alle Felder aus', 'error');
                return false;
            }
        }
        return true;
    }

    // Funktion zur Validierung einer E-Mail-Adresse
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Bitte gib eine gültige E-Mail-Adresse ein', 'error');
            return false;
        }
        return true;
    }

    // Funktion zur Validierung übereinstimmender Passwörter
    function validateMatchingPasswords(password, confirmPassword) {
        if (password !== confirmPassword) {
            showToast('Die Passwörter stimmen nicht überein', 'error');
            return false;
        }
        return true;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateRequiredFields(this, ['#username', '#password'])) {
                return;
            }

            // Hier würde normalerweise der Login-API-Aufruf erfolgen
            // Für Demo-Zwecke zeigen wir nur eine Erfolgsmeldung an
            showToast('Login erfolgreich!', 'success');

            // Modal schließen
            document.getElementById('loginModal').style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!validateRequiredFields(this, ['#reg-username', '#email', '#reg-password', '#confirm-password'])) {
                return;
            }

            const email = this.querySelector('#email').value.trim();
            const password = this.querySelector('#reg-password').value.trim();
            const confirmPassword = this.querySelector('#confirm-password').value.trim();
            const termsAccepted = this.querySelector('#terms').checked;

            if (!validateEmail(email)) {
                return;
            }

            if (!validateMatchingPasswords(password, confirmPassword)) {
                return;
            }

            if (!termsAccepted) {
                showToast('Bitte akzeptiere die AGB und Datenschutzbestimmungen', 'error');
                return;
            }

            // Hier würde normalerweise der Registrierungs-API-Aufruf erfolgen
            // Für Demo-Zwecke zeigen wir nur eine Erfolgsmeldung an
            showToast('Registrierung erfolgreich!', 'success');

            // Modal schließen
            document.getElementById('registerModal').style.display = 'none';
            document.body.style.overflow = '';
        });
    }
}

// Bildladefehlern behandeln
function initImageErrorHandling() {
    const allImages = document.querySelectorAll('img');

    allImages.forEach(img => {
        img.addEventListener('error', function () {
            // Fallback-Bild für fehlerhafte Bilder
            this.src = 'img/placeholder.png';
            this.alt = 'Bild konnte nicht geladen werden';

            // Debugging-Information
            console.warn(`Bild konnte nicht geladen werden: ${this.getAttribute('src')}`);
        });
    });
}

// Touch-Feedback für Legal Cards
function initLegalCardTouchFeedback() {
    const legalCards = document.querySelectorAll('.legal-card');
    
    if (legalCards.length) {
        legalCards.forEach(card => {
            card.addEventListener('touchstart', function(e) {
                // Erstelle ein Ripple-Element
                const ripple = document.createElement('span');
                ripple.classList.add('touch-feedback');
                
                // Positioniere das Ripple an der Berührungsstelle
                const rect = this.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                // Füge das Ripple zum Element hinzu
                this.appendChild(ripple);
                
                // Entferne das Ripple nach der Animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
}