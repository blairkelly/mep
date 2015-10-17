angular.module("controlService", [])
.service('Control', ['$http', function (http) {
    var exports = {};

    /*
    exports.post_datum = function (datum, callback) {
        http.post('', datum).error(callback).then(callback);
    }
    */

    exports.start_recording = function (callback) {
        http.post('/api/control/start_recording').error(callback).then(callback);
    }

    return exports;
}])