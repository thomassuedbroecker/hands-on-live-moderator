
var app = angular.module('bdd', ['ngMaterial', 'ngRoute', 'cfp.hotkeys', 'gridster', 'ngSanitize']);

// Define all constants.
// INSERT: [YOUR_CLOUDANT_USER] and so on
app.constant('api', {
    url_database: 'https://[YOUR_CLOUDANT_ID].cloudant.com/twitter_db/',
    user_database: '[YOUR_CLOUDANT_USER]',
    pass_database: '[YOUR_CLOUDANT_PASSWORD]'
});

// Define all the routes for the web app.
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/dashboard/general.html',
            controller: 'controllerDashboard'
        })
        .otherwise({
            redirectTo: '/'
        });
}).config(function () {
});

app.run(['$rootScope', '$location', '$mdDialog', '$mdToast', 'hotkeys', 'gridsterConfig', function ($rootScope, $location, $mdDialog, $mdToast, hotkeys, gridsterConfig) {

    var dashboard = [];
    var backupDashboard = [];
    var editMode = false;

    // request permission on page load
    document.addEventListener('DOMContentLoaded', function () {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
    });

    // Configure gridster
    gridsterConfig.columns = 6;
    gridsterConfig.margins = [15, 15];
    gridsterConfig.mobileBreakPoint = 900;

    $rootScope.addDashboardItem = function (item) {
        dashboard.push(item);
    };

    $rootScope.changeEditMode = function() {
        editMode = !editMode;
        $rootScope.$broadcast('event:editMode', {edit: editMode});
        if(editMode) {
            $mdToast.showSimple("Dashboard kann nun editiert werden.");
        } else {
            $mdToast.showSimple("Dashboard kann nun nicht mehr editiert werden.");
        }

    };

    $rootScope.$on('mdToast', function (event, data){
        $mdToast.showSimple(data);
    });

    $rootScope.removeDashboardItem = function(id) {
        for(var i = 0; i < dashboard.length; i++) {
            if(dashboard[i].id == id) {
                dashboard.splice(i, 1);
            }
        }
        $rootScope.saveDashboard();
    };

    $rootScope.saveDashboard = function(){
        $rootScope.tmpDashboard = $rootScope.dashboard.slice();
    };

    $rootScope.hideDashboardItem = function(id) {
        for(var i = 0; i < dashboard.length; i++) {
            if(dashboard[i].id == id) {
                dashboard.splice(i, 1);
            }
        }
    };

    $rootScope.restoreDashboard = function() {
        if($rootScope.tmpDashboard) {
            for (var i = dashboard.length; i >= 0; i--) {
                dashboard.splice(i, 1);
            }
            for (var j = 0; j < $rootScope.tmpDashboard.length; j++) {
                dashboard.push({
                    size: $rootScope.tmpDashboard[j].size,
                    position: $rootScope.tmpDashboard[j].position,
                    widget: $rootScope.tmpDashboard[j].widget,
                    id: $rootScope.tmpDashboard[j].id,
                    deviceid: $rootScope.tmpDashboard[j].deviceid
                });
            }
        }
    };

    $rootScope.dashboard = dashboard;

    $rootScope.$on("$routeChangeStart", function () {
        // Start the spinner when changing content
        $rootScope.spinnerMode = "indeterminate";
    });

    $rootScope.openHome = function () {
        $location.path("");
    };


    $rootScope.addDashboardItem({ size: { x: 3, y: 3 }, position: [0, 0], max: {x: 4, y: 4}, min: {x: 3, y: 3}, widget: "feed", id: Math.random()});
    $rootScope.addDashboardItem({ size: { x: 2, y: 2 }, position: [0, 3], max: {x: 4, y: 4}, min: {x: 3, y: 3}, widget: "chat", id: Math.random()});
    $rootScope.addDashboardItem({ size: { x: 1, y: 1 }, position: [0, 5], max: {x: 2, y: 2}, min: {x: 1, y: 1}, widget: "market", id: Math.random()});

    hotkeys.bindTo($rootScope)
        .add({
            combo: 'm+d',
            description: 'Open general dashboard.',
            callback: function () {
                $location.path("");
            }
        })
}]);
