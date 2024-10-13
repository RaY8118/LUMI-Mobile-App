# 🌟 LUMI - Alzheimer's and Elderly Care App - Frontend (React Native)

This repository contains the **frontend code** for an application designed to assist Alzheimer's and elderly patients 🧓👵. Built using **Expo** and **React Native**, the app helps users manage tasks, recognize faces and objects, and track their location, providing essential support for individuals who may have memory challenges 🧠.

## ✨ Features

### 1. 📝 **Reminders**
   - 🛎️ Allows users to create, edit, and delete reminders for important tasks.
   - 📌 Supports both urgent and important tags for categorizing reminders.

### 2. 👤 **Face Recognition**
   - 📷 Utilizes facial recognition to help users identify familiar people.
   - 🚫 Runs independently for all users, without communication with the database.

### 3. 🧳 **Object Recognition**
   - 🛠️ Assists users in recognizing everyday objects through the camera.
   - 🚫 Like face recognition, it functions independently from the database.

### 4. 🌍 **Location Tracking**
   - 📍 Tracks the user’s current location to provide caregivers with updates.
   - 🚨 Can alert caregivers if the patient is out of the safe zone.

## ⚙️ Technology Stack

- 💻 **React Native (Expo)**: The foundation for building the cross-platform mobile app.
- 🎨 **NativeWindCSS**: Used for styling the app's components with Tailwind-like syntax.
- 🗄️ **MongoDB**: Integrated to handle user authentication and data storage.

## 🚀 Getting Started

### 📋 Prerequisites
- 🐍 [Node.js](https://nodejs.org/)
- 📱 [Expo CLI](https://docs.expo.dev/get-started/create-a-project/)
- 🛠️ [npm](https://docs.npmjs.com/cli/v10/commands/npm-install)

### 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RaY8118/LUMI-Mobile-App.git
   cd LUMI-Mobile-App
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo
   ```

4. **Use the Expo Go app** on your mobile device to scan the QR code or run the project on an emulator.

## 🗂️ Folder Structure

- **/components**: Contains reusable UI components used across the app.
- **/tabs**: Contains all the screens like `ReminderScreen`, `LocationTrackingScreen`, etc.
- **/assets**: Holds static assets such as images or icons.

## 🤝 Contributing

1. **Fork the project**
2. **Create your feature branch** (`git checkout -b feature/YourFeature`)
3. **Commit your changes** (`git commit -m 'Add some YourFeature'`)
4. **Push to the branch** (`git push origin feature/YourFeature`)
5. **Open a pull request**

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

