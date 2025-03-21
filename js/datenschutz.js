// datenschutz.js - JavaScript für die Datenschutzseite (mit vereinheitlichter Logik)

document.addEventListener('DOMContentLoaded', function() {
    // Initialisiere die Datenschutz-Seite mit den gemeinsamen Funktionen aus legal-utils.js
    if (window.legalUtils && typeof window.legalUtils.initLegalPage === 'function') {
        window.legalUtils.initLegalPage('datenschutz');
    } else {
        console.warn('legal-utils.js ist nicht geladen oder enthält nicht die erwarteten Funktionen');
        // Fallback: Initialisiere die wichtigsten Funktionen direkt
        initPdfDownload();
        initDatenschutzAnfrageModal();
        initCookieSettings();
        initGoogleAnalyticsOptOut();
    }
});

// Legacy-Funktionen für den Fall, dass legal-utils nicht verfügbar ist
function initPdfDownload() {
    const downloadButton = document.getElementById('datenschutzDownloadButton');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadDatenschutzAsPdf);
    }
}

// Hilfsfunktion für Toast-Nachrichten, falls die globale nicht verfügbar ist
function safeShowToast(message, type) {
    if (window.legalUtils && typeof window.legalUtils.safeShowToast === 'function') {
        window.legalUtils.safeShowToast(message, type);
        return;
    }
    
    // Fallback-Implementierung
    try {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`${type}: ${message}`);
        }
    } catch (e) {
        console.warn('Failed to show toast:', e);
    }
}

// Funktion zum Herunterladen der Datenschutzerklärung als PDF
function downloadDatenschutzAsPdf() {
    if (window.legalUtils && typeof window.legalUtils.downloadLegalAsPdf === 'function') {
        window.legalUtils.downloadLegalAsPdf('datenschutz');
        return;
    }
    
    // Fallback-Implementierung für den Fall, dass legal-utils nicht verfügbar ist
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
            
            // Titel und Metadaten hinzufügen
            doc.setProperties({
                title: 'Datenschutzerklärung - Kickerscup',
                subject: 'Datenschutz',
                author: 'Kickerscup GmbH',
                keywords: 'Datenschutz, DSGVO, Kickerscup',
                creator: 'Kickerscup'
            });
            
            // Content für das PDF extrahieren
            const articlesContainer = document.querySelector('.datenschutz-articles');
            const titleElement = document.querySelector('.elegant-heading h1');
            const dateElement = document.querySelector('.elegant-heading p');
            
            // Einstellungen für Text
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.setTextColor(255, 138, 0); // Primary-Farbe
            
            // Titel hinzufügen
            doc.text('Datenschutzerklärung', 20, 20);
            
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
            const articles = document.querySelectorAll('.datenschutz-article');
            
            articles.forEach((article, index) => {
                // Wenn die Position zu weit unten ist, neue Seite anfangen
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                const header = article.querySelector('.datenschutz-article-header h3').textContent;
                const number = article.querySelector('.datenschutz-article-number').textContent;
                
                // Artikelnummer und Header
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(255, 138, 0);
                doc.text(`${number}. ${header}`, 20, yPosition);
                yPosition += 8;
                
                // Artikelinhalt
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
            doc.save('Kickerscup-Datenschutz.pdf');
            
            // Erfolgsmeldung anzeigen
            safeShowToast('Datenschutzerklärung wurde erfolgreich als PDF heruntergeladen!', 'success');
            
        } catch (error) {
            console.error('Fehler beim Erstellen des PDFs:', error);
            safeShowToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        }
    }, 300);
}

// Initialisierung des Datenschutz-Anfrage-Modals
function initDatenschutzAnfrageModal() {
    if (window.legalUtils && typeof window.legalUtils.initDatenschutzAnfrageModal === 'function') {
        return; // Die Funktion wird bereits von legal-utils aufgerufen
    }
    
    // Fallback-Implementierung
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

// Initialisierung der Cookie-Einstellungen
function initCookieSettings() {
    if (window.legalUtils && typeof window.legalUtils.initCookieSettings === 'function') {
        return; // Die Funktion wird bereits von legal-utils aufgerufen
    }
    
    // Fallback-Implementierung
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

// Google Analytics Opt-Out Funktion
function initGoogleAnalyticsOptOut() {
    if (window.legalUtils && typeof window.legalUtils.initGoogleAnalyticsOptOut === 'function') {
        return; // Die Funktion wird bereits von legal-utils aufgerufen
    }
    
    // Fallback-Implementierung
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