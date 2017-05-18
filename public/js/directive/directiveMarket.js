
(function () {

  app.directive('widgetMarket', ['$sanitize', '$sce', 'api', '$mdToast', '$mdDialog', '$http', 'feedSocket', function ($sanitize, $sce, api, $mdToast, $mdDialog, $http, feedSocket) {

    return {
      templateUrl: 'templates/directive/directiveMarket.html',
      restrict: 'E',
      scope: {
        id: '@'
      },
      link: function ($scope, attrs) {

                $scope.id = attrs.id;

                $scope.openMarket = function() {
                    window.open("http://cognitive-market.eu-gb.mybluemix.net", '_blank');
                };

                $scope.$on("event:editMode", function (event, data) {
                    $scope.editMode = data.edit;
                    $scope.test = "Überschrift";
                });

                $scope.deleteWidget = function() {
                    $scope.$root.removeDashboardItem($scope.id);
                };
            }
    };
  }]);
})();
