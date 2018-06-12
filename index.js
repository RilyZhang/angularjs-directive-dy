/**
 * Example App:
 */
var testApp = angular.module('test', ['ngAnimate', 'angularjs-directive-dy'])

testApp
    .controller('tooltipCtrl', function () {
    })
    .controller('stepCtrl', function () {
        var $ctrl = this
        $ctrl.step = 0
        $ctrl.stepList = ['第一步', '第二步', '第三步']
        $ctrl.next = function () {
            $ctrl.step++
            if ($ctrl.step >= $ctrl.stepList.length) {
                $ctrl.step = 0
            }
        }
    })
    .controller('selectorCtrl', function ($timeout, $log) {
        var $ctrl = this
        $ctrl.dyList = ['IOS', 'Android', 'windows phone', 'Symbian OS'];

        $ctrl.dyList2 = [
            {dyKey: '苹果', dyVal: '001'},
            {dyKey: '三星', dyVal: '002'},
            {dyKey: '华为', dyVal: '003'},
            {dyKey: '小米', dyVal: '004'},
            {dyKey: '锤子', dyVal: '005'}
        ];
        $ctrl.dyList3 = [
            {brand: '苹果', encoding: '001'},
            {brand: '三星', encoding: '002'},
            {brand: '华为', encoding: '003'},
            {brand: '小米', encoding: '004'},
            {brand: '锤子', encoding: '005'}
        ];
        $ctrl.dyList4 = [];
        $timeout(function () {
            $ctrl.dyList4.push({brand: '苹果', encoding: '001'})
            $ctrl.dyList4.push({brand: '三星', encoding: '002'})
            $ctrl.dyList4.push({brand: '华为', encoding: '003'})
            $ctrl.dyList4.push({brand: '小米', encoding: '004'})
            $ctrl.dyList4.push({brand: '锤子', encoding: '005'})
        }, 3000)

        $ctrl.selectReset = function () {
            $ctrl.a = ''
            $ctrl.b = ''
            $ctrl.c = ''
            $ctrl.d = ''
        }
    })
    .controller('uploaderCtrl', function () {
        var $ctrl = this
        $ctrl.fileType = /.(jpe?g|png|gif|bmp)$/i
        $ctrl.showFiles = function () {
            console.log($ctrl.files)
        }
        $ctrl.maxLengthError = function () {
            $ctrl.errorMsg = '不能超过三张，请重新选择'
        }
        $ctrl.maxSizeError = function () {
            $ctrl.errorMsg = '不能超过5MB'
        }
        $ctrl.repeatNameError = function () {
            $ctrl.errorMsg = '文件名不能重复'
        }
        $ctrl.fileTypeError = function () {
            $ctrl.errorMsg = '文件类型不符合'
        }
    })
    .controller('checkboxCtrl', function () {
        var $ctrl = this
        $ctrl.fav = ["eat", "song"]
    })
    .controller('treeCtrl', function () {
        var $ctrl = this
        $ctrl.dataList = [
            {
                id: 1, name: '新建文件夹1', type: 1, parentId: 0, children: [
                    {id: 3, name: '新建文件夹3', type: 1, parentId: 1},
                    {
                        id: 4, name: '新建文件夹4', type: 2, parentId: 1, children:
                            [
                                {id: 8, name: '新建文件夹8', type: 2, parentId: 4},
                                {id: 9, name: '新建文件夹9', type: 2, parentId: 4},
                            ]
                    }
                ]
            },
            {
                id: 2, name: '新建文件夹2', type: 1, parentId: 0, children:
                    [
                        {
                            id: 5,
                            name: '新建文件夹5',
                            type: 2,
                            parentId: 2,
                            children: [{id: 10, name: '新建文件夹10', type: 2, parentId: 5}]
                        },
                        {id: 6, name: '新建文件夹6', type: 2, parentId: 2},
                        {id: 7, name: '新建文件夹7', type: 2, parentId: 2}
                    ]
            }

        ]
        $ctrl.removeModal = function () {
            $ctrl.treeVal = null
        }
    })

testApp
    .directive('dyScroll', function () {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template: `
                <div class="dy-scroll-container content-over-y">
                    <a class="scroll-bar-y" ng-show="$ctrl.hasBarY"></a>
                    <div class="scroll-content">
                        <ng-transclude></ng-transclude>
                    </div>
                </div>
            `,
            scope: true,
            bindToController: true,
            controllerAs: '$ctrl',
            controller: function () {
            },
            link: function ($scope, $elem, $attr) {
                let $ctrl = $scope.$ctrl
                let sContainer = $elem[0]                                   // 外层容器
                let sContent = $elem[0].querySelector('.scroll-content')    // 填充容器
                let barY = $elem[0].querySelector('.scroll-bar-y')          // 纵向滚动条
                if (sContainer.offsetHeight < sContent.offsetHeight) {
                    $ctrl.hasBarY = true
                }
                barY.style.height = sContainer.offsetHeight * sContainer.offsetHeight / sContent.offsetHeight + 'px'
                sContainer.ratio = (sContainer.scrollHeight - sContainer.offsetHeight) / (sContainer.offsetHeight - barY.offsetHeight)
                sContainer.addEventListener('mousedown', function (event) {
                    if (event.target === barY) {
                        this.prevY = event.pageY
                    }
                })
                sContainer.addEventListener('mouseup', function (event) {
                    this.prevY = null
                })
                sContainer.addEventListener('mousemove', function (event) {
                    if (this.prevY) {
                        if (this.prevY < event.pageY && this.scrollTop + this.offsetHeight >= sContent.offsetHeight) {
                            this.scrollTop = sContent.offsetHeight - this.offsetHeight
                            barY.style.top = (this.scrollTop + this.offsetHeight - barY.offsetHeight) + 'px'
                            return
                        }
                        this.scrollTop += (event.pageY - this.prevY) * this.ratio
                        barY.style.top = (this.scrollTop + this.scrollTop / this.ratio) + 'px'
                        this.prevY = event.pageY
                    }
                    event.preventDefault()
                })
                sContainer.addEventListener('mousewheel', function (event) {
                    console.log(event.deltaY)
                    event.preventDefault()
                    if (event.deltaY > 0 && this.scrollTop + this.offsetHeight >= sContent.offsetHeight) {
                        this.scrollTop = sContent.offsetHeight - this.offsetHeight
                        barY.style.top = (this.scrollTop + this.offsetHeight - barY.offsetHeight) + 'px'
                        return
                    }
                    this.scrollTop += event.deltaY
                    barY.style.top = (this.scrollTop + this.scrollTop / this.ratio) + 'px'
                })
            }
        }
    })