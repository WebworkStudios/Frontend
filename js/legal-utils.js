// legal-utils.js - Gemeinsame Funktionen für rechtliche Seiten (AGB, Datenschutz, Impressum)

/**
 * Namespace für gemeinsame Funktionen der rechtlichen Seiten
 */
window.legalUtils = (function() {
    /**
     * Initialisiert gemeinsame Funktionen für rechtliche Seiten
     * @param {string} pageType - Der Typ der Seite ('agb', 'datenschutz', 'impressum')
     */
    function initLegalPage(pageType) {
        // Initialisiere PDF-Download-Funktion, falls verfügbar
        initPdfDownload(pageType);
        
        // Initialisiere Scroll-Animation für die Inhaltsverzeichnislinks
        initTocScrolling(pageType);
        
        // Spezifische Initialisierungen je nach Seitentyp
        switch(pageType) {
            case 'datenschutz':
                initDatenschutzAnfrageModal();
                initCookieSettings();
                initGoogleAnalyticsOptOut();
                initVersionLinks();
                break;
            case 'agb':
                // AGB-spezifische Initialisierungen (falls vorhanden)
                break;
            case 'impressum':
                // Impressum-spezifische Initialisierungen (falls vorhanden)
                break;
        }
        
        // Initialisiere Touch-Feedback für Rechtskarten auf mobilen Geräten
        initLegalCardTouchFeedback();
    }

    /**
     * Initialisiert Scroll-Animation für Inhaltsverzeichnislinks
     * @param {string} pageType - Der Typ der Seite ('agb', 'datenschutz', 'impressum')
     */
    function initTocScrolling(pageType) {
        let tocSelector;
        
        // Universeller Selektor für legal.css
        tocSelector = '.legal-toc-list a';
        
        const tocLinks = document.querySelectorAll(tocSelector);
        
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Scroll mit Animation zum Ziel
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset für Header
                        behavior: 'smooth'
                    });
                    
                    // Füge kurzzeitig eine Hervorhebung hinzu
                    targetElement.classList.add('highlight-section');
                    setTimeout(() => {
                        targetElement.classList.remove('highlight-section');
                    }, 2000);
                    
                    // Setze Hash in der URL (für Direktlinks)
                    history.pushState(null, null, targetId);
                }
            });
        });
        
        // Überprüfe, ob ein Hash in der URL ist und scrolle dorthin
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                // Verzögerung, um sicherzustellen, dass die Seite vollständig geladen ist
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
     * Initialisiert die PDF-Download-Funktionalität
     * @param {string} pageType - Der Typ der Seite ('agb', 'datenschutz')
     */
    function initPdfDownload(pageType) {
        let downloadButtonId;
        
        switch(pageType) {
            case 'agb':
                downloadButtonId = 'agbDownloadButton';
                break;
            case 'datenschutz':
                // Prüfe beide mögliche IDs für Datenschutz-Download-Button
                if (document.getElementById('datenschutzDownloadButton')) {
                    downloadButtonId = 'datenschutzDownloadButton';
                } else if (document.getElementById('legalDownloadButton')) {
                    downloadButtonId = 'legalDownloadButton';
                }
                break;
            default:
                return; // Wenn kein PDF-Download erforderlich ist
        }
        
        const downloadButton = document.getElementById(downloadButtonId);
        
        if (downloadButton) {
            downloadButton.addEventListener('click', function() {
                downloadLegalAsPdf(pageType);
            });
        }
    }

    /**
     * Hilfsfunktion für Toast-Nachrichten, falls die globale nicht verfügbar ist
     * @param {string} message - Die anzuzeigende Nachricht
     * @param {string} type - Der Typ der Nachricht ('success', 'error', 'warning', 'info')
     */
    function safeShowToast(message, type) {
        try {
            // Prüfen, ob die globale showToast-Funktion verfügbar ist
            if (typeof window.showToast === 'function') {
                window.showToast(message, type);
            } else {
                // Fallback-Implementierung für Toast-Nachrichten
                const toastContainer = document.getElementById('toast-container') || createToastContainer();
                
                const toast = document.createElement('div');
                toast.className = `toast toast-${type || 'info'}`;
                
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
        } catch (e) {
            console.warn('Failed to show toast:', e);
        }
    }
    
    /**
     * Erstellt einen Toast-Container, wenn noch keiner existiert
     * @returns {HTMLElement} Der Toast-Container
     */
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    /**
     * Lädt rechtliche Dokumente als PDF herunter
     * @param {string} pageType - Der Typ der Seite ('agb', 'datenschutz')
     */
    function downloadLegalAsPdf(pageType) {
        // Prüfen, ob die jsPDF-Bibliothek geladen ist
        if (typeof window.jspdf === 'undefined') {
            safeShowToast('Die PDF-Bibliothek konnte nicht geladen werden. Bitte versuchen Sie es später erneut.', 'error');
            return;
        }
        
        // Anzeigen eines Lade-Toasts
        safeShowToast('PDF wird erstellt. Bitte warten...', 'info');
        
        // Verzögerung, um dem Toast Zeit zur Anzeige zu geben
        setTimeout(() => {
            try {
                // Die jsPDF-Bibliothek initialisieren
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                    compress: true
                });
                
                // Konfiguration basierend auf Seitentyp
                let title, subject, articleSelector, headerSelector, numberSelector, dateElement;
                let filename, headerText;
                let contentSelectors;
                
                switch(pageType) {
                    case 'agb':
                        title = 'Allgemeine Geschäftsbedingungen - Kickerscup';
                        subject = 'AGB';
                        articleSelector = '.legal-article';
                        headerSelector = '.legal-article-header h3';
                        numberSelector = '.legal-article-number';
                        dateElement = document.querySelector('.elegant-heading p');
                        filename = 'Kickerscup-AGB.pdf';
                        headerText = 'Allgemeine Geschäftsbedingungen';
                        contentSelectors = ['.legal-article-content p', '.legal-article-content ul li'];
                        break;
                    case 'datenschutz':
                        title = 'Datenschutzerklärung - Kickerscup';
                        subject = 'Datenschutz';
                        articleSelector = '.legal-article';
                        headerSelector = '.legal-article-header h3';
                        numberSelector = '.legal-article-number';
                        dateElement = document.querySelector('.elegant-heading p');
                        filename = 'Kickerscup-Datenschutz.pdf';
                        headerText = 'Datenschutzerklärung';
                        contentSelectors = ['.legal-article-content p', '.legal-article-content h4', '.legal-article-content ul li'];
                        break;
                    default:
                        throw new Error('Ungültiger Seitentyp');
                }
                
                // Titel und Metadaten hinzufügen
                doc.setProperties({
                    title: title,
                    subject: subject,
                    author: 'Jan Steiger, Betreiber des Spiels „Kickerscup“.',
                    keywords: `${subject}, Kickerscup`,
                    creator: 'Kickerscup'
                });
                
                // Einstellungen für Text
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(18);
                doc.setTextColor(255, 138, 0); // Primary-Farbe
                
                // Titel hinzufügen
                doc.text(headerText, 20, 20);
                
                // Datum hinzufügen
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.setTextColor(100, 100, 100);
                doc.text(`${dateElement ? dateElement.textContent : 'Stand: 21.03.2025'}`, 20, 30);
                
                // Horizontal Line
                doc.setDrawColor(255, 138, 0);
                doc.setLineWidth(0.5);
                doc.line(20, 35, 190, 35);
                
                // Artikelinhalt extrahieren und in PDF einfügen
                let yPosition = 45;
                const articles = document.querySelectorAll(articleSelector);
                
                articles.forEach((article, index) => {
                    // Wenn die Position zu weit unten ist, neue Seite anfangen
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    const header = article.querySelector(headerSelector).textContent;
                    const number = article.querySelector(numberSelector).textContent;
                    
                    // Artikelnummer und Header
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.setTextColor(255, 138, 0);
                    doc.text(`${number}. ${header}`, 20, yPosition);
                    yPosition += 8;
                    
                    // Artikelinhalt
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(50, 50, 50);
                    
                    const paragraphs = article.querySelectorAll('.legal-article-content p');
                    paragraphs.forEach(paragraph => {
                        // Prüfen, ob ein Zeilenumbruch erforderlich ist
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }

                        // Text aufteilen und über mehrere Zeilen verteilen, falls nötig
                        const textLines = doc.splitTextToSize(paragraph.textContent, 170);
                        doc.text(textLines, 20, yPosition);
                        yPosition += 6 * textLines.length;
                    });
                    
                    const listItems = article.querySelectorAll('.legal-article-content ul li, .legal-list li');
                    listItems.forEach(item => {
                        // Prüfen, ob ein Zeilenumbruch erforderlich ist
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }

                        // Text mit Aufzählungszeichen
                        const textLines = doc.splitTextToSize(`• ${item.textContent}`, 165);
                        doc.text(textLines, 25, yPosition);
                        yPosition += 6 * textLines.length;
                    });
                    
                    // Abstand zwischen Artikeln
                    yPosition += 10;
                });
                
                // Footer mit Unternehmensinformationen
                addDocumentFooter(doc);
                
                // PDF speichern
                doc.save(filename);
                
                // Erfolgsmeldung anzeigen
                safeShowToast(`${subject} wurde erfolgreich als PDF heruntergeladen!`, 'success');
                
            } catch (error) {
                console.error('Fehler beim Erstellen des PDFs:', error);
                safeShowToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
            }
        }, 300);
    }
    
    /**
     * Fügt einen Footer zu allen Seiten des Dokuments hinzu
     * @param {Object} doc - Das PDF-Dokument
     */
    function addDocumentFooter(doc) {
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text('Jan Steiger, Betreiber des Spiels „Kickerscup“. • Pulverhäuserweg 72a • 64295 Darmstadt • Deutschland', 20, 285);
            doc.text(`Seite ${i} von ${pageCount}`, 170, 285);
        }
    }

    /**
     * Initialisiert das Datenschutz-Anfrage-Modal
     */
    function initDatenschutzAnfrageModal() {
        const modalTrigger = document.getElementById('datenschutzFormular');
        // Korrigiert auf "legalFormular" basierend auf der HTML-Vorlage
        if (!modalTrigger) {
            const legalFormular = document.getElementById('legalFormular');
            if (legalFormular) {
                initializeModal(legalFormular, 'legalAnfrageModal');
            }
            return;
        }
        
        initializeModal(modalTrigger, 'datenschutzAnfrageModal');
    }
    
    /**
     * Initialisiert ein Modal für Anfragen
     * @param {HTMLElement} trigger - Das Auslöserelement
     * @param {string} modalId - Die ID des Modals
     */
    function initializeModal(trigger, modalId) {
        const modal = document.getElementById(modalId);
        const closeModalBtn = modal ? modal.querySelector('.close-modal') : null;
        const form = modal ? modal.querySelector('.legal-anfrage-form') : null;
        
        if (!trigger || !modal) return;
        
        trigger.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Schließen des Modals beim Klick außerhalb des Inhalts
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Formularverarbeitung
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Hier würde normalerweise der API-Aufruf zur Verarbeitung der Anfrage erfolgen
                // Demo-Implementierung
                
                safeShowToast('Ihre Datenschutz-Anfrage wurde erfolgreich übermittelt. Wir werden uns schnellstmöglich bei Ihnen melden.', 'success');
                
                // Modal schließen und Formular zurücksetzen
                modal.style.display = 'none';
                document.body.style.overflow = '';
                form.reset();
            });
        }
    }

    /**
     * Initialisiert die Cookie-Einstellungen
     */
    function initCookieSettings() {
        const cookieSettingsBtn = document.getElementById('openCookieSettings');
        
        if (!cookieSettingsBtn) return;
        
        cookieSettingsBtn.addEventListener('click', function() {
            // Wenn es einen globalen Cookie-Banner gibt, diesen anzeigen
            if (window.showCookieBanner && typeof window.showCookieBanner === 'function') {
                window.showCookieBanner();
            } else {
                // Fallback, wenn keine globale Funktion verfügbar ist
                const cookieBanner = document.getElementById('cookie-banner');
                if (cookieBanner) {
                    cookieBanner.style.display = 'block';
                    // Aktiviere Details-Ansicht
                    const detailsToggle = document.getElementById('cookie-details-toggle');
                    const detailsContent = document.getElementById('cookie-details');
                    if (detailsToggle && detailsContent) {
                        detailsContent.classList.add('active');
                        detailsToggle.classList.add('active');
                        detailsToggle.setAttribute('aria-expanded', 'true');
                        detailsToggle.querySelector('.toggle-text').textContent = 'Details ausblenden';
                    }
                } else {
                    safeShowToast('Cookie-Einstellungen sind derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.', 'info');
                }
            }
        });
    }

    /**
     * Google Analytics Opt-Out Funktion
     */
    function initGoogleAnalyticsOptOut() {
        const gaOptOutLink = document.getElementById('ga-opt-out');
        
        if (!gaOptOutLink) return;
        
        gaOptOutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Google Analytics Opt-Out Cookie setzen
            const date = new Date();
            date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)); // 10 Jahre
            document.cookie = 'ga-opt-out=1; expires=' + date.toUTCString() + '; path=/; domain=.' + window.location.hostname + '; samesite=lax';
            
            // Wenn Google Analytics vorhanden ist, deaktivieren
            if (window.hasOwnProperty('ga-disable-UA-XXXXXXXX-X')) {
                window['ga-disable-UA-XXXXXXXX-X'] = true;
            }
            
            safeShowToast('Google Analytics wurde für diese Website deaktiviert. Das Tracking-Cookie wurde gesetzt.', 'success');
        });
    }
    
    /**
     * Initialisiert Links zu früheren Versionen der Datenschutzerklärung
     */
    function initVersionLinks() {
        const versionLinks = document.querySelectorAll('.legal-version-link');
        
        if (!versionLinks.length) return;
        
        versionLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const versionDate = this.querySelector('.version-date').textContent;
                
                // Hier würde normalerweise der Download der entsprechenden Version erfolgen
                // Demo-Implementierung
                safeShowToast(`Version vom ${versionDate} wird heruntergeladen...`, 'info');
                
                // Simuliere Verzögerung für den Download
                setTimeout(() => {
                    safeShowToast(`Die Datenschutzerklärung (Version: ${versionDate}) wurde erfolgreich heruntergeladen.`, 'success');
                }, 1500);
            });
        });
    }
    
    /**
     * Initialisiert Touch-Feedback für Legal Cards auf mobilen Geräten
     */
    function initLegalCardTouchFeedback() {
        if (window.innerWidth > 767) return; // Nur für mobile Geräte
        
        const legalCards = document.querySelectorAll('.legal-article');
        
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
    
    /**
     * Prüft, ob ein bestimmtes Feature verfügbar ist
     * @param {string} featureName - Der Name des Features
     * @returns {boolean} Gibt true zurück, wenn das Feature verfügbar ist
     */
    function isFeatureAvailable(featureName) {
        // In einer realen Implementierung könnte hier eine Konfiguration geprüft werden
        // Demo-Implementierung gibt immer true zurück
        return true;
    }

    // Öffentliche API
    return {
        initLegalPage,
        downloadLegalAsPdf,
        safeShowToast,
        isFeatureAvailable
    };
})();

// Automatische Initialisierung, wenn das DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Erkennen der aktuellen Seite anhand der URL oder des Body-Klassennamens
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('agb')) {
        window.legalUtils.initLegalPage('agb');
    } else if (currentPath.includes('datenschutz')) {
        window.legalUtils.initLegalPage('datenschutz');
    } else if (currentPath.includes('impressum')) {
        window.legalUtils.initLegalPage('impressum');
    }
});