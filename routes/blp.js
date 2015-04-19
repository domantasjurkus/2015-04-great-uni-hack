var express = require('express');
var router = express.Router();

var https = require('https');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('blp', { title: 'Bloomberg' });
});

/* GET Bloomberg listing. */
router.get('/api', function(rreq, rres, rnext) {

  var options = {
    host: "http-api.openbloomberg.com",
    port: 443,
    path: '/request?ns=blp&service=refdata&type=HistoricalDataRequest',
    method: 'POST',
    key: fs.readFileSync('blpapi/client.key'),
    cert: fs.readFileSync('blpapi/client.crt'),
    ca: fs.readFileSync('blpapi/bloomberg.crt')
  };

  var blp = https.request(options, function(res) {
    //console.log("statusCode: ", res.statusCode);
    //console.log("headers: ", res.headers);

    var data = "";
    var result = [];
    res.on('data', function(d) {
      //process.stdout.write(d.data);
      data += d;
    });

     res.on('end', function(d) {
       data = JSON.parse(data).data;
       //console.log("data",data);
       data.forEach(function(el, idx) {
         result.push({
           key: el.securityData.security,
           data: el.securityData.fieldData[0].PX_LAST
         });
       });
       //rres.send(JSON.stringify(data));
       rres.json(result);
     });
  });

  blp.write(JSON.stringify(rreq.query));

  blp.end();

  blp.on('error', function(e) {
    console.error(e);
  });

});

module.exports = router;
