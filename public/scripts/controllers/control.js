angular.module('controlController', [])
.controller('controlController', ['$rootScope', '$scope', 'Control', function (rootScope, scope, Control) {
    scope.stage = 'start';
    scope.name = '';

    scope.record = function (toggle) {
        Control.record({toggle: toggle}, function (response) {
            if (response.status == 200) {
                if (toggle) {
                    console.log('recording...');
                    return scope.recording = true;
                }
                console.log("stopped recording");
                scope.recording = false;
            }
        });
    }

    scope.start = function () {
        scope.stage = 'info_name';
    }

    scope.after_name = function () {
        if (scope.name && scope.name.length > 0) {
            scope.stage = 'info_note';
        }
    }

    console.log("loaded controlController");
}])