angular.module('controlController', [])
.controller('controlController', ['$rootScope', '$scope', 'Control', function (rootScope, scope, Control) {
    scope.stage = 'start';
    scope.name = '';
    scope.recording_allowance = 30000; //milliseconds
    scope.recording = false;
    scope.add_ceiling = scope.add_ceiling_original = 0.80;

    var countdown = function () {
        if (!scope.recording) {
            return null;
        }

        scope.timeleft = moment(scope.timesup).diff(moment(), 'milliseconds');

        if (scope.timeleft <= 0) {
            scope.timeleft = 0;
        }

        scope.timepercent = scope.timeleft / scope.recording_allowance;

        if (scope.timeleft <= 0) {
            if (scope.recording) {
                scope.record();
            }
            return console.log("times up!");
        }

        setTimeout(function () {
            scope.$apply();
            countdown();
        }, 27)
    }

    var check_for_recording = function () {
        setTimeout(function () {
            if (scope.transferring) {
                Control.is_recording(function (response) {
                    console.log(response.data);
                    if (response.data == 'done transferring') {
                        console.log("I see we're finished recording via request.");
                        scope.transferring = false;
                        scope.stage = 'start';
                        setTimeout(function () {
                            scope.$apply();
                        }, 1);
                    }
                    else {
                        check_for_recording();
                    }
                });
            }
        }, 1000)
    }

    scope.record = function (toggle) {
        Control.record({toggle: toggle, username: scope.name}, function (response) {
            if (response.status == 200) {
                if (toggle) {
                    console.log('recording...');
                    scope.timesup = moment().add(scope.recording_allowance, 'milliseconds');
                    scope.timepercent = 1;
                    scope.recording = true;
                    countdown();
                    return scope.stage = 'recording';
                }
                console.log("stopped recording");
                scope.recording = false;
                scope.stage = 'stopped';
                scope.transferring = true;
                setTimeout(function () {
                    scope.name = '';
                    scope.add_ceiling = scope.add_ceiling_original;
                    check_for_recording();
                    if (scope.transferring) {
                        console.log('still transferring...')
                        scope.stage = 'transition';
                    }
                    else {
                        scope.stage = 'start';
                    }
                    scope.$apply();
                }, 9000);
            }
        });
    }

    scope.stop_recording = function () {
        scope.recording = false;
        scope.record();
    }

    scope.addtime = function () {
        if (scope.timepercent < scope.add_ceiling) {
            scope.timesup = moment(scope.timesup).add((scope.recording_allowance * scope.add_ceiling) * (1 - scope.add_ceiling), 'milliseconds');
            scope.add_ceiling = scope.add_ceiling - 0.05;
        }
    }

    scope.start = function () {
        scope.stage = 'info name';
    }

    scope.after_name = function () {
        if (scope.name && scope.name.length > 0) {
            $('input.name').blur();
            //scope.stage = 'info_note';
            scope.stage = 'info time';
        }
    }

    var add_socket_listeners = function () {
        console.log('socket connected!');

        socket.on('welcome', function (data) {
            console.log(data.message);
        });

        socket.emit('control', {hi: 'hi'});

        socket.on('message', function (data) {
            return console.log('got message', data);

            if (data.finished_transfer) {
                scope.transferring = false;
                if (scope.stage != 'stopped') {
                    scope.stage = 'start';
                }
                scope.$apply();
            }
        })
        
        socket.on('disconnect', function () {
            console.log('socket disconnected. removing event listeners.');
            socket.removeAllListeners();
            socket.on('connect', function () {
                add_socket_listeners();
            });
        });
    }

    socket.on('connect', function () {
        add_socket_listeners();
    });

    console.log("loaded controlController");
}])