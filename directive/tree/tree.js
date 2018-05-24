angular.module('directive.tree', [])
    .directive('dyTree', [function () {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'directive/tree/tree.html',
            scope: {
                treeData: '='
            },
            link: function ($scope) {
                $scope.rootItem = []
                var rootIndex = []
                for (var i in $scope.treeData) {
                    var flag = false
                    for (var j in $scope.treeData) {
                        if ($scope.treeData[i].parentId != $scope.treeData[j].id) {
                            flag = true
                        } else {
                            flag = false
                            break;
                        }
                    }
                    if (flag) {
                        rootIndex.push(i)
                        $scope.rootItem.push($scope.treeData[i])
                    }
                }
                for (var i = rootIndex.length - 1; i >= 0; i --) {
                    $scope.treeData.splice(rootIndex[i], 1)
                }
            }
        };
    }])
    .directive('dyTreeLevel', function () {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                rootPoint: '=',
                childrenData: '='
            },
            template: `
                    <ul>
                        <li ng-repeat="i in points">
                            <span class="df df-folder"></span>
                            <span ng-bind="i.name"></span>
                            <div dy-tree-level root-point="i" children-data="childrenData"></div>
                        </li>
                    </ul>
            `,
            link: function ($scope) {
                $scope.points = []
                var rootIndex = []
                for (var i in $scope.childrenData) {
                    console.log(1)
                    if ($scope.rootPoint.id == $scope.childrenData[i].parentId) {
                        rootIndex.push(i)
                        $scope.points.push($scope.childrenData[i])
                    }
                }
                for (var i = rootIndex.length - 1; i >= 0; i --) {
                    $scope.childrenData.splice(rootIndex[i], 1)
                }
            }
        }
    })