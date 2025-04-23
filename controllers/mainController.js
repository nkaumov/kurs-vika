const db = require('../models'); // позже подключим модели
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// ==================== Клиент ====================
exports.clientWelcome = (req, res) => {
  res.render('client-start', { layout: 'main', title: 'Главная', sidebar: null });
};

exports.clientSelectService = async (req, res) => {
  try {
    const services = await db.Service.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
    res.render('client-select-service', { layout: 'main', title: 'Выбор услуги', services, sidebar: null });
  } catch (e) {
    console.error(e);
    res.redirect('/');
  }
};

exports.clientSelectMaster = async (req, res) => {
  try {
    const serviceId = +req.params.serviceId;
    const service   = await db.Service.findByPk(serviceId);
    if (!service) return res.redirect('/client/select-service');

    const masters = await db.Master.findAll({
      where: {
        service_category: service.category,
        is_active: true
      },
      order: [['full_name', 'ASC']]
    });

    res.render('client-select-master', {
      layout: 'main',
      title: 'Выбор мастера',
      masters,
      serviceId,
      sidebar: null
    });
  } catch (e) {
    console.error(e);
    res.redirect('/client/select-service');
  }
};

exports.clientSelectSlot = async (req, res) => {
  try {
    const { serviceId, masterId } = req.params;

    const slots = await db.AppointmentSlot.findAll({
      where: {
        master_id: masterId,
        status: 'available',
        date: { [Op.gte]: new Date() }          // только будущие окна
      },
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    res.render('client-select-slot', {
      layout: 'main',
      title: 'Выбор времени',
      slots,
      serviceId,
      masterId,
      sidebar: null
    });
  } catch (e) {
    console.error(e);
    res.redirect(`/client/select-master/${req.params.serviceId}`);
  }
};

exports.clientApplicationForm = async (req, res) => {
  try {
    const { service_id, master_id, slot_id } = req.query;

    const [service, master, slot] = await Promise.all([
      db.Service.findByPk(service_id),
      db.Master.findByPk(master_id),
      db.AppointmentSlot.findByPk(slot_id)
    ]);

    if (!service || !master || !slot || slot.status !== 'available') {
      return res.redirect('/client/select-service');
    }

    res.render('client-application', {
      layout: 'main',
      title: 'Заявка',
      service,
      master,
      slot,
      sidebar: null
    });
  } catch (e) {
    console.error(e);
    res.redirect('/client/select-service');
  }
};

exports.clientSubmitApplication = async (req, res) => {
  try {
    const { client_name, client_phone, service_id, master_id, slot_id } = req.body;

    // атомарно бронируем окно
    await db.sequelize.transaction(async (t) => {
      const slot = await db.AppointmentSlot.findByPk(slot_id, { lock: t.LOCK.UPDATE, transaction: t });
      if (!slot || slot.status !== 'available') throw new Error('slot busy');

      slot.status = 'booked';
      await slot.save({ transaction: t });

      await db.Application.create({
        client_name,
        client_phone,
        service_id,
        master_id,
        slot_id,
        status: 'new'
      }, { transaction: t });
    });

    res.redirect('/?success=1');
  } catch (e) {
    console.error('Ошибка создания заявки:', e);
    res.redirect('/?error=1');
  }
};

// ==================== Менеджер ====================
exports.dashboard = (req, res) => {
  res.render('dashboard', { layout: 'main', title: 'Дашборд', sidebar: 'sidebar-manager' });
};

exports.services = async (req, res) => {
  try {
    const services = await db.Service.findAll({ order: [['created_at', 'DESC']] });
    res.render('services', { layout: 'main', title: 'Услуги', sidebar: 'sidebar-manager', services });
  } catch (e) {
    console.error(e);
    res.redirect('/dashboard');
  }
};

// exports.services = async (req, res) => {
//   const services = []; // получить из БД
//   res.render('services', { layout: 'main', title: 'Услуги', sidebar: 'sidebar-manager', services });
// };

exports.addService = async (req, res) => {
  const { name, category, description, price } = req.body;
  try {
    await db.Service.create({ name, category, description, price, is_active: true });
    res.redirect('/services');
  } catch (err) {
    console.error('Ошибка при добавлении услуги:', err);
    res.redirect('/services');
  }
};

  

exports.editServiceForm = async (req, res) => {
  const service = await db.Service.findByPk(req.params.id);
  if (!service) return res.redirect('/services');
  res.render('edit-service', { layout: 'main', title: 'Редактирование услуги', sidebar: 'sidebar-manager', service });
};


exports.updateService = async (req, res) => {
  try {
    await db.Service.update(req.body, { where: { id: req.params.id } });
    res.redirect('/services');
  } catch (e) {
    console.error(e);
    res.redirect('/services');
  }
};

exports.toggleService = async (req, res) => {
  try {
    const service = await db.Service.findByPk(req.params.id);
    if (service) {
      service.is_active = !service.is_active;
      await service.save();
    }
    res.redirect('/services');
  } catch (e) {
    console.error(e);
    res.redirect('/services');
  }
};

exports.deleteService = async (req, res) => {
  try {
    await db.Service.destroy({ where: { id: req.params.id } });
    res.redirect('/services');
  } catch (e) {
    console.error(e);
    res.redirect('/services');
  }
};


// ===== Masters =====

exports.masters = async (req, res) => {
  try {
    const masters = await db.Master.findAll({ order: [['created_at', 'DESC']] });
    res.render('masters', { layout: 'main', title: 'Мастера', sidebar: 'sidebar-manager', masters });
  } catch (err) {
    console.error('Ошибка при получении мастеров:', err);
    res.redirect('/dashboard');
  }
};
  
exports.addMaster = async (req, res) => {
  const { full_name, phone, category, login, password } = req.body;
  try {
    const password_hash = await bcrypt.hash(password, 10);
    await db.Master.create({
      full_name,
      phone,
      service_category: category,
      login,
      password_hash,
      is_active: true
    });
    res.redirect('/masters');
  } catch (err) {
    console.error('Ошибка при добавлении мастера:', err);
    res.redirect('/masters');
  }
};


exports.editMasterForm = async (req, res) => {
  const master = await db.Master.findByPk(req.params.id);
  if (!master) return res.redirect('/masters');
  res.render('edit-master', { layout: 'main', title: 'Редактирование мастера', sidebar: 'sidebar-manager', master });
};

exports.updateMaster = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    if (password) rest.password_hash = await bcrypt.hash(password, 10);
    await db.Master.update(rest, { where: { id: req.params.id } });
    res.redirect('/masters');
  } catch (e) {
    console.error(e);
    res.redirect('/masters');
  }
};

