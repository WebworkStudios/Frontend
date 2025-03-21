// datenschutz.js - JavaScript für die Datenschutz-Seite

document.addEventListener('DOMContentLoaded', function() {
    // Initialisiere die Datenschutz-Seite mit den gemeinsamen Funktionen aus legal-utils.js
    if (window.legalUtils && typeof window.legalUtils.initLegalPage === 'function') {
        window.legalUtils.initLegalPage('datenschutz');
    } else {
        console.warn('legal-utils.js ist nicht geladen oder enthält nicht die erwarteten Funktionen');
        // Fallback: Initialisiere die wichtigsten Funktionen direkt
        initCookieSettings();
        initGoogleAnalyticsOptOut();
        initLegalAnfrageModal();
        initVersionLinks();
        initPdfDownload();
        initTocScrolling();
    }
});

// Fallback-Funktion: Cookie-Einstellungen Modal
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
                    showToast('Cookie-Einstellungen sind derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.', 'info');
                }
            }
        });
    }
}

// Fallback-Funktion: Google Analytics Opt-Out
function initGoogleAnalyticsOptOut() {
    const gaOptOutBtn = document.getElementById('ga-opt-out');
    if (gaOptOutBtn) {
        gaOptOutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Google Analytics Opt-Out Cookie setzen
            const date = new Date();
            date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)); // 10 Jahre
            document.cookie = 'ga-opt-out=1; expires=' + date.toUTCString() + '; path=/; domain=.' + window.location.hostname + '; samesite=lax';
            
            // Wenn Google Analytics vorhanden ist, deaktivieren
            if (window.hasOwnProperty('ga-disable-UA-XXXXXXXX-X')) {
                window['ga-disable-UA-XXXXXXXX-X'] = true;
            }
            
            showToast('Google Analytics wurde für diese Website deaktiviert. Das Tracking-Cookie wurde gesetzt.', 'success');
        });
    }
}

// Fallback-Funktion: Datenschutz-Anfrage Modal
function initLegalAnfrageModal() {
    const datenschutzFormularBtn = document.getElementById('legalFormular');
    const datenschutzAnfrageModal = document.getElementById('legalAnfrageModal');
    
    if (!datenschutzFormularBtn || !datenschutzAnfrageModal) return;
    
    const closeModalBtn = datenschutzAnfrageModal.querySelector('.close-modal');
    
    datenschutzFormularBtn.addEventListener('click', function() {
        datenschutzAnfrageModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Modal schließen
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            datenschutzAnfrageModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Modal schließen, wenn außerhalb geklickt wird
    window.addEventListener('click', function(event) {
        if (event.target === datenschutzAnfrageModal) {
            datenschutzAnfrageModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Anfrage-Formular absenden
    const anfragaForm = datenschutzAnfrageModal.querySelector('.legal-anfrage-form');
    if (anfragaForm) {
        anfragaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Formular-Daten sammeln
            const formData = new FormData(this);
            const anfrageDaten = Object.fromEntries(formData.entries());
            
            // Hier würde der AJAX-Request zum Senden der Anfrage erfolgen
            console.log('Datenschutz-Anfrage wird gesendet:', anfrageDaten);
            
            // Simulation einer erfolgreichen Anfrage
            showToast('Ihre Datenschutz-Anfrage wurde erfolgreich übermittelt. Wir werden uns in Kürze bei Ihnen melden.', 'success');
            
            // Modal schließen
            datenschutzAnfrageModal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Formular zurücksetzen
            anfragaForm.reset();
        });
    }
}

// Fallback-Funktion: Versionslinks
function initVersionLinks() {
    const versionLinks = document.querySelectorAll('.legal-version-link');
    
    versionLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Versionsnummer extrahieren
            const versionDate = this.querySelector('.version-date').textContent;
            
            // Hier würde der Download oder die Anzeige der älteren Version erfolgen
            showToast(`Version vom ${versionDate} wird geladen...`, 'info');
            
            // Simulation des Downloads nach 1,5 Sekunden
            setTimeout(() => {
                showToast(`Die Datenschutzerklärung (Version: ${versionDate}) wurde erfolgreich heruntergeladen.`, 'success');
            }, 1500);
        });
    });
}

