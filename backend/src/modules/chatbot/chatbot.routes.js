const router = require('express').Router();
const controller = require('./chatbot.controller');
router.post('/message', controller.chat);
module.exports = router;