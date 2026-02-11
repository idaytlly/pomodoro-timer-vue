# 🍭 Candy Pomodoro Timer

A beautiful, candy-themed Pomodoro timer built with **Vue.js 3**, **Chart.js**, and **IndexedDB**. Features full offline functionality, productivity tracking, and a delightful user interface - perfect for boosting productivity with sweet visuals!

![Candy Pomodoro Banner](https://via.placeholder.com/1200x400/1a1a2e/FF69B4?text=Candy+Pomodoro+Timer+Vue.js+3+Chart.js+IndexedDB)

## ✨ Features

### 🎨 **Beautiful UI**
- Candy-themed color palette (pinks, blues, purples, greens)
- Smooth animations and transitions
- Progress ring visualization
- Responsive design for all devices

### ⏱️ **Complete Pomodoro Timer**
- Focus sessions (25 minutes default)
- Short breaks (5 minutes default)
- Long breaks (15 minutes default)
- Auto-transition between sessions
- Progress tracking with visual feedback
- Keyboard shortcuts support

### 📊 **Productivity Analytics**
- Daily focus time tracking
- Session completion statistics
- Weekly productivity charts (Chart.js)
- Task completion rates
- Lifetime statistics dashboard

### 💾 **Offline-First Architecture**
- Full IndexedDB integration
- Local data persistence
- Works completely offline
- Data export/import functionality
- Service Worker for PWA capabilities

### ✅ **Task Management**
- Add/edit/delete tasks
- Task completion tracking
- Priority marking
- Due date reminders
- Bulk operations

### ⚙️ **Customizable Settings**
- Adjustable timer durations
- Auto-start breaks/pomodoros
- Desktop notifications
- Sound alerts
- Theme preferences
- Data management tools

### 📱 **Progressive Web App**
- Installable on mobile/desktop
- Works offline
- Push notifications
- App-like experience
- Service Worker caching

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Vue.js 3** | Frontend Framework | 3.4.0 |
| **Chart.js** | Data Visualization | 4.4.0 |
| **IndexedDB** | Client-side Database | via idb@8.0.0 |
| **Tailwind CSS** | Styling Framework | 3.3.6 |
| **Vite** | Build Tool & Dev Server | 5.0.0 |
| **Heroicons** | Icon Library | 2.0.18 |
| **Vue Chart.js** | Chart.js Integration | 5.2.0 |

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/idaytlly/pomodoro-timer-vue.git
cd pomodoro-timer-vue
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:3000`

### Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

### Deploy to GitHub Pages

```bash
# One-command deployment
npm run deploy
```

Your app will be live at: `https://[your-username].github.io/pomodoro-timer-vue/`

## 📁 Project Structure

```
pomodoro-timer-vue/
├── public/                    # Static files & PWA assets
│   ├── index.html            # Main HTML file
│   ├── manifest.json         # PWA manifest
│   ├── sw.js                # Service Worker
│   └── vite.svg             # App icon
├── src/                      # Source code
│   ├── assets/              # Images, fonts, etc.
│   ├── components/          # Vue components
│   │   ├── TimerDisplay.vue # Timer with progress ring
│   │   ├── TimerControls.vue# Start/Pause/Reset buttons
│   │   ├── TaskManager.vue  # Task management interface
│   │   ├── StatisticsPanel.vue # Charts & analytics
│   │   └── SettingsPanel.vue # User preferences
│   ├── composables/         # Vue 3 Composition API
│   │   └── useTimer.js      # Timer logic & state
│   ├── utils/               # Utility functions
│   │   ├── db.js           # IndexedDB wrapper (CRUD operations)
│   │   ├── notifications.js # Notification & audio utilities
│   │   └── audio.js        # Sound management
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles
├── .github/workflows/       # GitHub Actions
│   └── deploy.yml          # Auto-deploy to GitHub Pages
├── .vscode/                # VS Code settings
│   ├── settings.json       # Editor configuration
│   └── tailwind.json      # Tailwind CSS IntelliSense
├── tailwind.config.js      # Tailwind configuration
├── vite.config.js          # Vite build configuration
├── package.json           # Dependencies & scripts
└── README.md              # This file
```

## 🎯 How to Use

### 1. **Set Up Your Timer**
- Open Settings (⚙️ button)
- Adjust focus time, short break, and long break durations
- Configure sessions before long break (default: 4)
- Enable/disable auto-start features
- Set notification preferences

### 2. **Manage Tasks**
- Add tasks for your current focus session
- Mark tasks as complete when done
- Delete unnecessary tasks
- Export/import tasks as JSON
- Clear completed tasks in bulk

### 3. **Start Working**
- Click "Start" to begin a focus session
- Work uninterrupted for 25 minutes (or your custom duration)
- Take a 5-minute break when timer ends
- After 4 sessions, enjoy a 15-minute long break
- Repeat for maximum productivity!

### 4. **Track Your Progress**
- View daily statistics in the dashboard
- Check weekly productivity charts
- Monitor task completion rates
- Export your data for backup

### 5. **Work Offline**
- The app works without internet connection
- All data is stored locally in your browser
- Syncs automatically when back online
- Install as PWA for app-like experience

## 🔧 Configuration

### Timer Settings
```javascript
// Default configuration
{
  focusTime: 25,          // Focus session duration (minutes)
  shortBreak: 5,          // Short break duration (minutes)
  longBreak: 15,          // Long break duration (minutes)
  sessionsBeforeLongBreak: 4, // Sessions before long break
  autoStartBreaks: true,  // Auto-start breaks
  autoStartPomodoros: true, // Auto-start next pomodoro
  desktopNotifications: true, // Enable notifications
  soundEnabled: true      // Enable sound alerts
}
```

### Customizing Colors
Edit `tailwind.config.js` to modify the candy theme:
```javascript
colors: {
  candy: {
    pink: '#FF69B4',    // Hot Pink
    blue: '#6EC5E9',    // Sky Blue
    purple: '#B19CD9',  // Light Purple
    green: '#77DD77',   // Light Green
    yellow: '#FFD700',  // Gold
    orange: '#FFA500'   // Orange
  }
}
```

## 📊 API Reference

### IndexedDB Schema

#### Tasks Store
```javascript
{
  id: autoIncrement,
  text: String,          // Task description
  completed: Boolean,    // Completion status
  createdAt: ISOString,  // Creation timestamp
  updatedAt: ISOString,  // Last update timestamp
  date: String          // YYYY-MM-DD format
}
```

#### Sessions Store
```javascript
{
  id: autoIncrement,
  type: String,          // 'focus' | 'shortBreak' | 'longBreak'
  duration: Number,      // Duration in minutes
  completedAt: ISOString,// Completion timestamp
  date: String          // YYYY-MM-DD format
}
```

#### Settings Store
```javascript
{
  key: String,          // 'userSettings' | 'timerState'
  value: Object         // Settings or timer state
}
```

### Utility Functions

#### Database Operations
```javascript
import { db } from './utils/db.js'

// Tasks
await db.getTasks(date)        // Get tasks for specific date
await db.addTask(task)         // Add new task
await db.updateTask(id, data)  // Update task
await db.deleteTask(id)        // Delete task

// Sessions
await db.addSession(session)   // Log completed session
await db.getSessions(date)     // Get sessions for date

// Statistics
await db.getTodayStats()       // Get today's statistics
await db.getWeeklyStats()      // Get weekly data for charts

// Settings
await db.saveSettings(settings) // Save user preferences
await db.getSettings()         // Load settings
```

#### Notifications
```javascript
import { notify, playSound, vibrate } from './utils/notifications.js'

// Show desktop notification
notify('Title', 'Message body')

// Play sound alert
playSound('complete') // 'start' | 'complete' | 'alert' | 'pause'

// Vibrate (mobile devices)
vibrate([200, 100, 200])
```

## 🔍 Development

### Available Scripts
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint and fix files
npm run lint

# Deploy to GitHub Pages
npm run deploy
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_NAME="Candy Pomodoro Timer"
VITE_APP_VERSION="1.0.0"
VITE_API_BASE_URL="https://api.example.com" # For future API integration
```

### Adding New Features

1. **Create a new component:**
```bash
touch src/components/NewFeature.vue
```

2. **Update App.vue to include it:**
```vue
<template>
  <NewFeature />
</template>

<script setup>
import NewFeature from './components/NewFeature.vue'
</script>
```

3. **Add to IndexedDB if needed:**
Update `src/utils/db.js` with new store and methods.

## 📱 Progressive Web App Features

### Installation
1. Visit the app in Chrome/Edge
2. Click the install button in the address bar
3. Or use "Add to Home Screen" on mobile

### Offline Functionality
- Service Worker caches essential files
- IndexedDB stores all user data locally
- Works without internet connection
- Syncs data when connection restored

### App Manifest
The `public/manifest.json` file provides:
- App name and description
- Icons for different screen sizes
- Theme colors
- Display modes
- Shortcuts for quick actions

## 🧪 Testing

### Manual Testing Checklist
- [ ] Timer starts, pauses, resets correctly
- [ ] Auto-transition between sessions works
- [ ] Notifications appear when enabled
- [ ] Sounds play when enabled
- [ ] Tasks can be added, completed, deleted
- [ ] Statistics update in real-time
- [ ] Charts render correctly
- [ ] Settings are saved and loaded
- [ ] App works offline
- [ ] Data exports and imports correctly
- [ ] Responsive design on mobile/tablet/desktop

### Browser Support
- ✅ Chrome 88+
- ✅ Firefox 84+
- ✅ Safari 14+
- ✅ Edge 88+
- ✅ Opera 74+

## 🚀 Deployment

### GitHub Pages (Recommended)
1. Fork this repository
2. Update `vite.config.js` base path:
```javascript
base: '/pomodoro-timer-vue/' // Change to your repo name
```
3. Run `npm run deploy`
4. Enable GitHub Pages in repository settings

### Netlify
1. Push to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Vercel
1. Import Git repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```
3. **Make your changes**
4. **Commit with descriptive messages**
```bash
git commit -m 'Add amazing feature'
```
5. **Push to your branch**
```bash
git push origin feature/amazing-feature
```
6. **Open a Pull Request**

### Development Guidelines
- Follow Vue.js 3 Composition API patterns
- Use TypeScript-like interfaces for props/emits
- Write descriptive comments
- Update documentation when adding features
- Test changes thoroughly

### Code Style
```javascript
// Use Vue 3 <script setup> syntax
<script setup>
import { ref, computed } from 'vue'

// Use descriptive variable names
const timerIsRunning = ref(false)
const currentSessionCount = ref(1)

// Use computed properties for derived state
const displayTime = computed(() => {
  // Format time logic
})
</script>
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing Progressive JavaScript Framework
- **Chart.js Contributors** - For powerful yet simple charting library
- **Tailwind CSS** - For the utility-first CSS framework
- **Heroicons** - For beautiful hand-crafted SVG icons
- **IDB Library** - For the excellent IndexedDB wrapper
- **Vite Team** - For the next-generation frontend tooling

## 📞 Contact & Support

**Ida Yatullailliyeh**  
- Email: [idayatullailliyeh@gmail.com](mailto:idayatullailliyeh@gmail.com)
- GitHub: [@idayatullailliyeh](https://github.com/idayatullailliyeh)
- LinkedIn: [Ida Yatullailliyeh](https://linkedin.com/in/idayatullailliyeh)

**Project Links**  
- Repository: [https://github.com/idayatullailliyeh/pomodoro-timer-vue](https://github.com/idayatullailliyeh/pomodoro-timer-vue)
- Issues: [https://github.com/idayatullailliyeh/pomodoro-timer-vue/issues](https://github.com/idayatullailliyeh/pomodoro-timer-vue/issues)
- Live Demo: [https://idayatullailliyeh.github.io/pomodoro-timer-vue](https://idayatullailliyeh.github.io/pomodoro-timer-vue)

## 🌟 Show Your Support

If you find this project helpful, please give it a star! ⭐

## 📈 Project Status

**Current Version:** 1.0.0  
**Last Updated:** February 2024  
**Maintenance:** Actively maintained  
**Roadmap:** See [Projects tab](https://github.com/idayatullailliyeh/pomodoro-timer-vue/projects) for upcoming features

---

**Built with ❤️ using Vue.js 3, Chart.js, and IndexedDB**  
*Sweet productivity, one timer at a time!* 🍭

---

<div align="center">
  
### ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=idayatullailliyeh/pomodoro-timer-vue&type=Date)](https://star-history.com/#idayatullailliyeh/pomodoro-timer-vue&Date)

### 📊 Tech Stack Badges

![Vue.js](https://img.shields.io/badge/Vue.js-3.4-4FC08D?logo=vuedotjs&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?logo=chartdotjs&logoColor=white)
![IndexedDB](https://img.shields.io/badge/IndexedDB-✅-007ACC?logo=indexeddb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-✅-5A0FC8?logo=pwa&logoColor=white)

</div>
