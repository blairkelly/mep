var app = module.parent.exports;
var request = require('request');

app.get('/control', app.mainMiddleware, function (req, res, next) {
    res.render('control/index.jade');
});

app.post('/api/control/start_recording', function (req, res, next) {
    request({ 
            method: 'GET',
            uri: 'http://10.5.5.9/gp/gpControl/command/shutter?p=1',
        },
        function (error, response, body) {
            if (error) {
                console.log('error telling the camera to start recording', error);
                return res.sendStatus(500);
            }
            if (response.statusCode != 200) {
                console.log('non-200 status code', response.statusCode);
                return res.sendStatus(500);
            }


            console.log("success, got", body);

            res.sendStatus(200); 
        }
    );
});