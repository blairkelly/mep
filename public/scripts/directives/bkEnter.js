angular.module("bkEnter", [])
.directive('bkEnter', ['$parse', function (parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var pressed = false
            element.bind("keydown keypress", function (event) {
                if (event.which == 13 && !pressed) {
                    pressed = true
                    scope.$apply(function () {
                        scope.$eval(attrs.bkEnter, {'event': event});
                    });
                    event.preventDefault();
                    setTimeout(function () {
                        pressed = false;
                    }, 33)
                }
            });
        }
    }
}]);