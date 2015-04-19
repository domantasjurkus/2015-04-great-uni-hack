var express = require('express');
var router = express.Router();

/* GET home page. */
//router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Great Uni Hack' });
//});

/* GET GUH ship page. */
router.get('/', function(req, res) {
  var gateway = req.gateway;

  gateway.clientToken.generate({}, function (err, response) {
    var clientToken = response.clientToken;
    //console.log("clientToken:",clientToken);

    res.render('game', { title: 'MLH Hackeraship', clientToken: clientToken });
  });
});

/* GET Braintree checkout page. */
router.post('/checkout', function(req, res) {
  console.log("/checkout:",req.body);
  var nonce = req.body.payment_method_nonce;
  var gateway = req.gateway;

  gateway.transaction.sale({
    amount: '0.05',
    paymentMethodNonce: nonce,
  }, function (err, result) {
    res.send(JSON.stringify(result));
  });
});

module.exports = router;
