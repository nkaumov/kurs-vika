require('dotenv').config();
const express     = require('express');
const path        = require('path');
const exphbs      = require('express-handlebars');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const routes      = require('./routes');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ---------- Handlebars ---------- */
const hbs = exphbs.create({
  extname     : 'hbs',
  layoutsDir  : path.join(__dirname, 'views', 'layouts'),
  partialsDir : path.join(__dirname, 'views', 'partials'),

  /*   <--  КЛЮЧЕВОЙ МОМЕНТ  -->   */
  runtimeOptions : {
    allowProtoPropertiesByDefault : true,
    allowProtoMethodsByDefault    : true
  },

  helpers : {
    /* ✅ уже был */
    eq (a, b) { return a === b; },
  
    /* 🆕 ДОБАВИТЬ ЭТО */
    ifEquals (a, b, options) {
      return (a === b) ? options.fn(this) : options.inverse(this);
    },
  
    statusLabel (status) {
      return (
        { new : 'Новая',
          confirmed : 'Подтверждена',
          cancelled : 'Отменена',
          completed : 'Завершена' })[status] || status;
    },
    statusColor (status) {
      return (
        { new : 'blue lighten-4',
          confirmed : 'green lighten-4',
          cancelled : 'red lighten-4',
          completed : 'grey lighten-2' })[status] || '';
    }
  }
  
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

/* ---------- Static ---------- */
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Parsers ---------- */
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());

/* ---------- Sessions ---------- */
app.use(session({
  secret            : process.env.SESSION_SECRET || 'secret_key',
  resave            : false,
  saveUninitialized : false
}));

/* ---------- Routes ---------- */
app.use(routes);

/* ---------- 404 ---------- */
app.use((req, res) => {
  res.status(404).render('404', {
    layout  : 'main',
    title   : 'Страница не найдена',
    sidebar : null
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
