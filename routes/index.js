// routes/index.js
const express = require('express');
const router  = express.Router();

const ctrl = require('../controllers/mainController');
const auth = require('../middleware/auth');

/* ---------- Клиент ---------- */
router.get('/',                         ctrl.clientWelcome);
router.get('/client/select-service',    ctrl.clientSelectService);
router.get('/client/select-master/:serviceId',     ctrl.clientSelectMaster);
router.get('/client/select-slot/:serviceId/:masterId', ctrl.clientSelectSlot);
router.get('/client/apply',             ctrl.clientApplicationForm);
router.post('/client/submit-application', ctrl.clientSubmitApplication);

/* ---------- Аутентификация ---------- */
router.get('/login',  ctrl.loginForm);
router.post('/login', ctrl.login);
router.get('/logout', ctrl.logout);

/* ---------- Менеджер ---------- */
router.get('/dashboard', auth.requireManager, ctrl.dashboard);

router.get('/services',        auth.requireManager, ctrl.services);
router.post('/services/add',   auth.requireManager, ctrl.addService);
router.get('/services/edit/:id',        auth.requireManager, ctrl.editServiceForm);
router.post('/services/edit/:id',       auth.requireManager, ctrl.updateService);
router.get('/services/toggle/:id',      auth.requireManager, ctrl.toggleService);
router.get('/services/delete/:id',      auth.requireManager, ctrl.deleteService);

router.get('/masters',           auth.requireManager, ctrl.masters);
router.post('/masters/add',      auth.requireManager, ctrl.addMaster);
router.get('/masters/edit/:id',  auth.requireManager, ctrl.editMasterForm);
router.post('/masters/edit/:id', auth.requireManager, ctrl.updateMaster);
router.get('/masters/delete/:id',auth.requireManager, ctrl.deleteMaster);

router.get('/requests',                 auth.requireManager, ctrl.managerRequests);
router.post('/requests/update/:id',     auth.requireManager, ctrl.updateRequestStatus);

/* ---------- Мастер ---------- */
router.get('/schedule',                auth.requireMaster, ctrl.masterSchedule);
router.post('/schedule/add',           auth.requireMaster, ctrl.addSlot);
router.get('/schedule/edit/:id',       auth.requireMaster, ctrl.editSlotForm);
router.post('/schedule/edit/:id',      auth.requireMaster, ctrl.updateSlot);
router.get('/schedule/delete/:id',     auth.requireMaster, ctrl.deleteSlot);

router.get('/my-requests',             auth.requireMaster, ctrl.masterRequests);

router.post('/services/delete/:id',  auth.requireManager, ctrl.deleteService);
router.post('/masters/delete/:id',   auth.requireManager, ctrl.deleteMaster);

router.get ('/services/edit/:id',    auth.requireManager, ctrl.editServiceForm);
router.post('/services/edit/:id',    auth.requireManager, ctrl.updateService);

router.get ('/masters/edit/:id',     auth.requireManager, ctrl.editMasterForm);
router.post('/masters/edit/:id',     auth.requireManager, ctrl.updateMaster);


module.exports = router;
