// changelog.js - JavaScript für die Changelog-Seite

document.addEventListener('DOMContentLoaded', function() {
    initChangelogFilters();
    initVersionToggles();
    expandLatestVersion();
    handleUrlParams();
});

/**
 * Initialisiert die Filter für die Changelog-Einträge
 */
function initChangelogFilters() {
    const versionFilter = document.getElementById('version-filter');
    const categoryFilters = document.querySelectorAll('.changelog-category-filter input');
    const searchInput = document.getElementById('changelog-search');
    const resetButton = document.getElementById('reset-filters');
    
    // Event-Listener für die Filteränderungen
    if (versionFilter) {
        versionFilter.addEventListener('change', applyFilters);
    }
    
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    if (searchInput) {
        // Verzögerung beim Suchen hinzufügen (debounce)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(applyFilters, 300);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

/**
 * Wendet alle Filter an und aktualisiert die Anzeige der Changelog-Einträge
 */
function applyFilters() {
    const versionFilter = document.getElementById('version-filter');
    const categoryFilters = document.querySelectorAll('.changelog-category-filter input:checked');
    const searchInput = document.getElementById('changelog-search');
    
    const selectedVersion = versionFilter ? versionFilter.value : 'all';
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const selectedCategories = Array.from(categoryFilters).map(filter => filter.value);
    
    // Alle Versionseinträge durchgehen und filtern
    const versionEntries = document.querySelectorAll('.changelog-version');
    let visibleCount = 0;
    
    versionEntries.forEach(entry => {
        const version = entry.getAttribute('data-version');
        const versionNumber = version.split('.').slice(0, 2).join('.');
        const versionMatch = selectedVersion === 'all' || versionNumber === selectedVersion;
        
        // Kategorie-Elemente in diesem Versionseintrag
        const categoryElements = entry.querySelectorAll('.changelog-category');
        let hasVisibleCategory = false;
        
        categoryElements.forEach(category => {
            // Kategoriename aus dem Klassennamen extrahieren
            const categoryClasses = Array.from(category.classList);
            const categoryName = categoryClasses.find(cls => 
                cls !== 'changelog-category' && selectedCategories.some(selected => cls.includes(selected))
            );
            
            const categoryVisible = !!categoryName;
            
            // Suche in den Listenelementen dieser Kategorie
            const items = category.querySelectorAll('li');
            let hasMatchingItem = false;
            
            if (searchTerm) {
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        hasMatchingItem = true;
                        // Suchergebnis hervorheben
                        highlightSearchTerm(item, searchTerm);
                    } else {
                        // Hervorhebung entfernen
                        resetHighlight(item);
                    }
                });
                
                // Kategorie nur anzeigen, wenn sie sichtbar ist UND mindestens ein Element den Suchbegriff enthält
                category.style.display = (categoryVisible && hasMatchingItem) ? 'block' : 'none';
                
                if (categoryVisible && hasMatchingItem) {
                    hasVisibleCategory = true;
                }
            } else {
                // Wenn keine Suche aktiv ist, alle Elemente zurücksetzen
                items.forEach(item => resetHighlight(item));
                
                // Kategorie nur anzeigen, wenn sie in den ausgewählten Kategorien ist
                category.style.display = categoryVisible ? 'block' : 'none';
                
                if (categoryVisible) {
                    hasVisibleCategory = true;
                }
            }
        });
        
        // Version nur anzeigen, wenn sie dem Versionsfilter entspricht UND mindestens eine sichtbare Kategorie hat
        entry.style.display = (versionMatch && hasVisibleCategory) ? 'block' : 'none';
        
        if (versionMatch && hasVisibleCategory) {
            visibleCount++;
        }
    });
    
    // Wenn keine Ergebnisse gefunden wurden, eine Nachricht anzeigen
    toggleNoResultsMessage(visibleCount === 0);
}

/**
 * Hebt den Suchbegriff in einem Element hervor
 */
function highlightSearchTerm(element, term) {
    const originalText = element.textContent;
    const lowerText = originalText.toLowerCase();
    const termIndex = lowerText.indexOf(term);
    
    if (termIndex >= 0) {
        const before = originalText.substring(0, termIndex);
        const match = originalText.substring(termIndex, termIndex + term.length);
        const after = originalText.substring(termIndex + term.length);
        
        element.innerHTML = before + '<span class="search-highlight">' + match + '</span>' + after;
    }
}

