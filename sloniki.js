// const { Telegraf } = require('telegraf');
// const tf = require('@tensorflow/tfjs');
// const posenet = require('@tensorflow-models/posenet');
// const { createCanvas, loadImage } = require('canvas');
// const axios = require('axios');
// const fs = require('fs');
import 'dotenv/config';
import path from 'path';
import { Telegraf } from 'telegraf';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { createCanvas, loadImage } from 'canvas';
import axios from 'axios';
import fs from 'fs';

const bot = new Telegraf(process.env.TOKEN);

let net;

// Завантажуємо модель ШІ при запуску
async function loadModel() {
    net = await posenet.load();
    console.log("ШІ модель завантажена!");
}

loadModel();

bot.start((ctx) => ctx.reply('Привіт! Надішли мені фото, і я додам слоника! 🐘'));
bot.help((ctx) => ctx.reply('Просто надішли мені будь-яке фото, і я додам слоника в нього! 🐘'));
bot.on('text', (ctx) => ctx.reply('Будь ласка, надішліть фото, щоб я міг додати слоника! 🐘'));
bot.on('sticker', (ctx) => ctx.reply('Стікери не підтримуються, але надішліть фото! 🐘'));
bot.on('document', (ctx) => ctx.reply('Документи не підтримуються, але надішліть фото! 🐘'));
bot.on('video', (ctx) => ctx.reply('Відео не підтримуються, але надішліть фото! 🐘'));
bot.on('audio', (ctx) => ctx.reply('Аудіо не підтримуються, але надішліть фото! 🐘'));
bot.on('voice', (ctx) => ctx.reply('Голосові повідомлення не підтримуються, але надішліть фото! 🐘'));
bot.on('animation', (ctx) => ctx.reply('Анімації не підтримуються, але надішліть фото! 🐘'));
bot.on('poll', (ctx) => ctx.reply('Опитування не підтримуються, але надішліть фото! 🐘'));
bot.on('venue', (ctx) => ctx.reply('Місця не підтримуються, але надішліть фото! 🐘'));
bot.on('contact', (ctx) => ctx.reply('Контакти не підтримуються, але надішліть фото! 🐘'));
bot.on('location', (ctx) => ctx.reply('Локації не підтримуються, але надішліть фото! 🐘'));
bot.on('new_chat_members', (ctx) => ctx.reply('Привіт новим учасникам! Надішліть фото, щоб я міг додати слоника! 🐘'));
bot.on('photo', async (ctx) => {
    try {
        await ctx.reply('Обробляю фото... 🐘');

        // 1. Отримуємо пряме посилання на фото
        const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const link = await ctx.telegram.getFileLink(fileId);
        
        // 2. Завантажуємо фото та слоника
        const userImg = await loadImage(link.href);
        const elephantImg = await loadImage('./slon.png');
        
        const canvas = createCanvas(userImg.width, userImg.height);
        const ctxCanvas = canvas.getContext('2d');
        ctxCanvas.drawImage(userImg, 0, 0);

        // 3. Аналіз фото через ШІ
        const input = tf.browser.fromPixels(canvas);
        const poses = await net.estimateMultiplePoses(input, {
            flipHorizontal: false,
            maxDetections: 5,
            scoreThreshold: 0.5
        });

        if (poses.length > 0) {
            // Якщо знайшли людей, беремо першу
            const keypoints = poses[0].keypoints;
            const head = keypoints.find(k => k.part === 'nose');
            if (head) {
                ctxCanvas.drawImage(elephantImg, head.position.x - 50, head.position.y - 100, 100, 100);
            }
            
            // Обираємо рандомну точку тіла (голова, рука, плече)
            const bodyParts = ['nose', 'leftWrist', 'rightWrist', 'leftShoulder', 'rightShoulder', 'leftElbow', 'rightElbow', 'leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle', 'leftEye', 'rightEye', 'leftEar', 'rightEar', 'mouthLeft', 'mouthRight'];
            const target = keypoints.find(k => k.part === bodyParts[Math.floor(Math.random() * bodyParts.length)]);

            if (target && target.score > 0.5) {
                const size = userImg.width * 0.2; // Розмір слона 20% від ширини фото
                ctxCanvas.drawImage(elephantImg, target.position.x - size/2, target.position.y - size/2, size, size);
            }
        } else {
            // 4. Якщо людей немає — ставимо слона в рандомне місце
            const size = userImg.width * 0.2; // Розмір слона 20% від ширини фото
            const x = Math.random() * (userImg.width - size);
            const y = Math.random() * (userImg.height - size);
            ctxCanvas.drawImage(elephantImg, x, y, size, size);
        }

        // 5. Відправляємо результат
        const buffer = canvas.toBuffer('image/png');
        await ctx.replyWithPhoto({ source: buffer });

        // Очищення пам'яті TF
        input.dispose();
    } catch (e) {
        console.error(e);
        ctx.reply('Сталася помилка при обробці.');
    }
});

bot.launch();   