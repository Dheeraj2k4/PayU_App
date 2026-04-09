# 💰 FinanceManager

A modern, feature-rich personal finance management app built with React Native and Expo. Track your expenses, income, and subscriptions with beautiful animations and an intuitive user interface. The app supports both light and dark modes for a personalized experience.

---

## ✨ Features

### Core Functionality
- **Transaction Management** — Add, track, and manage income and expense transactions with custom categories and notes
- **Subscription Tracking** — Monitor recurring payments (weekly, monthly, yearly) with flexible period conversions
- **Smart Analytics** — Visualize spending patterns with interactive donut charts and category breakdowns
- **Search Functionality** — Quickly find transactions by category, note, amount, or date
- **Balance Overview** — View credit score gauge and spending bar charts for financial insights

### User Experience
- **Dark Mode Support** — Full dark and light theme support with smooth transitions
- **Gesture Interactions** — Swipe to delete transactions from recent activity
- **Real-time Search** — Filter transactions dynamically across the entire transaction history
- **Smooth Animations** — Polished transitions and spring animations throughout the app
- **Responsive Design** — Optimized for both phones and tablets

### Authentication & Profile
- **User Authentication** — Sign up and sign in flows with smooth tab switching
- **Profile Management** — Edit user profile, view personal information, and manage preferences
- **Logout** — Securely log out from the app
- **Persistent Storage** — Local storage for user data and transaction history

### Additional Features
- **Notifications** — Get alerts for upcoming or pending transactions
- **Calendar Date Picker** — Intuitive inline calendar for date selection
- **Service Icons** — Dedicated icons for popular services (Spotify, Netflix, YouTube, Google)
- **Currency Formatting** — Automatic currency formatting for all monetary values