exports.deleteMaster = async (req, res) => {
  try {
    await db.Master.destroy({ where: { id: req.params.id } });
    res.redirect('/masters');
  } catch (e) {
    console.error(e);
    res.redirect('/masters');
  }
};

exports.managerRequests = async (req, res) => {
  try {
    const requests = await db.Application.findAll({
      include: [
        { model: db.Service, attributes: ['name'] },
        { model: db.Master,  attributes: ['full_name'] },
        { model: db.AppointmentSlot }
      ],
      order: [['created_at', 'DESC']]
    });

    const prepared = requests.map(r => ({
      id: r.id,
      client_name: r.client_name,
      client_phone: r.client_phone,
      service_name: r.Service.name,
      master_name:  r.Master.full_name,
      date: r.AppointmentSlot.date,
      time: r.AppointmentSlot.time,
      status: r.status
    }));

    res.render('requests', { layout: 'main', title: 'Заявки', sidebar: 'sidebar-manager', requests: prepared });
  } catch (e) {
    console.error(e);
    res.redirect('/dashboard');
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.Application.update({ status }, { where: { id: req.params.id } });
    res.redirect('/requests');
  } catch (e) {
    console.error(e);
    res.redirect('/requests');
  }
};
  

// ==================== Мастер ====================
exports.masterSchedule = async (req, res) => {
  try {
    const slots = await db.AppointmentSlot.findAll({
      where: { master_id: req.session.user.id },
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.render('schedule', { layout: 'main', title: 'Окна', sidebar: 'sidebar-master', slots });
  } catch (e) {
    console.error(e);
    res.redirect('/schedule');
  }
};

exports.addSlot = async (req, res) => {
  try {
    await db.AppointmentSlot.create({
      master_id: req.session.user.id,
      service_category: req.body.service_category,
      date: req.body.date,
      time: req.body.time,
      status: 'available'
    });
    res.redirect('/schedule');
  } catch (e) {
    console.error(e);
    res.redirect('/schedule');
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    await db.AppointmentSlot.destroy({
      where: { id: req.params.id, master_id: req.session.user.id }
    });
    res.redirect('/schedule');
  } catch (e) {
    console.error(e);
    res.redirect('/schedule');
  }
};

exports.editSlotForm = async (req, res) => {
  const slot = await db.AppointmentSlot.findOne({
    where: { id: req.params.id, master_id: req.session.user.id }
  });
  if (!slot) return res.redirect('/schedule');
  res.render('edit-slot', { layout: 'main', title: 'Редактирование окна', sidebar: 'sidebar-master', slot });
};

exports.updateSlot = async (req, res) => {
  try {
    await db.AppointmentSlot.update(
      {
        date: req.body.date,
        time: req.body.time,
        service_category: req.body.service_category
      },
      { where: { id: req.params.id, master_id: req.session.user.id } }
    );
    res.redirect('/schedule');
  } catch (e) {
    console.error(e);
    res.redirect('/schedule');
  }
};


exports.masterRequests = async (req, res) => {
  try {
    const requests = await db.Application.findAll({
      where: { master_id: req.session.user.id },
      include: [
        { model: db.Service, attributes: ['name'] },
        { model: db.AppointmentSlot }
      ],
      order: [['created_at', 'DESC']]
    });

    const prepared = requests.map(r => ({
      client_name: r.client_name,
      client_phone: r.client_phone,
      service_name: r.Service.name,
      date: r.AppointmentSlot.date,
      time: r.AppointmentSlot.time,
      status: r.status
    }));

    res.render('master-requests', {
      layout: 'main',
      title: 'Мои заявки',
      sidebar: 'sidebar-master',
      requests: prepared
    });
  } catch (e) {
    console.error(e);
    res.redirect('/schedule');
  }
};



// ======== АВТОРИЗАЦИЯ ========

exports.loginForm = (req, res) => {
  res.render('login', { layout: 'main', title: 'Вход' });
};

exports.login = async (req, res) => {
  const { login, password } = req.body;

  try {
    // Сначала ищем менеджера
    const manager = await db.Manager.findOne({ where: { login } });
    if (manager && await bcrypt.compare(password, manager.password_hash)) {
      req.session.user = {
        id: manager.id,
        role: 'manager',
        name: manager.full_name
      };
      return res.redirect('/dashboard');
    }

    // Если не найден — ищем мастера
    const master = await db.Master.findOne({ where: { login } });
    if (master && await bcrypt.compare(password, master.password_hash)) {
      req.session.user = {
        id: master.id,
        role: 'master',
        name: master.full_name
      };
      return res.redirect('/schedule');
    }

    // Если никто не найден
    res.render('login', {
      layout: 'main',
      error: 'Неверный логин или пароль'
    });

  } catch (err) {
    console.error(err);
    res.render('login', {
      layout: 'main',
      error: 'Ошибка авторизации. Попробуйте позже.'
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};