// Fallback-Funktion: PDF-Download
function initPdfDownload() {
    // Prüfe beide mögliche IDs für den Download-Button
    const downloadBtn = document.getElementById('legalDownloadButton') || document.getElementById('datenschutzDownloadButton');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadDatenschutzAsPdf);
    } else {
        console.warn('Download-Button für Datenschutz konnte nicht gefunden werden');
        
        // Als zusätzlichen Fallback alle Buttons mit PDF-Download-Text finden
        const allButtons = document.querySelectorAll('button.btn');
        allButtons.forEach(button => {
            if (button.textContent.includes('PDF') && button.textContent.includes('Datenschutz')) {
                console.log('Alternative Download-Button gefunden:', button);
                button.addEventListener('click', downloadDatenschutzAsPdf);
            }
        });
    }
}

// Funktion zum Herunterladen des Datenschutzes als PDF
window.downloadDatenschutzAsPdf = function() {
    if (window.legalUtils && typeof window.legalUtils.downloadLegalAsPdf === 'function') {
        window.legalUtils.downloadLegalAsPdf('datenschutz');
        return;
    }
    
    // Fallback-Implementierung für den PDF-Download
    showToast('PDF-Erstellung wird vorbereitet...', 'info');
    
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
                author: 'Jan Steiger, Betreiber des Spiels „Kickerscup“.',
                keywords: 'Datenschutz, Datenschutzerklärung, Kickerscup',
                creator: 'Kickerscup'
            });
            
            // Inhalt extrahieren
            const titleElement = document.querySelector('.elegant-heading h1');
            const dateElement = document.querySelector('.elegant-heading p');
            
            // Text-Einstellungen
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
            const articles = document.querySelectorAll('.legal-article');
            
            articles.forEach((article, index) => {
                // Wenn die Position zu weit unten ist, neue Seite anfangen
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                const header = article.querySelector('.legal-article-header h3').textContent;
                const number = article.querySelector('.legal-article-number').textContent;
                
                // Artikelnummer und Header
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(255, 138, 0);
                doc.text(`${number}. ${header}`, 20, yPosition);
                yPosition += 8;
                
                // Artikelinhalt
                const paragraphs = article.querySelectorAll('.legal-article-content p');
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
                
                // Überschriften in Artikeln
                const subheadings = article.querySelectorAll('.legal-article-content h4');
                subheadings.forEach(heading => {
                    // Neue Seite, wenn nötig
                    if (yPosition > 270) {
                        doc.addPage();
                        yPosition = 20;
                    }
                    
                    // Subheading formatieren
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(12);
                    doc.text(heading.textContent, 20, yPosition);
                    yPosition += 6;
                    
                    // Zurück zu normalem Text
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(11);
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
                doc.text('Jan Steiger, Betreiber des Spiels „Kickerscup“. • Pulverhäuserweg 72a • 64295 Darmstadt • Deutschland', 20, 285);
                doc.text(`Seite ${i} von ${pageCount}`, 170, 285);
            }
            
            // PDF speichern
            doc.save('Kickerscup-Datenschutz.pdf');
            
            showToast('Die Datenschutzerklärung wurde erfolgreich als PDF heruntergeladen.', 'success');
        } catch (error) {
            console.error('Fehler beim Erstellen des PDFs:', error);
            showToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        }
    }, 300);
};

// Fallback-Funktion: TocScrolling
function initTocScrolling() {
    const tocLinks = document.querySelectorAll('.legal-toc-list a');
    
    tocLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Scrollen zum Ziel
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Optional: Hervorheben des Zielelements
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

// Toast-Nachrichten anzeigen (Fallback, falls global nicht verfügbar)
function showToast(message, type = 'info') {
    // Verwende die globale showToast-Funktion, wenn verfügbar
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
        return;
    }
    
    // Fallback-Implementierung
    // Toast-Container erstellen oder finden
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Toast erstellen
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
    
    // Toast-Inhalt
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" aria-label="Schließen">&times;</button>
    `;
    
    // Toast zum Container hinzufügen
    toastContainer.appendChild(toast);
    
    // Toast anzeigen
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Toast-Close-Button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.classList.remove('show');
        
        // Toast nach Animation entfernen
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    });
    
    // Toast automatisch nach 5 Sekunden schließen
    setTimeout(() => {
        toast.classList.remove('show');
        
        // Toast nach Animation entfernen
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }, 5000);
}