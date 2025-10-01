# AEM Helper Extension

A Chrome extension designed to enhance the Adobe Experience Manager (AEM) development workflow. This extension provides quick access to commonly used AEM tools, debug modes, and navigation shortcuts directly from your browser.

## 🌟 Features

### Quick Actions
- **Disabled Mode**: View pages in disabled WCM mode (without authoring UI)
- **Edit Mode**: Switch to page editor mode instantly
- **Page Properties**: Access page properties dialog quickly

### Debug Tools
- **CRXDE**: Open current page in CRXDE Lite for content exploration
- **Client Libraries**: Enable client library debugging mode
- **Layout Debug**: Activate layout debugging for component troubleshooting

### Navigation
Quick access to essential AEM interfaces organized by category:

#### Core
- **Welcome**: AEM start page
- **CRXDE**: Content Repository Extreme Development Environment
- **Packages**: Package Manager for content packages

#### Content
- **Assets**: Digital Asset Manager
- **Sites**: Sites administration console
- **Templates**: Template editor and management

#### System
- **Bundles**: OSGi bundle console
- **Config**: Configuration Manager (OSGi configurations)
- **Logs**: Sling Log Support for viewing and managing logs

### Tools
Additional development and administration tools:
- **Groovy Console**: Execute Groovy scripts
- **i18n**: Internationalization translator
- **Query Builder**: Query debugger for JCR queries
- **Users**: User administration
- **Misc Admin**: Miscellaneous administration tools
- **JMX**: Java Management Extensions console

### Settings
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- **New Tab**: Choose whether to open links in a new tab or current tab

## 📦 Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](#) (link to be added when published)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Clone this repository:
   ```bash
   git clone https://github.com/charlie-yc-tsai/aem-helper-extension.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right corner)

4. Click "Load unpacked"

5. Select the extension directory

6. The AEM Helper extension icon should appear in your browser toolbar

## 🚀 Usage

1. Navigate to any AEM page in your browser
2. Click the AEM Helper extension icon in the toolbar
3. Use the popup interface to:
   - Switch between different modes (Disabled, Edit)
   - Enable debug tools
   - Navigate to AEM administration interfaces
   - Access development tools

### Configuration

#### Dark Mode
Toggle the "Dark Mode" switch in the header to change the theme. Your preference is saved automatically.

#### New Tab Behavior
Toggle the "New Tab" switch to control whether links open in:
- **Off**: Current tab (replaces current page)
- **On**: New tab (opens alongside current tab)

## 🛠️ Technical Details

### Permissions
The extension requires the following permissions:
- `activeTab`: To access the current tab's URL for context-aware navigation
- `storage`: To save user preferences (theme, tab behavior)
- `host_permissions`: To allow navigation to AEM URLs

### File Structure
```
aem-helper-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Extension logic and event handlers
├── popup.css             # Styling for the popup
├── css/                  # Font Awesome CSS files
├── webfonts/             # Font Awesome web fonts
└── images/               # Extension icons
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## 🎨 Theme Support

The extension includes a built-in dark mode with carefully designed color schemes:
- **Light Theme**: Clean and bright interface with blue accents
- **Dark Theme**: Easy on the eyes with reduced blue light

## 🔒 Privacy

This extension respects your privacy:
- No data collection or tracking
- No external API calls
- Settings stored locally using Chrome's storage API
- No personal information is accessed or transmitted

For detailed privacy information, see the [Privacy Policy](chrome-extension-privacy.md).

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
1. Clone the repository
2. Make your changes
3. Test by loading the extension in Chrome (Developer mode)
4. Ensure all features work as expected

## 📝 Version History

### 0.1.0 (Current)
- Initial release
- Quick Actions for mode switching
- Debug tools integration
- Navigation shortcuts
- Theme support (Light/Dark mode)
- Configurable tab behavior

## 📧 Contact

For questions, suggestions, or issues:
- Email: charlie830808@gmail.com
- GitHub: [Open an issue](https://github.com/charlie-yc-tsai/aem-helper-extension/issues)

## 📄 License

This project is available for use under standard open-source practices. Please ensure compliance with Adobe's terms of service when using this extension with AEM.

## 🙏 Acknowledgments

- Built for the AEM developer community
- Uses Font Awesome for icons
- Designed with modern web standards

---

**Note**: This is an unofficial tool and is not affiliated with or endorsed by Adobe Systems Incorporated.