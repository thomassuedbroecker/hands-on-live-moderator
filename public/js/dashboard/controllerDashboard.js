
(function () {

    app.controller('controllerDashboard', function ($rootScope, $scope) {

        // Disable spinner when page is loaded
        $rootScope.spinnerMode = "";

        // Show the dashboard menu buttons
        $rootScope.showMenuSearch = true;
        $rootScope.showMenuAddWidget = true;
    });

})();
