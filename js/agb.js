// agb.js - JavaScript für die AGB-Seite

document.addEventListener('DOMContentLoaded', function() {
    // Initialisiere PDF-Download-Funktion
    initPdfDownload();
});

// Initialisierung der PDF-Download-Funktionalität
function initPdfDownload() {
    const downloadButton = document.getElementById('agbDownloadButton');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadAgbAsPdf);
    }
}

// Hilfsfunktion für Toast-Nachrichten, falls die globale nicht verfügbar ist
function safeShowToast(message, type) {
    try {
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

// Funktion zum Herunterladen der AGB als PDF im globalen Scope definieren
window.downloadAgbAsPdf = function() {
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
            
            // Titel und Metadaten hinzufügen
            doc.setProperties({
                title: 'Allgemeine Geschäftsbedingungen - Kickerscup',
                subject: 'AGB',
                author: 'Kickerscup GmbH',
                keywords: 'AGB, Nutzungsbedingungen, Kickerscup',
                creator: 'Kickerscup'
            });
            
            // Content für das PDF extrahieren
            const articlesContainer = document.querySelector('.AgbArticles');
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
            const articles = document.querySelectorAll('.AgbArticle');
            
            articles.forEach((article, index) => {
                // Wenn die Position zu weit unten ist, neue Seite anfangen
                if (yPosition > 270) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                const header = article.querySelector('.AgbArticleHeader h3').textContent;
                const number = article.querySelector('.AgbArticleNumber').textContent;
                
                // Artikelnummer und Header
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(14);
                doc.setTextColor(255, 138, 0);
                doc.text(`${number}. ${header}`, 20, yPosition);
                yPosition += 8;
                
                // Artikelinhalt
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
            doc.save('Kickerscup-AGB.pdf');
            
            // Erfolgsmeldung anzeigen
            showToast('AGB wurden erfolgreich als PDF heruntergeladen!', 'success');
            
        } catch (error) {
            console.error('Fehler beim Erstellen des PDFs:', error);
            showToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        }
    }, 300);
}

// Alternative Implementierung mit html2canvas für komplexere Layouts
function downloadAgbWithHtml2Canvas() {
    showToast('PDF wird erstellt. Bitte warten...', 'info');
    
    const { jsPDF } = window.jspdf;
    const articles = document.querySelectorAll('.AgbArticle');
    const doc = new jsPDF('p', 'mm', 'a4');
    
    let promises = [];
    
    // Titel hinzufügen
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Allgemeine Geschäftsbedingungen', 20, 20);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Kickerscup GmbH - Gültig ab: 21.03.2025', 20, 30);
    
    let currentPage = 0;
    let yOffset = 40;
    
    // Jeder Artikel wird als Bild gerendert
    articles.forEach((article, index) => {
        const promise = html2canvas(article, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth() - 40;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            // Neue Seite, wenn nicht genug Platz ist
            if (yOffset + pdfHeight > 280) {
                doc.addPage();
                currentPage++;
                yOffset = 20;
            }
            
            doc.addImage(imgData, 'PNG', 20, yOffset, pdfWidth, pdfHeight);
            yOffset += pdfHeight + 10;
            
            return { index, complete: true };
        });
        
        promises.push(promise);
    });
    
    // Warten bis alle Artikel gerendert wurden
    Promise.all(promises)
        .then(() => {
            // Footer auf jeder Seite
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text('Kickerscup GmbH • Musterstraße 123 • 10115 Berlin • Deutschland', 20, 285);
                doc.text(`Seite ${i} von ${pageCount}`, 170, 285);
            }
            
            doc.save('Kickerscup-AGB.pdf');
            safeShowToast('AGB wurden erfolgreich als PDF heruntergeladen!', 'success');
        })
        .catch(error => {
            console.error('Fehler beim Erstellen des PDFs:', error);
            safeShowToast('Beim Erstellen des PDFs ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.', 'error');
        });
};