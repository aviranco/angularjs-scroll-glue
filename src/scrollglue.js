(function (angular, undefined) {
    'use strict';

    function fakeNgModel(initValue) {
        return {
            $setViewValue: function (value) {
                this.$viewValue = value;
            },
            $viewValue: initValue
        };
    }

    angular.module('luegg.directives', [])
    .directive('scrollGlue', function () {
        return {
            priority: 1,
            require: ['?ngModel'],
            restrict: 'A',
            link: function (scope, $el, attrs, ctrls) {
                var el = $el[0],
                    ngModel = ctrls[0] || fakeNgModel(true);

                function scrollToBottom() {
					// Scroll value fixed, given scrollable value.
                    el.scrollTop = el.scrollHeight - el.clientHeight;
                }

                function shouldActivateAutoScroll() {
					// A small gap variable was inserted to avoid browser bug when manually scrolling to
					// the bottom but not setting the 'shouldActivateAutoScroll()' to true;
					var allowedGap = 5;
					
                    return el.scrollTop + el.clientHeight >= el.scrollHeight - allowedGap;
                }

                scope.$watch(function () {
                    if (ngModel.$viewValue) {
                        scrollToBottom();
                    }
                });

                $el.bind('scroll', function () {
                    scope.$apply(ngModel.$setViewValue.bind(ngModel, shouldActivateAutoScroll()));
                });
            }
        };
    });
}(angular));