# 🍭🍦 Sweet Tracker Self-Installer

An automated installer that sets up the complete Sweet Tracker application - a mobile-first web app for tracking candy stores and ice cream shops!

## Quick Start

### Option 1: Direct Installation
```bash
npx sweet-tracker-installer
```

### Option 2: Clone and Run
```bash
git clone <this-repository>
cd sweet-tracker-installer
node install.js
```

### Option 3: Download and Run
```bash
curl -O https://raw.githubusercontent.com/your-repo/sweet-tracker-installer/main/install.js
node install.js
```

## What Gets Installed

The installer automatically sets up:

- ✅ **Complete React + TypeScript + Vite project**
- ✅ **Mobile-first responsive design**
- ✅ **Tailwind CSS with custom configuration**
- ✅ **Lucide React icons**
- ✅ **All project files and components**
- ✅ **Development dependencies**
- ✅ **Build configuration**

## Installation Process

The installer will:

1. **Check Prerequisites** - Verify Node.js and npm are installed
2. **Project Configuration** - Ask for project name and location
3. **Create Project Structure** - Initialize Vite React TypeScript template
4. **Install Dependencies** - Add all required packages
5. **Setup Tailwind CSS** - Configure styling framework
6. **Create Application Files** - Generate all React components and styles
7. **Build Verification** - Test that everything works correctly

## Features of the Installed App

### 📱 Mobile-First Design
- Touch-optimized interface
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Mobile-friendly navigation

### 🗺️ Interactive Interface
- Visual map representation
- Location markers and details
- Real-time filtering and search
- Community-driven content

### 🍭 Sweet Spot Tracking
- **Candy Stores** - Track your favorite candy shops
- **Ice Cream Shops** - Find the best frozen treats
- **Ratings & Reviews** - Community-powered ratings
- **Price Ranges** - Budget-friendly to premium options
- **Hours & Status** - Real-time open/closed information

### ➕ Community Features
- Add new locations
- Rate and review spots
- Share descriptions and tips
- User attribution system

## System Requirements

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Operating System**: Windows, macOS, or Linux
- **Browser**: Modern browser with ES6+ support

## After Installation

Once installed, navigate to your project directory and start developing:

```bash
cd your-project-name
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## Customization

The installed app is fully customizable:

### 🎨 Styling
- Modify `tailwind.config.js` for custom colors and themes
- Edit `src/index.css` for global styles
- Component-level styling in individual files

### 🔧 Configuration
- Update `vite.config.ts` for build settings
- Modify `tsconfig.json` for TypeScript options
- Customize `package.json` scripts

### 📱 Features
- Add real map integration (Google Maps, Mapbox)
- Implement user authentication
- Add photo upload capabilities
- Integrate with backend APIs

## Troubleshooting

### Common Issues

**Node.js not found:**
```bash
# Install Node.js from https://nodejs.org/
# Or use a version manager like nvm
nvm install node
```

**Permission errors:**
```bash
# On macOS/Linux, you might need sudo
sudo npm install -g sweet-tracker-installer
```

**Port already in use:**
```bash
# The dev server will automatically find an available port
# Or specify a custom port
npm run dev -- --port 3000
```

### Getting Help

- Check the generated `README.md` in your project
- Review the console output during installation
- Ensure all prerequisites are met
- Try running the installer in a clean directory

## Development

To modify the installer itself:

```bash
git clone <installer-repository>
cd sweet-tracker-installer
# Edit install.js
node install.js  # Test your changes
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the installer thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Suggest improvements
- 📖 **Documentation**: Help improve the docs
- 🤝 **Community**: Join our discussions

---

**Ready to track some sweet spots?** 🍭🍦

Run the installer and start building your sweet treats community app today!