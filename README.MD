# 🍭 Candy Pomodoro Timer

A beautiful, candy-themed Pomodoro timer built with **Vue.js 3**, **Chart.js**, and **IndexedDB**. Features full offline functionality, productivity tracking, and a delightful user interface.

## ✨ Features

- 🎨 **Candy-themed UI** with gradient colors and smooth animations
- ⏱️ **Complete Pomodoro Implementation** (Focus/Short Break/Long Break)
- 📊 **Productivity Analytics** with Chart.js visualizations
- 💾 **Offline-First Architecture** using IndexedDB
- 📱 **Progressive Web App** (PWA) - Installable on mobile/desktop
- 🔔 **Desktop Notifications** & sound alerts
- ✅ **Task Management** with persistent storage
- 📈 **Statistics Dashboard** with weekly charts
- ⚙️ **Customizable Settings** with auto-save
- 🌐 **GitHub Pages Deployment** ready

## 🛠️ Tech Stack

- **Vue.js 3** - Composition API, reactive state management
- **Chart.js v4.4.0** - Data visualization
- **IndexedDB** (via idb library) - Client-side database
- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Icon library
- **Vite** - Build tool & dev server
- **Service Worker** - Offline support & PWA

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/idayatullailliyeh/pomodoro-timer-vue.git

# Navigate to project
cd pomodoro-timer-vue

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## 📁 Project Structure

```
pomodoro-timer-vue/
├── public/              # Static assets & PWA files
│   ├── index.html
│   ├── manifest.json
│   └── sw.js           # Service Worker
├── src/
│   ├── assets/         # Images, fonts
│   ├── components/     # Vue components
│   │   ├── TimerDisplay.vue
│   │   ├── TimerControls.vue
│   │   ├── TaskManager.vue
│   │   ├── StatisticsPanel.vue
│   │   └── SettingsPanel.vue
│   ├── composables/    # Vue 3 composables
│   │   └── useTimer.js
│   ├── utils/          # Utility functions
│   │   ├── db.js       # IndexedDB wrapper
│   │   ├── notifications.js
│   │   └── audio.js
│   ├── App.vue         # Root component
│   ├── main.js         # Application entry
│   └── style.css       # Global styles
├── .github/workflows/  # GitHub Actions
│   └── deploy.yml
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS config
├── package.json
└── README.md
```

## 🎯 How to Use

1. **Set Your Preferences**: Configure timer durations in Settings
2. **Add Tasks**: Create tasks for your focus session
3. **Start Timer**: Begin your 25-minute focus session
4. **Take Breaks**: Timer automatically switches to break periods
5. **Track Progress**: View statistics and productivity charts
6. **Work Offline**: All data is stored locally - no internet required

## 🔧 Configuration

Default timer settings can be modified in the Settings panel:
- Focus Time: 25 minutes
- Short Break: 5 minutes  
- Long Break: 15 minutes
- Sessions before long break: 4

## 📊 Advanced Features

### Offline Data Persistence
- Tasks, sessions, and settings stored in IndexedDB
- Works completely offline
- Data synchronized when back online

### Statistics & Analytics
- Daily focus time tracking
- Session completion rates
- Task completion statistics
- Weekly productivity charts
- Lifetime statistics

### Progressive Web App
- Installable on mobile/desktop
- Works offline
- Push notifications
- Background sync

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The Progressive JavaScript Framework
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible JavaScript charting
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Heroicons](https://heroicons.com/) - Beautiful hand-crafted SVG icons
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Client-side storage

## 📞 Contact

Ida Yatullailliyeh - [idayatullailliyeh@gmail.com](mailto:idayatullailliyeh@gmail.com)

Project Link: [https://github.com/idayatullailliyeh/pomodoro-timer-vue](https://github.com/idayatullailliyeh/pomodoro-timer-vue)

---

**Built with ❤️ using Vue.js 3, Chart.js, and IndexedDB**
