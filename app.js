ёconst express = require('express');
const app = express();

// Позволяет серверу читать входящие JSON-данные от WhatsApp
app.use(express.json());

// Берем токен из настроек Render (или используем vibecode по умолчанию)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'vibecode';
const PORT = process.env.PORT || 3000;

// 1. Маршрут для ПОДТВЕРЖДЕНИЯ вебхука (нужен для Meta)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WEBHOOK_VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 2. Маршрут для ПОЛУЧЕНИЯ сообщений от клиентов
app.post('/webhook', (req, res) => {
  console.log('Получено сообщение:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// 3. Запуск сервера (именно эта команда не дает ему "выключиться")
app.listen(PORT, () => {
  console.log(`Сервер успешно запущен и слушает порт ${PORT}`);
});
