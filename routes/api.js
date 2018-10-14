var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();

/* GET users listing. */
router.post('/hash/calculate', function(req, res, next) {
  console.log(req.body);
  let hash = bcrypt.hashSync(req.body.rawText, req.body.stretch);
  res.send(JSON.stringify({hash: hash}));
});

router.post('/hash/compare', function(req, res, next) {
  console.log(req.body);
  let result = bcrypt.compareSync(req.body.rawText, req.body.hashText);
  res.send(JSON.stringify({result: result}));
});

module.exports = router;
