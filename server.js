const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

// Middleware для обработки CORS и JSON
app.use(cors());
app.use(express.json());

// Обработчик POST-запросов на endpoint /data/
app.post("/data/", (req, res) => {
  try {
    const data = req.body;

    // Здесь вы можете добавить логику обработки полученных данных
    // Например, сохранение в базу данных или отправка уведомлений

    console.log("Получены данные:", data);

    // Отправляем успешный ответ
    res.status(200).json({
      success: true,
      message: "Данные успешно получены",
    });
  } catch (error) {
    console.error("Ошибка при обработке данных:", error);
    res.status(500).json({
      success: false,
      message: "Ошибка при обработке данных",
    });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
