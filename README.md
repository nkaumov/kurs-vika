# kurs-vika

# Структура клиентской части

/views
├── layouts
│   └── main.hbs               # Общий шаблон с хедером и сайдбаром
├── partials
│   ├── sidebar-manager.hbs    # Сайдбар для менеджера
│   ├── sidebar-master.hbs     # Сайдбар для мастера
│   ├── service-card.hbs       # Отдельный компонент карточки услуги
│   └── master-row.hbs         # Строка мастера в таблице
├── dashboard.hbs              # Дашборд (страница приветствия менеджера)
├── services.hbs               # Страница со списком услуг
├── masters.hbs                # Страница с мастерами
├── requests.hbs               # Заявки менеджера
├── schedule.hbs               # Окна (мастера)
├── master-requests.hbs        # Заявки мастера
├── client-start.hbs           # Приветственная страница клиента
├── client-select-service.hbs  # Тест выбора услуги
├── client-select-master.hbs   # Выбор мастера
├── client-select-slot.hbs     # Доступные окошки
└── client-application.hbs     # Форма заявки
