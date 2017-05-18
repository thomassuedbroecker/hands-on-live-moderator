
(function () {

    app.directive('widgetAbout', ['$mdToast', function ($mdToast) {

        return {
            templateUrl: 'templates/directive/directiveAbout.html',
            restrict: 'E',
            scope: {
                id: '@'
            },
            link: function ($scope, attrs) {

                $scope.id = attrs.id;

                $scope.$on("event:editMode", function (event, data) {
                    $scope.editMode = data.edit;
                    $scope.test = "Überschrift";
                });

                $scope.deleteWidget = function () {
                    $scope.$root.removeDashboardItem($scope.id);
                };
            }
        };

    }]);

})();
