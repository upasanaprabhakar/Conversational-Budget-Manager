# BudgetAI: Conversational Budget Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)](https://github.com/upasanaprabhakar/Conversational-Buget-Manager)
[![React Version](https://img.shields.io/badge/react-18.2.0-61DAFB.svg?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4.1-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)

A modern, conversational budget tracking application **powered by the Agora AI SDK**. Built with React, Tailwind CSS, and Lucide Icons, it allows you to track expenses, get smart insights, and manage your budget all in one clean interface.


## ✨ Core Features

* **Conversational Expense Logging:** Log transactions naturally using the chat interface (e.g., "Spent 500 on groceries" or "150 for cofe").
* **Real-time Voice Transcription:** Powered by the **Agora AI SDK**, log expenses hands-free by simply speaking.
* **Intelligent Text & Voice Parsing:** Automatically categorizes transcribed text and manual input into the correct spending category (Food, Transport, etc.).
* **Smart Financial Insights:** Receive smart, actionable recommendations—like investment opportunities or savings tips—based on your spending habits.
* **Actionable AI Cards:** Act on suggestions (like "Invest Now" or "Save Now") or dismiss them directly from the chat UI.
* **All-in-One Dashboard:** Get a complete financial overview with total budget, amount spent, remaining balance, and visual progress bars.
* **Granular Category Management:** Monitor spending across all categories, each with its own customizable budget limit.
* **Full Transaction History:** View all expenses in a sortable and filterable table on the "All Expenses" page.
* **Dynamic Budget & Goal Setting:** Easily edit category spending limits and set your monthly savings goals in the "Budget Settings."
* **Multi-Currency Support:** Instantly switch between INR (₹) and USD ($) to view all financials in your preferred currency.
* **Modern, Responsive UI:** Built with Tailwind CSS for a clean, intuitive experience on all devices.

## 🚀 Tech Stack

* **Frontend:** React.js
* **Voice & AI:** Agora AI SDK (for real-time voice-to-text)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **State Management:** React Hooks (`useState`, `useEffect`)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm (or yarn) installed on your machine.
* Node.js (v18 or later recommended)
* npm or yarn

### Installation & Setup

1.  Clone the repository to your local machine:
    ```bash
    git clone [https://github.com/upasanaprabhakar/Conversational-Buget-Manager.git](https://github.com/upasanaprabhakar/Conversational-Buget-Manager.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd Conversational-Buget-Manager
    ```
3.  Install the necessary dependencies:
    ```bash
    npm install
    ```
4.  (Optional) If you are using the Agora AI SDK, create a `.env` file in the root and add your Agora App ID and other credentials:
    ```
    REACT_APP_AGORA_APP_ID="YOUR_APP_ID"
    ```
5.  Start the development server:
    ```bash
    npm start
    ```
6.  Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## 📂 Project Structure

The entire application is encapsulated within the `src/components/BudgetManager.js` component.

* **State Management:** All application state (expenses, budget, UI screen) is managed locally within the component using React Hooks.
* **Agora AI SDK Integration:** The `handleVoiceClick` function is the entry point for connecting to the Agora SDK, capturing audio, and receiving transcribed text.
* **`parseExpenseFromText`:** A utility function that uses regex and keyword matching to parse both typed and transcribed text into a structured expense object (`{ amount: 100, category: 'Food' }`).
* **`generateAISuggestions`:** A logic function that creates contextual suggestions (e.g., "Smart Investment Opportunity") based on the user's current budget and spending habits.
* **`handleSuggestionAction`:** A function that makes the AI suggestion cards actionable, allowing users to log investments or savings with a single click.
* **UI Rendering:** The component conditionally renders one of four "screens" (`chat`, `dashboard`, `expenses`, `settings`) based on the `currentScreen` state.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
