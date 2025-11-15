# Conversational Budget Manager - Setup Guide

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

### 1. Node.js and npm
- **Download**: Visit [https://nodejs.org/](https://nodejs.org/)
- **Install**: Download the LTS (Long Term Support) version for your operating system
- **Verify Installation**: Open your terminal and run:
  ```bash
  node -v
  npm -v
  ```
  You should see version numbers (e.g., v20.x.x for Node.js and 10.x.x for npm)

### 2. Visual Studio Code (VS Code)
- **Download**: Visit [https://code.visualstudio.com/](https://code.visualstudio.com/)
- **Install**: Follow the installation wizard for your operating system

### 3. VS Code Extensions (Recommended)
Open VS Code and install these extensions:
- **ESLint** (by Microsoft) - For code linting
- **Prettier** (by Prettier) - For code formatting
- **Tailwind CSS IntelliSense** (by Tailwind Labs) - For Tailwind CSS autocomplete
- **ES7+ React/Redux/React-Native snippets** - For React code snippets

## 🚀 Installation Steps

### Step 1: Open Project in VS Code
1. Open VS Code
2. Click `File` → `Open Folder`
3. Navigate to your project folder: `Conversational-Budget-Manager-main`
4. Click `Select Folder`

### Step 2: Install Dependencies
1. Open the integrated terminal in VS Code:
   - Press `` Ctrl + ` `` (backtick) or
   - Go to `Terminal` → `New Terminal`
2. Run the following command:
   ```bash
   npm install
   ```
   This will install all required packages including:
   - React and React DOM
   - Vite (build tool)
   - Tailwind CSS
   - Lucide React (icons)
   - Agora RTC SDK

### Step 3: Set Up Agora AI Credentials
1. Create an account at [Agora Console](https://console.agora.io/)
2. Create a new project in the Agora Console
3. Get your **App ID** and **App Certificate** from the project settings
4. Create a `.env` file in the root directory (see Step 4)

### Step 4: Configure Environment Variables
Create a `.env` file in the root directory with your Agora credentials:

```env
VITE_AGORA_APP_ID=your_app_id_here
VITE_AGORA_APP_CERTIFICATE=your_app_certificate_here
```

**Important**: Replace `your_app_id_here` and `your_app_certificate_here` with your actual Agora credentials.

### Step 5: Run the Development Server
In the terminal, run:
```bash
npm run dev
```

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 6: Open in Browser
1. Open your web browser
2. Navigate to `http://localhost:5173/`
3. You should see the BudgetAI application!

## 🎤 Voice Integration Setup

The application now includes real voice recognition using:
- **Agora RTC SDK** for audio streaming
- **Web Speech API** for speech-to-text conversion (browser-native, no additional setup needed)

### How Voice Works:
1. Click the microphone button in the chat interface
2. Grant microphone permissions when prompted by your browser
3. Speak naturally about your expenses (e.g., "Spent 250 on lunch")
4. The app will convert your speech to text and process it automatically

### Browser Compatibility:
- ✅ Chrome/Edge (Best support)
- ✅ Safari (Good support)
- ✅ Firefox (Good support)
- ⚠️ Mobile browsers may have limited support

## 📁 Project Structure

```
Conversational-Budget-Manager-main/
├── public/
│   └── budget.svg          # App icon
├── src/
│   ├── App.jsx             # Main application component
│   ├── App.css             # Tailwind CSS styles
│   ├── main.jsx            # Application entry point
│   ├── index.css           # Global styles
│   └── services/
│       └── voiceService.js # Agora voice integration service
├── .env                    # Environment variables (create this)
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies
├── vite.config.js         # Vite configuration
└── tailwind.config.cjs    # Tailwind CSS configuration
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## 🐛 Troubleshooting

### Issue: `npm install` fails
**Solution**: 
- Make sure Node.js is installed correctly
- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again
- Check your internet connection

### Issue: Port 5173 is already in use
**Solution**: 
- Close other applications using that port
- Or modify `vite.config.js` to use a different port

### Issue: Microphone not working
**Solution**:
- Check browser permissions (Settings → Privacy → Microphone)
- Make sure you're using HTTPS or localhost (required for microphone access)
- Try a different browser

### Issue: Agora connection fails
**Solution**:
- Verify your App ID and Certificate in `.env` file
- Check your internet connection
- Ensure your Agora project is active in the console

## 📚 Additional Resources

- [Agora Documentation](https://docs.agora.io/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🎯 Next Steps

1. ✅ Complete the setup above
2. ✅ Test the voice functionality
3. 🔄 Customize budget categories and limits
4. 🔄 Add backend API integration (if needed)
5. 🔄 Deploy to production

---

**Need Help?** Check the troubleshooting section or refer to the documentation links above.

