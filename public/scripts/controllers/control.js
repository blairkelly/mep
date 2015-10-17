angular.module('controlController', [])
.controller('controlController', ['$rootScope', '$scope', 'Control', function (rootScope, scope, Control) {
    scope.stage = 'start';
    scope.name = '';
    scope.recording_allowance = 5000; //milliseconds


    var countdown = function () {
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

    scope.record = function (toggle) {
        Control.record({toggle: toggle}, function (response) {
            if (response.status == 200) {
                if (toggle) {
                    console.log('recording...');
                    scope.timesup = moment().add(scope.recording_allowance, 'milliseconds');
                    scope.timepercent = 1;
                    countdown();
                    scope.recording = true;
                    return scope.stage = 'recording';
                }
                console.log("stopped recording");
                scope.recording = false;
                scope.stage = 'stopped';
            }
        });
    }

    scope.stop_recording = function () {
        scope.recording = false;
        scope.record();
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

    /*
    scope.after_note = function () {
        $('input.note').blur();
        scope.stage = 'info_public';
    }
    */

    console.log("loaded controlController");
}])