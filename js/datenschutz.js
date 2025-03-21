document.addEventListener('DOMContentLoaded', function() {
    // Cookie-Einstellungen Modal
    const cookieSettingsBtn = document.getElementById('openCookieSettings');
    if (cookieSettingsBtn) {
        cookieSettingsBtn.addEventListener('click', function() {
            // Hier würde die Funktion zum Öffnen des Cookie-Modals aufgerufen werden
            console.log('Cookie-Einstellungen öffnen');
        });
    }

    // Google Analytics Opt-Out
    const gaOptOutBtn = document.getElementById('ga-opt-out');
    if (gaOptOutBtn) {
        gaOptOutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Google Analytics Opt-Out Cookie setzen
            document.cookie = 'ga-opt-out=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
            
            // Feedback zeigen
            showToast('Sie haben Google Analytics erfolgreich deaktiviert.', 'success');
        });
    }

    // Datenschutz-Anfrage Modal
    const datenschutzFormularBtn = document.getElementById('datenschutzFormular');
    const datenschutzAnfrageModal = document.getElementById('datenschutzAnfrageModal');
    const closeModalBtn = document.querySelector('#datenschutzAnfrageModal .close-modal');
    
    if (datenschutzFormularBtn && datenschutzAnfrageModal) {
        datenschutzFormularBtn.addEventListener('click', function() {
            datenschutzAnfrageModal.style.display = 'flex';
        });
        
        // Modal schließen
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                datenschutzAnfrageModal.style.display = 'none';
            });
        }
        
        // Modal schließen, wenn außerhalb geklickt wird
        window.addEventListener('click', function(event) {
            if (event.target === datenschutzAnfrageModal) {
                datenschutzAnfrageModal.style.display = 'none';
            }
        });
    }

    // Datenschutz-Anfrage Formular absenden
    const anfragaForm = document.querySelector('.legal-anfrage-form');
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
            
            // Formular zurücksetzen
            anfragaForm.reset();
        });
    }

    // PDF-Download-Funktion
    const downloadBtn = document.getElementById('datenschutzDownloadButton');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            // PDF-Erstellung und Download starten
            generatePDF();
        });
    }

    // Funktion zum Generieren des PDF
    function generatePDF() {
        // PDF-Generation mit jsPDF
        if (typeof window.jspdf !== 'undefined') {
            showToast('PDF-Erstellung wird vorbereitet...', 'info');
            
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Titel und Inhalt
            doc.setFontSize(20);
            doc.text('Datenschutzerklärung', 20, 20);
            doc.setFontSize(12);
            doc.text('Kickerscup GmbH', 20, 30);
            doc.text('Stand: 21.03.2025', 20, 40);
            
            // Inhalt extrahieren
            const articles = document.querySelectorAll('.legal-article');
            let yPosition = 50;
            
            articles.forEach(function(article, index) {
                const title = article.querySelector('h3').textContent;
                
                // Neue Seite, wenn nicht genug Platz
                if (yPosition > 260) {
                    doc.addPage();
                    yPosition = 20;
                }
                
                doc.setFontSize(14);
                doc.text(`${index+1}. ${title}`, 20, yPosition);
                yPosition += 10;
                
                // Hier würde der Inhalt des Artikels hinzugefügt werden
                // Für eine vollständige Implementierung wäre mehr Code notwendig
            });
            
            // PDF speichern
            doc.save('datenschutzerklaerung-kickerscup.pdf');
            
            showToast('Die Datenschutzerklärung wurde erfolgreich als PDF heruntergeladen.', 'success');
        } else {
            showToast('PDF-Erstellung nicht möglich. Bitte versuchen Sie es später erneut.', 'error');
        }
    }

    // Accordion-Funktion für die Artikel
    const articleHeaders = document.querySelectorAll('.legal-article-header');
    
    articleHeaders.forEach(function(header) {
        header.addEventListener('click', function() {
            // Toggle für mobile Ansicht (optional)
            const article = this.parentElement;
            article.classList.toggle('expanded');
            
            // Scrollen zu diesem Artikel (optional)
            article.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Toast-Nachrichten anzeigen
    function showToast(message, type = 'info') {
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
        
        // Toast-Inhalt
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
            closeToast(toast);
        });
        
        // Toast automatisch nach 5 Sekunden schließen
        setTimeout(() => {
            closeToast(toast);
        }, 5000);
    }

    // Toast-Nachrichten schließen
    function closeToast(toast) {
        toast.classList.remove('show');
        
        // Toast nach Animation entfernen
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }

    // Scroll zu Anker-Links (optional)
    const tocLinks = document.querySelectorAll('.legal-toc-list a');
    
    tocLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Scrollen zum Ziel
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Hervorheben des Zielelements (optional)
                targetElement.classList.add('highlight');
                setTimeout(() => {
                    targetElement.classList.remove('highlight');
                }, 2000);
            }
        });
    });

    // Version-Links
    const versionLinks = document.querySelectorAll('.legal-version-link');
    
    versionLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hier würde der Code zum Laden einer früheren Version stehen
            const version = this.querySelector('.version-date').textContent;
            showToast(`Die Version vom ${version} wird geladen...`, 'info');
        });
    });
});