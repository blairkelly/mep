angular.module("bkTouch", [])
.directive('bkClick', ['$parse', function (parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            //scope: {func: "&bkClick"}

            var isMobile = ((/Mobile/gi).test(navigator.appVersion));

            var downEvent = isMobile ? 'touchstart' : 'mousedown';
            var upEvent = isMobile ? 'touchend' : 'mouseup';
            var moveEvent = isMobile ? 'touchmove' : 'mousemove';

            var movedTooFar = false;

            var apply = function () {
                setTimeout(function () {
                    scope.$apply()
                }, 1);
            }

            var fire = function () {
                parse(attrs.bkClick)(scope);
                apply();
            }

            var setTouchpoint = function (e) {
                var event = e.originalEvent || e;
                var touch = event.touches ? event.touches[0] : event;
                scope.tX = touch.pageX || touch.clientX;
                scope.tY = touch.pageY || touch.clientY;
                scope.sT = $(window).scrollTop();
            }

            var ok = function () {
                var tX = scope.tX;
                var tY = scope.tY;

                var eX = element.offset().left;
                var eY = element.offset().top;

                var eXM = eX + element.width();
                var eYM = eY + element.height();
                
                if ((tX < eX && tX > eXM) && (tY < eY && tY > eYM)) {
                    // "not within element"
                    return false
                }
                
                if (movedTooFar) {
                    movedTooFar = false
                    return false
                }

                return true
            }

            if (isMobile) {
                element.on(downEvent, function (e) {
                    element.addClass('touched');

                    setTouchpoint(e);
                    scope.oX = scope.tX;
                    scope.oY = scope.tY;
                    scope.oST = $(window).scrollTop();

                    apply();

                    if (attrs.immediate) {
                        return fire();
                    }
                });
                element.on(upEvent, function (e) {
                    setTimeout(function () {
                        element.removeClass('touched');
                    }, 20);

                    if (ok()) {
                        if (!attrs.immediate) {
                            fire();
                        }
                    }
                });
                element.on(moveEvent, function (e) {
                    setTouchpoint(e);
                    var movedX = Math.abs(scope.tX - scope.oX);
                    var movedY = Math.abs(scope.tY - scope.oY);
                    var scrolled = Math.abs(scope.sT - scope.oST);

                    if ((movedY > 10) || (scrolled > 10)) {
                        movedTooFar = true;
                        apply();
                    }
                });
            }

            if (!isMobile) {
                element.on('click', function () {
                    fire();
                });
            }
        }
    }
}]);