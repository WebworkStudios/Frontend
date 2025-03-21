// agb.js - JavaScript für die AGB-Seite (mit vereinheitlichter Logik)

document.addEventListener('DOMContentLoaded', function() {
    // Initialisiere die AGB-Seite mit den gemeinsamen Funktionen aus legal-utils.js
    if (window.legalUtils && typeof window.legalUtils.initLegalPage === 'function') {
        window.legalUtils.initLegalPage('agb');
    } else {
        console.warn('legal-utils.js ist nicht geladen oder enthält nicht die erwarteten Funktionen');
        // Fallback: Initialisiere die wichtigsten Funktionen direkt
        initPdfDownload();
        initTocScrolling();
        initLegalCardTouchFeedback();
    }
});

// Fallback-Funktion: Initialisiert Scroll-Animation für Inhaltsverzeichnislinks
function initTocScrolling() {
    const tocLinks = document.querySelectorAll('.legal-toc-list a');
    
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
                }
            
        } catch (error) {
            console.error('Fehler beim Erstellen des PDFs:', error);
            if (typeof showToast === 'function') {
                showToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
            }
        }
    }, 300);
};);
                
                // Hervorheben des Zielelements
                targetElement.classList.add('highlight-section');
                setTimeout(() => {
                    targetElement.classList.remove('highlight-section');
                }, 2000);
                
                // Setze Hash in der URL (für Direktlinks)
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Fallback-Funktion: Initialisiert die PDF-Download-Funktionalität
function initPdfDownload() {
    const downloadButton = document.getElementById('agbDownloadButton');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadAgbAsPdf);
    }
}

// Fallback-Funktion: Initialisiert Touch-Feedback für Legal Cards auf mobilen Geräten
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

// Funktion zum Herunterladen der AGB als PDF im globalen Scope definieren
// Diese Funktion wird nur als Fallback verwendet, wenn legal-utils nicht verfügbar ist
window.downloadAgbAsPdf = function() {
    if (window.legalUtils && typeof window.legalUtils.downloadLegalAsPdf === 'function') {
        window.legalUtils.downloadLegalAsPdf('agb');
        return;
    }
    
    // Fallback-Implementierung (verändert für legal.css Kompatibilität)
    // Anzeigen eines Lade-Toasts
    if (typeof showToast === 'function') {
        showToast('PDF wird erstellt. Bitte warten...', 'info');
    } else {
        console.log('PDF wird erstellt. Bitte warten...');
    }
    
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
                title: 'Allgemeine Geschäftsbedingungen - Kickerscup',
                subject: 'AGB',
                author: 'Jan Steiger, Betreiber des Spiels „Kickerscup“.',
                keywords: 'AGB, Nutzungsbedingungen, Kickerscup',
                creator: 'Kickerscup'
            });
            
            // Content für das PDF extrahieren
            const articlesContainer = document.querySelector('.legal-articles');
            const titleElement = document.querySelector('.elegant-heading h1');
            const dateElement = document.querySelector('.elegant-heading p');
            
            // Einstellungen für Text
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(18);
            doc.setTextColor(255, 138, 0); // Primary-Farbe
            
            // Titel hinzufügen
            doc.text('Allgemeine Geschäftsbedingungen', 20, 20);
            
            // Datum hinzufügen
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`${dateElement ? dateElement.textContent : 'Gültig ab: 21.03.2025'}`, 20, 30);
            
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
            doc.save('Kickerscup-AGB.pdf');
            
            // Erfolgsmeldung anzeigen
            if (typeof showToast === 'function') {
                showToast('AGB wurden erfolgreich als PDF heruntergeladen!', 'success');
            }
            
        } catch (error) {
            console.error('Fehler beim Erstellen des PDFs:', error);
            if (typeof showToast === 'function') {
                showToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
            }
        }
    }, 300);
};