var app = module.parent.exports;
var request = require('request');
var fs = require('fs');
var path = require('path');
var db = app.lib.mysql;
var recording = false;
var transferring = false;
var mysql = db.mysql;
var io = app.io;
var audioRecord = require('node-record-lpcm16');

console.log("Serial address: " + process.env.SERIAL_ADDRESS);

var audioFilesPath = path.resolve(__dirname + '/../public/audio');
var tempAudioFilePath = path.join(audioFilesPath, 'temp.wav');

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const sport = new SerialPort(process.env.SERIAL_ADDRESS);
const parser = new Readline();
sport.pipe(parser);
parser.on('data', function (something1, something2) {
    console.log('got something', something1, something2)
});

sport.on("open", function () {
    var message = null;
    console.log('opened serial port');

    //sport.write('p0\r');
});

setTimeout(function () {
    //sport.write('p1\r');
}, 2000);

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
    console.log("Not deleting");
    return cb();
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

var get_video = function (directory, filename, cb) {
    console.log("getting", directory, filename);

    var destname = directory + '-' + filename;
    var filedest = path.resolve(__dirname + '/../public/videos/' + destname);

    console.log("not doing this shit");
    return cb(null, destname);

    var stream = request.get('http://10.5.5.9:8080/videos/DCIM/' + directory + '/' + filename)
    .on('error', function (err) {
        console.log('error getting video from camera', err)
        return cb(err);
    })
    .pipe(fs.createWriteStream(filedest))

    stream.on('finish', function () { 
        cb(null, destname);
    });
}

app.get('/control', app.mainMiddleware, function (req, res, next) {
    res.render('control/index.jade');
});

app.post('/api/control/record', function (req, res, next) {
    if (transferring) {
        return res.sendStatus(503); //unavailable
    }
    var toggle = req.body.toggle ? '1' : '0';
    //console.log("toggling", toggle);
    //sport.write('p' + toggle + '\r');

    var tempAudioFile = fs.createWriteStream(tempAudioFilePath, { encoding: 'binary' });

    audioRecord.start({
        device: process.env.RECORDING_DEVICE,
        sampleRate : 44100,
        silence: '9999.0',
        threshold     : 0,
        thresholdStart: 0,
        thresholdEnd: 0
    }).pipe(tempAudioFile);

    setTimeout(function () {
        request({ 
                method: 'GET',
                uri: 'http://10.5.5.9/gp/gpControl/command/shutter?p=' + toggle,
            },
            function (error, response, body) {
                if (error) {
                    audioRecord.stop();
                    console.log('error telling the camera to change recording state', toggle, error);
                    return res.sendStatus(500);
                }
                if (response.statusCode != 200) {
                    audioRecord.stop();
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
                    audioRecord.stop();
                    setTimeout(function () {
                        get_media_list(function (err, result) {
                            if (err) {
                                return console.log("problem getting media list");
                            }
                            console.log("got media list: ");
                            var parsed_result = JSON.parse(result);
                            var directory = parsed_result.media[0].d;
                            var files = parsed_result.media[0].fs;
                            var filename = files[0].n;
                            console.log(files[0]);
                            var size = (files[0].ls >= 0) ? files[0].ls : files[0].s;  //not sure if this is actually the size.
                            var fileBaseName = filename.split('.')[0];
                            var newAudioFilePath = path.join(audioFilesPath, fileBaseName + '.wav');
                            fs.rename(tempAudioFilePath, newAudioFilePath, function () {});
                            get_video(directory, filename, function (err, destname) {
                                if (err) {
                                    return console.log("error getting video", err);
                                }
                                console.log("appear to have successfully downloaded the video, now store the info in mysql");
                                var username = mysql.escape(req.body.username);
                                console.log('thanks ', username)

                                var query = 'INSERT INTO mep (filename, username, size) VALUES(\'' + destname + '\', ' + username + ', ' + size + ')';
                                db.query(query, function (err, result) {
                                    if (err) {
                                        return console.error("ERROR creating video entry ", destname, username, size, err);
                                        //return cb(err);
                                    }
                                    setTimeout(function () {
                                    //delete_all_media_on_camera(function (err) {
                                        //if (err) {
                                        //    return console.log("error deleting media from camera for the first time", err);
                                        //}
                                        //console.log("successfully deleted media from camera");
                                        transferring = false;
                                        io.sockets.emit('message', {finished_transfer: true})
                                    //});
                                    }, 5000);
                                });
                            });
                        });
                    }, 5000);
                }
            }
        );
    }, 1000);
});

app.get('/api/control/is_recording', function (req, res, next) {
    if (transferring) {
        return res.send('still transferring'); //unavailable
    }
    res.send('done transferring');
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
}, 3000);
