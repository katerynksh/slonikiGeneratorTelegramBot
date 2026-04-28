# Sloniki Generator Telegram Bot

A Telegram bot built with **Node.js** and **Artificial Intelligence** that automatically adds elephants to your photos. This project demonstrates the integration of computer vision (Pose Estimation) with a real-time messaging interface.

## How it works
- **AI Human Detection**: The bot uses the **PoseNet (TensorFlow.js)** model to analyze the provided image.
- **Smart Placement**: If a person is detected, the bot identifies key body parts (head, shoulders, or wrists) and "places" an elephant there.
- **Random Mode**: If no people are found in the image, an elephant is added to a random location.
- **Canvas Rendering**: Image processing is handled on-the-fly using the `node-canvas` library.

## Technology Stack
- **Runtime**: Node.js
- **Bot API**: [Telegraf](https://telegraf.js.org/)
- **AI/ML**: [TensorFlow.js](https://www.tensorflow.org/js) & [PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet)
- **Graphics**: [node-canvas](https://github.com/Automattic/node-canvas)

## Getting Started

### 1. Prerequisites
Ensure you have **Node.js v20+** installed. Due to dependency versioning in AI models, create an `.npmrc` file in your root directory with the following line:
```text
legacy-peer-deps=true
```
### 2. Installation 
1. Clone the repository:
   ```bash
   git clone [https://github.com/katerynksh/slonikiGeneratorTelegramBot.git](https://github.com/katerynksh/slonikiGeneratorTelegramBot.git)
    cd slonikiGeneratorTelegramBot
    ```
2. Install dependencies:
   ```bash
    npm install
    ```
### 3. Configuration
1. Create a `.env` file in the root directory and add your Telegram bot token:
```text
TOKEN=your_telegram_bot_token_here
```
### 4. Run the Bot
Start the bot with:
```bash
npm start
```
## Usage
- Open Telegram and search for your bot.
- Send any photo to the bot, and it will reply with the same photo but with an elephant added to it!
