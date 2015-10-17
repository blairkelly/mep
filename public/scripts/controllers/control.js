angular.module('controlController', [])
.controller('controlController', ['$rootScope', '$scope', 'Control', function (rootScope, scope, Control) {
    scope.stage = 'start';

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
        scope.stage = 'info';
    }

    scope.after_name = function () {
        console.log("hi");
    }

    console.log("loaded controlController");
}])