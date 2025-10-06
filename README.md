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

### Backend
Создайте файл `.env` в папке `backend/`:
```
WEATHER_API_KEY=your_openweathermap_api_key
```

### Frontend
Создайте файл `.env` в папке `frontend/my-app/`:
```
REACT_APP_API_URL=http://localhost:5000
```

## Деплой

### Backend на Render
1. Подключите репозиторий к Render
2. Укажите Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Добавьте переменную окружения: `WEATHER_API_KEY`

### Frontend на Vercel
1. Подключите репозиторий к Vercel
2. Укажите Root Directory: `frontend/my-app`
3. Добавьте переменную окружения: `REACT_APP_API_URL` (URL вашего бэкенда на Render)

## API Endpoints

- `GET /weather?city={cityName}` - получение погоды и мема
- `POST /memes` - добавление нового мема
- `GET /memes` - получение всех мемов
- `GET /health` - проверка состояния сервера

## Автор

Мария
