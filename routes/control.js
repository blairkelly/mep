var app = module.parent.exports;
var request = require('request');
var fs = require('fs');
var path = require('path');
var recording = false;
var transferring = false;

var get_media_list = function (cb) {
    request({ 
            method: 'GET',
            uri: 'http://10.5.5.9/gp/gpMediaList',
        },
        function (error, response, body) {
            if (error) {
                cb(error);
                return console.error('error getting media list', error);
            }
            if (response.statusCode != 200) {
                cb(response.statusCode);
                return console.log('non-200 status code', response.statusCode, body);
            }
            cb(null, body);
        }
    );
}
var delete_all_media_on_camera = function (cb) {
    request({ 
            method: 'GET',
            uri: 'http://10.5.5.9/gp/gpControl/command/storage/delete/all',
        },
        function (error, response, body) {
            if (error) {
                cb(error);
                return console.error('error deleting media', error);
            }
            if (response.statusCode != 200) {
                cb(response.statusCode);
                return console.log('non-200 status code', response.statusCode);
            }
            cb(null);
        }
    );
}

delete_all_media_on_camera(function (err) {
    if (err) {
        return console.log("error deleting media from camera for the first time", err);
    }
    console.log("successfully deleted media from camera");
});

var get_video = function (directory, filename) {
    console.log("getting", directory, filename);

    var filedest = path.resolve(__dirname + '/../public/videos/' + directory + '-' + filename);

    return console.log(filedest);

    request.get('http://mysite.com/doodle.png')
    .on('error', function (err) {
        console.log('error getting video from camera', err)
    })
    .pipe(fs.createWriteStream('doodle.png'))

    transferring = false;
}

app.get('/control', app.mainMiddleware, function (req, res, next) {
    res.render('control/index.jade');
});

app.post('/api/control/record', function (req, res, next) {
    if (transferring) {
        return res.sendStatus(503); //unavailable
    }
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
            
            res.sendStatus(200);

            if (req.body.toggle) {
                recording = true;
            }
            else {
                recording = false;
                transferring = true;
                setTimeout(function () {
                    get_media_list(function (err, result) {
                        if (err) {
                            return console.log("problem getting media list");
                        }
                        console.log("got media list: ");
                        var parsed_result = JSON.parse(result);
                        console.log(parsed_result.media);
                        var directory = parsed_result.media[0].d;
                        var files = parsed_result.media[0].fs;
                        var filename = files[0].n;
                        get_video(directory, filename);
                    });
                }, 200);
            }
        }
    );
});



setInterval(function () {
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
}, 5000)