/**
 * Entfernt die Hervorhebung eines Elements
 */
function resetHighlight(element) {
    if (element.querySelector('.search-highlight')) {
        element.innerHTML = element.textContent;
    }
}

/**
 * Zeigt oder versteckt die "Keine Ergebnisse"-Nachricht
 */
function toggleNoResultsMessage(show) {
    let noResultsMessage = document.querySelector('.no-results-message');
    const changelogContent = document.querySelector('.changelog-content');
    
    if (show) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Keine Ergebnisse gefunden</h3>
                <p>Versuche andere Suchbegriffe oder setze die Filter zurück, um mehr Ergebnisse zu sehen.</p>
            `;
            
            if (changelogContent) {
                changelogContent.appendChild(noResultsMessage);
            }
        }
        noResultsMessage.style.display = 'block';
    } else if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }
}

/**
 * Setzt alle Filter zurück
 */
function resetFilters() {
    const versionFilter = document.getElementById('version-filter');
    const categoryFilters = document.querySelectorAll('.changelog-category-filter input');
    const searchInput = document.getElementById('changelog-search');
    
    if (versionFilter) {
        versionFilter.value = 'all';
    }
    
    categoryFilters.forEach(filter => {
        filter.checked = true;
    });
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Filter anwenden
    applyFilters();
    
    // Erstes Element ausklappen
    expandLatestVersion();
}

/**
 * Initialisiert die Toggle-Funktionalität für die Versionsdetails
 */
function initVersionToggles() {
    const versionHeaders = document.querySelectorAll('.version-header');
    
    versionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle-Button und Header-Status umschalten
            const toggleButton = this.querySelector('.version-toggle');
            toggleButton.classList.toggle('active');
            this.classList.toggle('active');
            
            // Content anzeigen oder ausblenden
            const content = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                // Alle anderen schließen, wenn dieser geöffnet wird
                versionHeaders.forEach(otherHeader => {
                    if (otherHeader !== this && otherHeader.classList.contains('active')) {
                        otherHeader.classList.remove('active');
                        otherHeader.querySelector('.version-toggle').classList.remove('active');
                    }
                });
            }
        });
    });
}

/**
 * Klappt die neueste Version automatisch aus
 */
function expandLatestVersion() {
    const firstVersionHeader = document.querySelector('.version-header');
    
    if (firstVersionHeader) {
        // Simuliere einen Klick auf den ersten Header
        firstVersionHeader.classList.add('active');
        const toggleButton = firstVersionHeader.querySelector('.version-toggle');
        if (toggleButton) {
            toggleButton.classList.add('active');
        }
    }
}

/**
 * Verarbeitet URL-Parameter für direkte Links zu bestimmten Versionen
 */
function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get('version');
    
    if (versionParam) {
        // Version im Filter auswählen
        const versionFilter = document.getElementById('version-filter');
        if (versionFilter) {
            // Major.Minor aus dem Parameter extrahieren
            const versionParts = versionParam.split('.');
            const majorMinor = versionParts.slice(0, 2).join('.');
            
            // Überprüfen, ob diese Version im Filter vorhanden ist
            const options = Array.from(versionFilter.options);
            const hasOption = options.some(option => option.value === majorMinor);
            
            if (hasOption) {
                versionFilter.value = majorMinor;
                applyFilters();
            }
        }
        
        // Spezifische Version finden und hervorheben
        const versionElement = document.querySelector(`.changelog-version[data-version="${versionParam}"]`);
        if (versionElement) {
            // Scroll zu dieser Version mit Animation
            setTimeout(() => {
                versionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Element hervorheben
                versionElement.classList.add('highlight-version');
                
                // Hervorhebung nach einiger Zeit entfernen
                setTimeout(() => {
                    versionElement.classList.remove('highlight-version');
                }, 5000);
                
                // Header öffnen
                const header = versionElement.querySelector('.version-header');
                if (header && !header.classList.contains('active')) {
                    header.click();
                }
            }, 500);
        }
    }
}

// Exportiere Funktionen für eventuelle externe Verwendung
window.changelogUtils = {
    applyFilters,
    resetFilters
};