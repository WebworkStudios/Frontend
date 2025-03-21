# Kickerscup - Online Football Manager Game

![Kickerscup Logo](img/player.png)

## 🎮 Project Overview

Kickerscup is a browser-based online football manager game that allows players to create and manage their own virtual football clubs. Take control of your team, develop tactics, compete in leagues and tournaments, and lead your club to glory.

## 🖥️ Tech Stack

- HTML5
- CSS3 (with custom properties and modular organization)
- Vanilla JavaScript
- Font Awesome for icons
- Google Fonts (Montserrat, Playfair Display)
- CDN-based flag images

## 📁 Project Structure

```
kickerscup/
├── css/
│   ├── base.css            # Base styles and variables
│   ├── layout.css          # Layout components styling
│   ├── components.css      # UI component styling
│   ├── utilities.css       # Utility classes
│   ├── legal.css           # Legal pages common styling
│   ├── agb.css             # Terms and conditions styling
│   ├── datenschutz.css     # Privacy policy styling
│   └── changelog.css       # Changelog page styling
├── js/
│   ├── main.js             # Main JavaScript functionality
│   ├── legal-utils.js      # Shared utilities for legal pages
│   ├── agb.js              # Terms page specific JavaScript
│   ├── datenschutz.js      # Privacy page specific JavaScript
│   └── changelog.js        # Changelog functionality
├── img/
│   ├── player.png          # Player icon
│   ├── background-header.jpg # Background image
│   └── ...
├── index.html              # Main landing page
├── agb.html                # Terms and conditions
├── datenschutz.html        # Privacy policy
├── impressum.html          # Imprint/Legal notice
└── changelog.html          # Version history
```

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional for development)


## 💡 Development

### CSS Architecture

The CSS is organized in a modular structure:

- **base.css**: Contains CSS variables, basic resets, and foundational styles
- **layout.css**: Page layout, header, footer, and structural components
- **components.css**: UI components like buttons, cards, modals
- **utilities.css**: Helper classes (spacing, typography, flex utilities)
- **Feature-specific CSS**: Separate files for specific features (changelog, legal pages)

### JavaScript Organization

JavaScript is organized by feature:

- **main.js**: Core functionality shared across the application
- **Feature-specific JS**: Separate files for specific pages/features

## 🌐 Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📄 Legal

- [Terms and Conditions](agb.html)
- [Privacy Policy](datenschutz.html)
- [Imprint](impressum.html)

## 👥 Contributors

- Kickerscup
- Jan Steiger (Project Lead)

## 📞 Contact

For questions or support, please contact:
- Email: info@kickerscup.de
- Website: www.kickerscup.de

## 📝 License

© 2025 Kickerscup. All rights reserved.

---

Made with ❤️ in Germany
