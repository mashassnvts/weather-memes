# Weather & Memes App

Приложение для получения информации о погоде с мемами на основе температуры.

## Структура проекта

- `backend/` - Node.js/Express API сервер
- `frontend/my-app/` - React приложение

## Функциональность

- Получение данных о погоде по названию города
- Отображение соответствующих мемов в зависимости от температуры
- Добавление новых мемов через API
- Кэширование данных о погоде

## Технологии

### Backend
- Node.js
- Express.js
- Axios (для запросов к OpenWeatherMap API)
- Node-cache (для кэширования)
- CORS

### Frontend
- React
- CSS3

## Установка и запуск

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend/my-app
npm install
npm start
```

## Переменные окружения

Создайте файл `.env` в папке `backend/`:
```
WEATHER_API_KEY=your_openweathermap_api_key
```

## API Endpoints

- `GET /weather?city={cityName}` - получение погоды и мема
- `POST /memes` - добавление нового мема
- `GET /memes` - получение всех мемов
- `GET /health` - проверка состояния сервера

## Автор

Мария
