require('dotenv').config();
const express  = require('express');
const path     = require('path');
const exphbs   = require('express-handlebars');   // ← вместо пакета «hbs»
const session  = require('express-session');
const bodyParser = require('body-parser');
const routes   = require('./routes');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ---------- Handlebars ---------- */
const hbs = exphbs.create({
  extname:      'hbs',
  layoutsDir:   path.join(__dirname, 'views', 'layouts'),
  partialsDir:  path.join(__dirname, 'views', 'partials'),
  defaultLayout:'main',
  helpers: {
    ifEquals(a, b, opts) { return a == b ? opts.fn(this) : opts.inverse(this); },
    eq(a, b)            { return a === b; },
    statusLabel(status) {
      return ({new:'Новая', confirmed:'Подтверждена', cancelled:'Отменена', completed:'Завершена'})[status] || status;
    },
    statusColor(status) {
      return ({new:'blue lighten-4', confirmed:'green lighten-4',
               cancelled:'red lighten-4', completed:'grey lighten-2'})[status] || '';
    }
  }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

/* ---------- остальной код сервера без изменений ---------- */


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
