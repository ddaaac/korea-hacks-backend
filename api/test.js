let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
    res.json(req.body);
});

router.post('/', function(req, res, next) {
    res.json(req.body);
});

router.put('/', function(req, res, next) {
    res.json(req.body);
});

router.delete('/', function(req, res, next) {
    res.json(req.body);
});

module.exports = router;