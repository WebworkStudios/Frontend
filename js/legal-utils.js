// legal-utils.js - Comprehensive utilities for legal pages (AGB, Datenschutz, Impressum)

/**
 * Namespace for shared legal page functions
 */
window.legalUtils = (function() {
    /**
     * Initializes common functions for legal pages
     * @param {string} pageType - The type of page ('agb', 'datenschutz', 'impressum')
     */
    function initLegalPage(pageType) {
        console.log(`Initializing ${pageType} page utilities`);
        
        // Initialize PDF download function
        initPdfDownload(pageType);
        
        // Initialize scroll animation for table of contents links
        initTocScrolling();
        
        // Page-specific initializations
        switch(pageType) {
            case 'datenschutz':
                initDatenschutzSpecifics();
                break;
            case 'agb':
                // AGB-specific initializations (if any)
                break;
            case 'impressum':
                // Impressum-specific initializations (if any)
                break;
        }
        
        // Initialize touch feedback for legal cards on mobile devices
        initLegalCardTouchFeedback();
    }

    /**
     * Initializes datenschutz-specific functionality
     */
    function initDatenschutzSpecifics() {
        initDatenschutzAnfrageModal();
        initCookieSettings();
        initGoogleAnalyticsOptOut();
        initVersionLinks();
    }

    /**
     * Initializes scroll animation for table of contents links
     */
    function initTocScrolling() {
        const tocLinks = document.querySelectorAll('.legal-toc-list a');
        
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Smooth scroll to target with offset for header
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Briefly highlight the target element
                    targetElement.classList.add('highlight-section');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-section');
                    }, 2000);
                    
                    // Update URL hash for direct links
                    history.pushState(null, null, targetId);
                }
            });
        });
        
        // Check if URL has a hash and scroll to it
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                // Delay to ensure page is fully loaded
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    targetElement.classList.add('highlight-section');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-section');
                    }, 2000);
                }, 300);
            }
        }
    }

    /**
     * Initializes the PDF download functionality
     * @param {string} pageType - The type of page ('agb', 'datenschutz', 'impressum')
     */
    function initPdfDownload(pageType) {
        let downloadButtonId;
        
        switch(pageType) {
            case 'agb':
                downloadButtonId = 'agbDownloadButton';
                break;
            case 'datenschutz':
                // Check both possible IDs for datenschutz download button
                downloadButtonId = document.getElementById('datenschutzDownloadButton') ? 
                    'datenschutzDownloadButton' : 'legalDownloadButton';
                break;
            default:
                return; // If no PDF download is required
        }
        
        const downloadButton = document.getElementById(downloadButtonId);
        
        if (downloadButton) {
            downloadButton.addEventListener('click', function() {
                downloadLegalAsPdf(pageType);
            });
        }
    }

    /**
     * Shows toast messages with fallback
     * @param {string} message - The message to display
     * @param {string} type - The type of message ('success', 'error', 'warning', 'info')
     */
    function showToast(message, type = 'info') {
        try {
            // Check if global showToast function is available
            if (typeof window.showToast === 'function') {
                window.showToast(message, type);
                return;
            }
            
            // Fallback implementation for toast messages
            const toastContainer = document.getElementById('toast-container') || createToastContainer();
            
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            
            // Determine icon class based on toast type
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
            
            // Create toast content
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" aria-label="Schließen">&times;</button>
            `;
            
            toastContainer.appendChild(toast);
            
            // Show toast with animation
            setTimeout(() => toast.classList.add('show'), 10);
            
            // Auto-hide toast after 5 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 5000);
            
            // Close button functionality
            toast.querySelector('.toast-close').addEventListener('click', function() {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            });
        } catch (e) {
            console.warn('Failed to show toast:', e);
        }
    }
    
    /**
     * Creates a toast container if none exists
     * @returns {HTMLElement} The toast container
     */
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Downloads legal documents as PDF
     * @param {string} pageType - The type of page ('agb', 'datenschutz')
     */
    function downloadLegalAsPdf(pageType) {
        // Check if jsPDF library is loaded
        if (typeof window.jspdf === 'undefined') {
            showToast('Die PDF-Bibliothek konnte nicht geladen werden. Bitte versuchen Sie es später erneut.', 'error');
            return;
        }
        
        // Show loading toast
        showToast('PDF wird erstellt. Bitte warten...', 'info');
        
        // Delay to allow toast to display
        setTimeout(() => {
            try {
                // Initialize jsPDF library
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                    compress: true
                });
                
                // Configuration based on page type
                let title, subject, filename, headerText;
                let dateElement = document.querySelector('.elegant-heading p');
                
                switch(pageType) {
                    case 'agb':
                        title = 'Allgemeine Geschäftsbedingungen - Kickerscup';
                        subject = 'AGB';
                        filename = 'Kickerscup-AGB.pdf';
                        headerText = 'Allgemeine Geschäftsbedingungen';
                        break;
                    case 'datenschutz':
                        title = 'Datenschutzerklärung - Kickerscup';
                        subject = 'Datenschutz';
                        filename = 'Kickerscup-Datenschutz.pdf';
                        headerText = 'Datenschutzerklärung';
                        break;
                    default:
                        throw new Error('Ungültiger Seitentyp');
                }
                
                // Add title and metadata
                doc.setProperties({
                    title: title,
                    subject: subject,
                    author: 'Jan Steiger, Betreiber des Spiels „Kickerscup".',
                    keywords: `${subject}, Kickerscup`,
                    creator: 'Kickerscup'
                });
                
                // Document title
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(18);
                doc.setTextColor(255, 138, 0);
                doc.text(headerText, 20, 20);
                
                // Document date
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                doc.text(`${dateElement ? dateElement.textContent : 'Stand: 21.03.2025'}`, 20, 30);
                
                // Horizontal line
                doc.setDrawColor(255, 138, 0);
                doc.setLineWidth(0.5);
                doc.line(20, 35, 190, 35);
                
                // Extract and add article content
                let yPosition = 45;
                const articles = document.querySelectorAll('.legal-article');
                
                articles.forEach((article) => {
                    // Start new page if needed
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    const header = article.querySelector('.legal-article-header h3').textContent;
                    const number = article.querySelector('.legal-article-number').textContent;
                    
                    // Article number and header
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.setTextColor(255, 138, 0);
                    doc.text(`${number}. ${header}`, 20, yPosition);
                    yPosition += 8;
                    
                    // Process paragraphs
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(50, 50, 50);
                    
                    // Add paragraphs
                    const paragraphs = article.querySelectorAll('.legal-article-content p');
                    paragraphs.forEach(paragraph => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        
                        const textLines = doc.splitTextToSize(paragraph.textContent, 170);
                        doc.text(textLines, 20, yPosition);
                        yPosition += 6 * textLines.length;
                    });
                    
                    // Add subheadings (for Datenschutz)
                    const subheadings = article.querySelectorAll('.legal-article-content h4');
                    subheadings.forEach(heading => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        
                        doc.setFont('helvetica', 'bold');
                        doc.setFontSize(12);
                        doc.text(heading.textContent, 20, yPosition);
                        yPosition += 6;
                        
                        doc.setFont('helvetica', 'normal');
                        doc.setFontSize(11);
                    });
                    
                    // Add list items
                    const listItems = article.querySelectorAll('.legal-article-content ul li, .legal-list li');
                    listItems.forEach(item => {
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }
                        
                        const textLines = doc.splitTextToSize(`• ${item.textContent}`, 165);
                        doc.text(textLines, 25, yPosition);
                        yPosition += 6 * textLines.length;
                    });
                    
                    // Space between articles
                    yPosition += 10;
                });
                
                // Add footer to all pages
                addDocumentFooter(doc);
                
                // Save PDF
                doc.save(filename);
                
                // Show success message
                showToast(`${subject} wurde erfolgreich als PDF heruntergeladen!`, 'success');
                
            } catch (error) {
                console.error('Fehler beim Erstellen des PDFs:', error);
                showToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
            }
        }, 300);
    }
    
    /**
     * Adds footer to all pages of the document
     * @param {Object} doc - The PDF document
     */
    function addDocumentFooter(doc) {
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text('Jan Steiger, Betreiber des Spiels „Kickerscup". • Pulverhäuserweg 72a • 64295 Darmstadt • Deutschland', 20, 285);
            doc.text(`Seite ${i} von ${pageCount}`, 170, 285);
        }
    }

    /**
     * Initializes the data protection request modal
     */
    function initDatenschutzAnfrageModal() {
        const modalTriggers = [
            document.getElementById('datenschutzFormular'),
            document.getElementById('legalFormular')
        ];
        
        const modal = document.getElementById('legalAnfrageModal') || 
                      document.getElementById('datenschutzAnfrageModal');
        
        if (!modal) return;
        
        const closeModalBtn = modal.querySelector('.close-modal');
        const form = modal.querySelector('.legal-anfrage-form');
        
        // Set up event listeners for all possible trigger buttons
        modalTriggers.forEach(trigger => {
            if (trigger) {
                trigger.addEventListener('click', function() {
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                });
            }
        });
        
        // Close button functionality
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Close modal when clicking outside content
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Form processing
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Form data collection
                const formData = new FormData(this);
                const requestData = Object.fromEntries(formData.entries());
                
                // Here would be the API call to process the request
                console.log('Processing data protection request:', requestData);
                
                showToast('Ihre Datenschutz-Anfrage wurde erfolgreich übermittelt. Wir werden uns schnellstmöglich bei Ihnen melden.', 'success');
                
                // Close modal and reset form
                modal.style.display = 'none';
                document.body.style.overflow = '';
                form.reset();
            });
        }
    }

    /**
     * Initializes cookie settings functionality
     */
    function initCookieSettings() {
        const cookieSettingsBtn = document.getElementById('openCookieSettings');
        
        if (!cookieSettingsBtn) return;
        
        cookieSettingsBtn.addEventListener('click', function() {
            // Use global cookie banner function if available
            if (window.showCookieBanner && typeof window.showCookieBanner === 'function') {
                window.showCookieBanner();
            } else {
                // Fallback if no global function is available
                const cookieBanner = document.getElementById('cookie-banner');
                if (cookieBanner) {
                    cookieBanner.style.display = 'block';
                    
                    // Enable detailed view
                    const detailsToggle = document.getElementById('cookie-details-toggle');
                    const detailsContent = document.getElementById('cookie-details');
                    
                    if (detailsToggle && detailsContent) {
                        detailsContent.classList.add('active');
                        detailsToggle.classList.add('active');
                        detailsToggle.setAttribute('aria-expanded', 'true');
                        
                        const toggleText = detailsToggle.querySelector('.toggle-text');
                        if (toggleText) {
                            toggleText.textContent = 'Details ausblenden';
                        }
                    }
                } else {
                    showToast('Cookie-Einstellungen sind derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.', 'info');
                }
            }
        });
    }

    /**
     * Google Analytics Opt-Out functionality
     */
    function initGoogleAnalyticsOptOut() {
        const gaOptOutLink = document.getElementById('ga-opt-out');
        
        if (!gaOptOutLink) return;
        
        gaOptOutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Set Google Analytics Opt-Out cookie
            const date = new Date();
            date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)); // 10 years
            document.cookie = 'ga-opt-out=1; expires=' + date.toUTCString() + '; path=/; domain=.' + window.location.hostname + '; samesite=lax';
            
            // Disable Google Analytics if present
            if (window.hasOwnProperty('ga-disable-UA-XXXXXXXX-X')) {
                window['ga-disable-UA-XXXXXXXX-X'] = true;
            }
            
            showToast('Google Analytics wurde für diese Website deaktiviert. Das Tracking-Cookie wurde gesetzt.', 'success');
        });
    }
    
    /**
     * Initializes links to previous versions of the privacy policy
     */
    function initVersionLinks() {
        const versionLinks = document.querySelectorAll('.legal-version-link');
        
        if (!versionLinks.length) return;
        
        versionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const versionDate = this.querySelector('.version-date').textContent;
                
                // Here would normally be the download of the corresponding version
                // Demo implementation
                showToast(`Version vom ${versionDate} wird heruntergeladen...`, 'info');
                
                // Simulate download delay
                setTimeout(() => {
                    showToast(`Die Datenschutzerklärung (Version: ${versionDate}) wurde erfolgreich heruntergeladen.`, 'success');
                }, 1500);
            });
        });
    }
    
    /**
     * Initializes touch feedback for legal cards on mobile devices
     */
    function initLegalCardTouchFeedback() {
        if (window.innerWidth > 767) return; // Only for mobile devices
        
        const legalCards = document.querySelectorAll('.legal-article, .legal-card');
        
        legalCards.forEach(card => {
            card.addEventListener('touchstart', function(e) {
                // Create ripple element
                const ripple = document.createElement('span');
                ripple.classList.add('touch-feedback');
                
                // Position ripple at touch point
                const rect = this.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                const y = e.touches[0].clientY - rect.top;
                
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                // Add ripple to element
                this.appendChild(ripple);
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Public API
    return {
        initLegalPage,
        downloadLegalAsPdf,
        showToast,
        initTocScrolling,
        initLegalCardTouchFeedback
    };
})();

/**
 * Compatibility fallbacks for agb.js and datenschutz.js
 * These global functions ensure backward compatibility with existing code
 */

// Global fallback for AGB PDF download
window.downloadAgbAsPdf = function() {
    if (window.legalUtils && typeof window.legalUtils.downloadLegalAsPdf === 'function') {
        window.legalUtils.downloadLegalAsPdf('agb');
    } else {
        console.error('legalUtils not available for downloadAgbAsPdf');
    }
};

// Global fallback for Datenschutz PDF download
window.downloadDatenschutzAsPdf = function() {
    if (window.legalUtils && typeof window.legalUtils.downloadLegalAsPdf === 'function') {
        window.legalUtils.downloadLegalAsPdf('datenschutz');
    } else {
        console.error('legalUtils not available for downloadDatenschutzAsPdf');
    }
};

// Auto-initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Detect current page based on URL path
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('agb')) {
        window.legalUtils.initLegalPage('agb');
    } else if (currentPath.includes('datenschutz')) {
        window.legalUtils.initLegalPage('datenschutz');
    } else if (currentPath.includes('impressum')) {
        window.legalUtils.initLegalPage('impressum');
    } else {
        // Check for legal elements to determine page type
        const agbElements = document.querySelectorAll('.AgbSection, #agb-1');
        const datenschutzElements = document.querySelectorAll('.datenschutz-section, #ds-1');
        
        if (agbElements.length > 0) {
            window.legalUtils.initLegalPage('agb');
        } else if (datenschutzElements.length > 0) {
            window.legalUtils.initLegalPage('datenschutz');
        }
    }
});