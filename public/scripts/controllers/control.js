angular.module('controlController', [])
.controller('controlController', ['$rootScope', '$scope', 'Control', function (rootScope, scope, Control) {
    
    scope.start_recording = function () {
        Control.start_recording(function (response) {
            console.log("response", response);
        });
    }

    console.log("loaded controlController");
}])