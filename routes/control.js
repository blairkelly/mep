var app = module.parent.exports;
var request = require('request');
var recording = false;

app.get('/control', app.mainMiddleware, function (req, res, next) {
    res.render('control/index.jade');
});

app.post('/api/control/record', function (req, res, next) {
    var toggle = req.body.toggle ? '1' : '0';
    request({ 
            method: 'GET',
            uri: 'http://10.5.5.9/gp/gpControl/command/shutter?p=' + toggle,
        },
        function (error, response, body) {
            if (error) {
                console.log('error telling the camera to change recording state', toggle, error);
                return res.sendStatus(500);
            }
            if (response.statusCode != 200) {
                console.log('non-200 status code', response.statusCode);
                return res.sendStatus(500);
            }
            if (req.body.toggle) {
                recording = true;
            }
            else {
                recording = false;
            }
            res.sendStatus(200); 
        }
    );
});



setInterval(function () {
    if (!recording) {
        request({ 
                method: 'GET',
                uri: 'http://10.5.5.9/gp/gpControl/status',
            },
            function (error, response, body) {
                if (error) {
                    return console.error('error pinging camera', error);
                }
                if (response.statusCode != 200) {
                    return console.log('non-200 status code', response.statusCode);
                }
            }
        );
    }
}, 5000)