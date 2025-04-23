require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const session = require("express-session");
const bodyParser = require("body-parser");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка Handlebars
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.handlebars.partials = {};
const { engine } = require('express-handlebars');
app.engine('hbs', engine({
  extname: 'hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')   // <-- важно
}));


hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper("eq", function (a, b) {
  return a === b;
});

hbs.registerHelper("statusLabel", function (status) {
  const map = {
    new: "Новая",
    confirmed: "Подтверждена",
    cancelled: "Отменена",
    completed: "Завершена",
  };
  return map[status] || status;
});

hbs.registerHelper("statusColor", function (status) {
  const map = {
    new: "blue lighten-4",
    confirmed: "green lighten-4",
    cancelled: "red lighten-4",
    completed: "grey lighten-2",
  };
  return map[status] || "";
});

// Парсинг тела запроса
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Сессии
app.use(
  session({
    secret: "supersecretkey", // Заменить на переменную из .env в будущем
    resave: false,
    saveUninitialized: false,
  })
);

// Статические файлы
app.use(express.static(path.join(__dirname, "public")));

// Роутинг
app.use("/", routes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
});
