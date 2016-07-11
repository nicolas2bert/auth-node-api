const express = require('express');
const router = express.Router();

const auth = require('./auth.js');
const events = require('./events.js');
const users = require('./users.js');
//const user = require('./users.js');


// no need to be token-checked
router.post('/login', auth.login);

//need to be token-checked
router.get('/api/v1/events', events.findAll);
router.get('/api/v1/events/:id', events.findOne);
router.post('/api/v1/events', events.create);
router.post('/api/v1/events/:id',events.update);
router.delete('/api/v1/events/:id',events.delete);

//only admin can manage users
router.get('/api/v1/admin/users', users.findAll);
router.get('/api/v1/admin/users/:id', users.findOne);
router.post('/api/v1/admin/users', users.create);
router.post('/api/v1/admin/users/:id', users.update);
router.delete('/api/v1/admin/users/:id', users.delete);


module.exports = router;
