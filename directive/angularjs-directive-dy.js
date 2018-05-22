angular.module('directive.dy', ['ngAnimate'])
    .directive('dySelector', ['$document', function ($document) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                ngModel: '=',
                dyList: '=',
                mode: '@',
                objectHandle: '='
            },
            template: "<div class=\"dy-selector\"><div class=\"dy-selector-value\" ng-class=\"{'dy-selector-able':selectorAble}\" ng-click=\"showList()\"><span ng-if=\"ngModel.dyKey\" ng-bind=\"ngModel.dyKey\"></span><span ng-if=\"!ngModel.dyKey\" ng-bind=\"ngModel\"></span></div><span class=\"df df-down\" ng-class=\"{'rotate-up':isShowList}\"></span><div class=\"dy-selector-list\" ng-show=\"selectorAble && isShowList\"><div ng-hide=\"mode == 'simple'\"><input type=\"text\" ng-model=\"keyWord\"/><span class=\"df df-search-bold\"></span></div><ul><li ng-repeat=\"item in dyList track by $index\" ng-click=\"setItem(item)\" ng-show=\"itemShow(item)\"><span ng-if=\"item.dyKey\" ng-bind=\"item.dyKey\"></span><span ng-if=\"!item.dyKey\" ng-bind=\"item\"></span></li></ul></div></div>",
            link: function ($scope, $element, $attr) {
                if (!$scope.objectHandle) {
                    // 检测传入列表对象类型
                    if ($scope.dyList && $scope.dyList.length > 0) {
                        if (typeof $scope.dyList[0] == 'object') {
                            if (typeof $scope.dyList[0].dyKey == 'undefined' || typeof $scope.dyList[0].dyVal == 'undefined') {
                                throw Error('对象格式不支持，请按照{dyKey : xx, dyVal : xx}格式传参');
                            }
                        }
                    }
                } else {
                    for (var i in $scope.dyList) {
                        $scope.dyList[i].dyKey = $scope.dyList[i][$scope.objectHandle.dyKey]
                        $scope.dyList[i].dyVal = $scope.dyList[i][$scope.objectHandle.dyVal]
                    }

                }
                // 检测层高传入
                if ($attr.zIndex && $attr.zIndex.length > 0) {
                    $element.css({'z-index': $attr.zIndex})
                }
                // 检测是否禁用
                if ($attr.disabled != '' && $attr.disabled != 'disabled') {
                    $scope.selectorAble = true
                } else {
                    $scope.selectorAble = false
                }
                // 检测是否多选
                if (typeof $scope.multiple == 'undefined') {
                    $scope.multiple = false
                }
                $document.on('click', function (e) {
                    if (e.target != $element[0]) {
                        isChild(e.target.parentElement)
                    }
                })

                function isChild(e) {
                    if (e) {
                        if (e != $element[0]) {
                            isChild(e.parentElement)
                        }
                    } else {
                        $scope.isShowList = false
                        $scope.$apply()
                    }
                }

                $scope.isShowList = false
                $scope.keyWord = ''
                $scope.setItem = function (item) {
                    $scope.ngModel = item
                    $scope.isShowList = false
                    $scope.keyWord = ''
                }
                $scope.showList = function () {
                    $scope.isShowList = !$scope.isShowList
                    $scope.keyWord = ''
                }
                $scope.itemShow = function (item) {
                    if (typeof item == 'object') {
                        return item.dyKey.toUpperCase().indexOf($scope.keyWord.toUpperCase()) != -1
                    } else {
                        return item.toUpperCase().indexOf($scope.keyWord.toUpperCase()) != -1
                    }
                }
            }
        }
    }])
    .directive('dyPanel', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                panelTitle: '@',
                theme: '@'
            },
            template: "<div class=\"dy-panel\" ng-class=\"getTheme()\"><div class=\"dy-panel-heading\"><span ng-bind=\"panelTitle\"></span></div><div class=\"dy-panel-body\"><ng-transclude></ng-transclude></div></div>",
            link: function ($scope, $element, $attr) {
                $scope.getTheme = function () {
                    if ($scope.theme) {
                        return $scope.theme
                    }
                }
            }
        }
    })
    .directive('dyStep', function () {
        return {
            restrict: 'E',
            scope: {
                stepList: '=',
                step: '@'
            },
            template: "<ul class=\"dy-step\"><li ng-repeat=\"item in stepList track by $index\" ng-class=\"{active: isActive($index)}\"><span ng-bind=\"item\"></span></li></ul>",
            controller: function ($scope) {
                $scope.isActive = function ($index) {
                    if (!$scope.step) {
                        $scope.step = '0'
                    }
                    return parseInt($scope.step) >= $index;
                }
            }
        }
    })
    .directive('dyTooltip', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var dom = element[0]
                var span = document.createElement('span')
                var str = document.createTextNode(attr.tip)
                span.appendChild(str)
                span.setAttribute('class', 'dy-tooltip')
                var util = {
                    styleTools: function (dom, obj) {
                        for (var x in obj) {
                            dom.style[x] = obj[x]
                        }
                    },
                    showTip: function (e) {
                        util.styleTools(span, {
                            left: e.layerX + 'px',
                            top: e.layerY + 30 + 'px',
                        })
                        dom.appendChild(span)
                        var opacity = eval(getComputedStyle(span).opacity)

                        function animate() {
                            if (opacity < 0.81) {
                                span.style.opacity = opacity += 0.03
                                requestAnimationFrame(animate)
                            }
                        }

                        animate()
                        dom.addEventListener('mousemove', function (e) {
                            util.styleTools(span, {
                                left: e.layerX + 'px',
                                top: e.layerY + 30 + 'px',
                            })
                        })
                    },
                    removeTip: function (e) {
                        dom.removeChild(span)
                    },
                }
                dom.addEventListener('mouseenter', util.showTip)
                dom.addEventListener('mouseout', util.removeTip)
            },
        }
    })