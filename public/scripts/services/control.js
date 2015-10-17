angular.module("controlService", [])
.service('Control', ['$http', function (http) {
    var exports = {};

    /*
    exports.post_datum = function (datum, callback) {
        http.post('', datum).error(callback).then(callback);
    }
    */

    exports.record = function (data, callback) {
        http.post('/api/control/record', data).error(callback).then(callback);
    }

    exports.is_recording = function (callback) {
        http.get('/api/control/is_recording').error(callback).then(callback);
    }

    return exports;
}])