(function () {

    app.controller('controllerToolbarMenu', function ($rootScope, $scope, $mdInkRipple, $mdDialog, $location, hotkeys, $compile, $filter, $mdToast) {

        var widgets = $scope.widgets=[
            {name: "Live Feed",          widget: "feed",         icon: "view_list"},
            {name: "Chatbot",           widget: "chat",         icon: "chat"},
            {name: "cognitive Marketplace",          widget: "market",        icon: "shopping_cart"}

        ];

        hotkeys.bindTo($rootScope)
            .add({
                combo: 's',
                description: 'Search.',
                callback: function () {
                    $scope.showSearch = !$scope.showSearch;
                }
            });

        $scope.openMenu = function ($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        $scope.menuSettings = function () {
            $location.path("/settings");
        };

        $scope.addWidget = function () {
            $mdDialog.show({
                templateUrl: 'templates/modal/modalAddWidget.html',
                clickOutsideToClose: true,
                closeTo: angular.element(document.querySelector('#addWidget')),
                openFrom: angular.element(document.querySelector('#addWidget')),
                controller: function ($scope) {
                    $scope.widgetsAdd=widgets;

                    $scope.close = function () {
                        $mdDialog.hide();
                    };

                    $scope.select = function (newWidget) {
                        $mdDialog.hide();
                        if(newWidget == "todo" || newWidget == "iot" || newWidget == "iotStag" || newWidget == "pol" ||
                            newWidget == "map" || newWidget == "bar" || newWidget == "pie" || newWidget == "radar") {
                            $rootScope.addDashboardItem({ size: { x: 2, y: 2 }, position: [0, 0], max: {x: 2, y: 2}, min: {x: 2, y: 2}, widget: newWidget, id: Math.random()});
                        } else if(newWidget == "arminfacts" || newWidget == "twitter") {
                            $rootScope.addDashboardItem({ size: { x: 2, y: 1 }, position: [0, 0], max: {x: 2, y: 1}, min: {x: 2, y: 1}, widget: newWidget, id: Math.random()});
                        } else {
                            $rootScope.addDashboardItem({ size: { x: 1, y: 1 }, position: [0, 0], widget: newWidget, id: Math.random()});
                        }
                    }
                }
            });
        };

        $scope.cancelSearch = function(){
            $scope.showSearch = !$scope.showSearch;

            $scope.searchText = null;
            $rootScope.restoreDashboard();
        };

        $scope.$watch('searchText', function(widgetSearch) {
            $rootScope.restoreDashboard();
            if(widgetSearch){
                var markedWidgets=[];
                var widget = $filter('filter')($scope.widgets, '!'+widgetSearch);
                for(var j=0;j<$rootScope.dashboard.length;j++){
                    for(var i=0;i<widget.length;i++){
                        if(widget[i].widget == $rootScope.dashboard[j].widget) {
                            markedWidgets.push($rootScope.dashboard[j].id);
                        }
                    }
                }
                for(var k=0; k<markedWidgets.length;k++){
                    $rootScope.hideDashboardItem(markedWidgets[k]);
                }
            }
            else if(!$scope.searchText) {
                $rootScope.saveDashboard();
            }
        });

        $scope.openWeb = function(url){
            if(url.match("www")){
                if(url.match('http://')){
                    window.open(url, '_blank');
                }
                else window.open('http://'+url, '_blank');
            }
            else if(url.match('http://')){
                window.open(url, '_blank');
            }
        }


    });

})();