---

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** globally installed
- **Android/iOS** development setup (for building APK/IPA)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinanceManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo dependencies**
   ```bash
   npx expo install
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on your device/emulator**
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Scan QR code with Expo Go app on your physical device

### Building for Production

**Android APK**
```bash
eas build --platform android
# or
npm run build:android
```

**iOS IPA**
```bash
eas build --platform ios
# or
npm run build:ios
```

---

## 🏗️ Tech Stack

- **Framework:** React Native with TypeScript
- **State Management:** React Context API
- **Navigation:** React Navigation (Stack & Bottom Tab)
- **Animations:** React Native Reanimated
- **UI Components:** React Native built-ins + custom components
- **Icons:** Expo Vector Icons + Custom SVG
- **Data Persistence:** AsyncStorage
- **Build Tool:** Expo (EAS Build support)

---

## 📱 App Screenshots

### Splash Screen
![Splash Screen](Splash_Screen.jpeg)

*Beautiful animated splash screen with centered app logo on black background*

### Authentication
![Auth Screens](Auth_Screen_SignUp_Light.jpeg) ![Auth](Auth_Screen_SignIn.jpeg) ![Auth](Auth_Screen_SignUp.jpeg) ![Auth](Auth_Screen_SignIn_Light.jpeg)

High-quality authentication flows with smooth tab switching animations and support for both light and dark modes. Transitions seamlessly into the home screen upon successful login.

### Home Screen
![Home Screen](Home_Screen_card.jpeg) ![Home](Home_Screen_light.jpeg) ![Home](Home_Screen_RecentTranscations.jpeg) ![Home](Home_Screen_RecentTranscations_light.jpeg) ![Home](Home_Screen_RecentTranscations_swipeDelete.jpeg) ![Home](Home_Screen_RecentTranscations_swipe_Delete.jpeg)

Display current account balance with recent transactions. Features include:
- Interactive expense/income toggle
- Swipeable transaction cards for easy deletion
- Gradient backgrounds that adapt to light/dark mode
- Quick transaction overview with category icons

### Balance Screen
![Balance Screen](balance_screen_light.jpeg) ![Balance](balance_screen_creditScore.jpeg) ![Balance](balance_screen_barChart.jpeg)

Comprehensive financial overview with:
- Credit score gauge visualization
- Monthly spending bar charts
- Income vs. expense breakdown
- Historical trend analysis

### Profile Screen
![Profile Screen](Profile_Screen_preview.jpeg) ![Profile](Profile_Screen_Edit.jpeg) ![Profile](profile_screen_preview_light.jpeg) ![Profile](Profile_Screen_Edit_light.jpeg)

User profile management interface featuring:
- Profile preview and edit modes
- Dark mode toggle
- Secure logout button
- User information management
- Light and dark theme variants

### Analytics Screen
![Analytics Screen](analytics_screen_transactions.jpeg) ![Analytics](analytics_screen.jpeg) ![Analytics](<analytics screen_light.jpeg>) ![Analytics](analytics_screen_income_b.jpeg) ![Analytics](analytics_screen_income.jpeg) ![Analytics](analytics_screen_transactions_light.jpeg)

Detailed financial analytics with:
- Interactive donut charts with smooth animations
- Category-based expense breakdown
- Month-by-month navigation
- Subscription tracking with period conversion (weekly/monthly/yearly)
- Income vs. expense comparison

### Add Transaction Sheet
![Transaction Sheet](transaction_sheet_subscriptions.jpeg) ![Sheet](transaction_sheet.jpeg) ![Sheet](transaction_sheet_keyboard.jpeg) ![Sheet](transaction_sheet_expense_cal.jpeg) ![Sheet](transaction_sheet_expense.jpeg) ![Sheet](transaction_sheet_income.jpeg)

Flexible transaction entry interface supporting:
- Expense, income, and subscription tracking
- Inline calendar date picker
- Category selection with custom icons
- Custom note field
- Multi-form validation
- Billing cycle selection for subscriptions

### Search Screen
![Search Screen](search_screen.jpeg) ![Search](Search_screen_light.jpeg) ![Search](search_screen_empty.jpeg)

Powerful search functionality allowing users to:
- Search by category, note, amount, or date
- Real-time result filtering
- Empty state with helpful guidance
- Light and dark theme support

### Notifications Screen
![Notifications Screen](Notification_Screen.jpeg)

Keep users informed with upcoming and pending transactions. View:
- Upcoming bills and subscriptions
- Transaction reminders
- Payment due dates
- Recurring payment schedules

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── analytics/       # Analytics-specific components
│   ├── auth/            # Authentication components
│   ├── charts/          # Chart components
│   ├── common/          # Shared components
│   ├── home/            # Home screen components
│   ├── navigation/      # Navigation components
│   ├── profile/         # Profile components
│   └── transactions/    # Transaction components
├── constants/           # App constants & theme
│   ├── categories.ts    # Transaction categories
│   ├── theme.ts         # Color scheme
│   └── typography.ts    # Typography styles
├── hooks/               # Custom React hooks
│   ├── useTheme.ts      # Theme hook
│   └── useTransactions.ts # Transactions hook
├── navigation/          # Navigation configuration
├── screens/             # Screen components
├── store/               # State management (Context)
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

---

## 🚀 Getting Started

Once the app is running:

1. **Sign up** or **sign in** with your credentials
2. **Add transactions** using the FAB button or add menu
3. **View analytics** to understand your spending patterns
4. **Track subscriptions** to monitor recurring payments
5. **Search transactions** to find specific entries
6. **Toggle dark mode** in your profile settings

---

## 📝 Notes

- All transactions are stored locally on your device
- The app supports multiple currencies (US Dollar by default)
- Dark mode automatically adapts to your system preferences
- Transaction data persists across app sessions

---

## 📄 License

This project is available for personal and educational use.

---

## 🙌 Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests to improve the app.

---

PS There were minor bugs, I wanted to fix but due to time constraint I couldn't and also Thank you for this oppurtunity.