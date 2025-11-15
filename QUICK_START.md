# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Navigate to `http://localhost:5173/`

## 🎤 Using Voice Features

1. **Click the microphone button** in the chat interface
2. **Allow microphone access** when your browser prompts you
3. **Speak naturally** about your expenses:
   - "Spent 250 on lunch"
   - "Invested 1000 in stocks"
   - "Paid 500 for groceries"
4. The app will **automatically process** your voice input

## 📝 Example Voice Commands

- "Spent 300 on dinner"
- "Invested 2000 in mutual fund"
- "Paid 150 for Uber"
- "Spent 50 on coffee"
- "Bought groceries for 800"

## ⚠️ Important Notes

- **Browser Support**: Voice recognition works best in Chrome, Edge, or Safari
- **HTTPS Required**: For production, you need HTTPS for microphone access
- **Microphone Permission**: Make sure to allow microphone access when prompted

## 🔧 Troubleshooting

**Voice not working?**
- Check browser permissions (Settings → Privacy → Microphone)
- Try a different browser (Chrome recommended)
- Make sure you're on localhost or HTTPS

**App won't start?**
- Make sure Node.js is installed: `node -v`
- Delete `node_modules` and run `npm install` again
- Check the terminal for error messages

---

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

