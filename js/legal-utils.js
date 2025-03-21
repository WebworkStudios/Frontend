// legal-utils.js - Gemeinsame Funktionen für rechtliche Seiten (AGB, Datenschutz, Impressum)

/**
 * Initialisiert gemeinsame Funktionen für rechtliche Seiten
 * @param {string} pageType - Der Typ der Seite ('agb', 'datenschutz', 'impressum')
 */
function initLegalPage(pageType) {
    // Initialisiere PDF-Download-Funktion, falls verfügbar
    initPdfDownload(pageType);
    
    // Spezifische Initialisierungen je nach Seitentyp
    switch(pageType) {
        case 'datenschutz':
            initDatenschutzAnfrageModal();
            initCookieSettings();
            initGoogleAnalyticsOptOut();
            break;
        case 'agb':
            // AGB-spezifische Initialisierungen (falls vorhanden)
            break;
        case 'impressum':
            // Impressum-spezifische Initialisierungen (falls vorhanden)
            break;
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
            downloadButtonId = 'datenschutzDownloadButton';
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
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            // Fallback-Implementierung für Toast-Nachrichten
            const toastContainer = document.getElementById('toast-container');
            
            if (!toastContainer) {
                // Erstelle einen Toast-Container, wenn keiner existiert
                const container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
            
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
            
            document.getElementById('toast-container').appendChild(toast);
            
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
 * Lädt rechtliche Dokumente als PDF herunter
 * @param {string} pageType - Der Typ der Seite ('agb', 'datenschutz')
 */
function downloadLegalAsPdf(pageType) {
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
            
            switch(pageType) {
                case 'agb':
                    title = 'Allgemeine Geschäftsbedingungen - Kickerscup';
                    subject = 'AGB';
                    articleSelector = '.AgbArticle';
                    headerSelector = '.AgbArticleHeader h3';
                    numberSelector = '.AgbArticleNumber';
                    dateElement = document.querySelector('.elegant-heading p');
                    filename = 'Kickerscup-AGB.pdf';
                    headerText = 'Allgemeine Geschäftsbedingungen';
                    break;
                case 'datenschutz':
                    title = 'Datenschutzerklärung - Kickerscup';
                    subject = 'Datenschutz';
                    articleSelector = '.datenschutz-article';
                    headerSelector = '.datenschutz-article-header h3';
                    numberSelector = '.datenschutz-article-number';
                    dateElement = document.querySelector('.elegant-heading p');
                    filename = 'Kickerscup-Datenschutz.pdf';
                    headerText = 'Datenschutzerklärung';
                    break;
                default:
                    throw new Error('Ungültiger Seitentyp');
            }
            
            // Titel und Metadaten hinzufügen
            doc.setProperties({
                title: title,
                subject: subject,
                author: 'Kickerscup GmbH',
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
                
                // Unterschiedliche Behandlung der Inhalte je nach Seitentyp
                if (pageType === 'agb') {
                    // AGB-Artikelinhalt
                    const paragraphs = article.querySelectorAll('.AgbArticleContent p');
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(50, 50, 50);
                    
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
                } else if (pageType === 'datenschutz') {
                    // Datenschutz-Artikelinhalt
                    const contentElements = article.querySelectorAll('.datenschutz-article-content > p, .datenschutz-article-content > h4');
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
                    doc.setTextColor(50, 50, 50);
                    
                    contentElements.forEach(element => {
                        // Prüfen, ob ein Zeilenumbruch erforderlich ist
                        if (yPosition > 270) {
                            doc.addPage();
                            yPosition = 20;
                        }

                        // Überschrift formatieren
                        if (element.tagName.toLowerCase() === 'h4') {
                            doc.setFont('helvetica', 'bold');
                            doc.setFontSize(12);
                            doc.text(element.textContent, 20, yPosition);
                            yPosition += 6;
                        } else {
                            // Normalen Text formatieren
                            doc.setFont('helvetica', 'normal');
                            doc.setFontSize(11);
                            
                            // Text aufteilen und über mehrere Zeilen verteilen, falls nötig
                            const textLines = doc.splitTextToSize(element.textContent, 170);
                            doc.text(textLines, 20, yPosition);
                            yPosition += 6 * textLines.length;
                        }
                    });
                }
                
                // Abstand zwischen Artikeln
                yPosition += 10;
            });
            
            // Footer mit Unternehmensinformationen
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text('Kickerscup GmbH • Musterstraße 123 • 10115 Berlin • Deutschland', 20, 285);
                doc.text(`Seite ${i} von ${pageCount}`, 170, 285);
            }
            
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
 * Initialisiert das Datenschutz-Anfrage-Modal
 */
function initDatenschutzAnfrageModal() {
    const modalTrigger = document.getElementById('datenschutzFormular');
    const modal = document.getElementById('datenschutzAnfrageModal');
    const closeModalBtn = modal ? modal.querySelector('.close-modal') : null;
    const form = modal ? modal.querySelector('.datenschutz-anfrage-form') : null;
    
    if (modalTrigger && modal) {
        modalTrigger.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Schließen des Modals beim Klick außerhalb des Inhalts
    if (modal) {
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
    
    // Formularverarbeitung
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hier würde normalerweise der API-Aufruf zur Verarbeitung der Anfrage erfolgen
            // Für Demo-Zwecke zeigen wir nur eine Erfolgsmeldung an
            
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
    
    if (cookieSettingsBtn) {
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
}

/**
 * Google Analytics Opt-Out Funktion
 */
function initGoogleAnalyticsOptOut() {
    const gaOptOutLink = document.getElementById('ga-opt-out');
    
    if (gaOptOutLink) {
        gaOptOutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Google Analytics Opt-Out Cookie setzen
            const date = new Date();
            date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)); // 10 Jahre
            document.cookie = 'ga-opt-out=1; expires=' + date.toUTCString() + '; path=/; domain=.' + window.location.hostname + '; samesite=lax';
            
            // Wenn Google Analytics vorhanden ist, deaktivieren
            if (window['ga-disable-UA-XXXXXXXX-X']) {
                window['ga-disable-UA-XXXXXXXX-X'] = true;
            }
            
            safeShowToast('Google Analytics wurde für diese Website deaktiviert. Das Tracking-Cookie wurde gesetzt.', 'success');
        });
    }
}

// Exportiere die Funktionen für den globalen Zugriff
window.legalUtils = {
    initLegalPage,
    downloadLegalAsPdf,
    safeShowToast
};