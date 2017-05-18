
(function () {

    app.directive('widgetChat', ['api', '$mdToast', '$mdDialog', '$http', function (api, $mdToast, $mdDialog, $http) {

        return {
            templateUrl: 'templates/directive/directiveChat.html',
            restrict: 'E',
            scope: {
                id: '@'
            },
            link: function ($scope, attrs) {
                $scope.id = attrs.id;

                var url = "/api/message";

                $scope.chats = [];
                // Get all todos
                submit();

                function submit() {
                    $scope.spinnerWidgetChat = "query";
                    if($scope.name){
                      $scope.chats.push(
                        {
                          bot:false,
                          text:$scope.name,
                          timestamp:Date.now()
                        });
                    }
                    $http({
                        method: 'POST',
                        url: url,
                        data: {
                          input: {
                            text: ($scope.name)?$scope.name:"hello"
                          },
                          context: $scope.context || {}
                        }
                    }).then(function (res) {
                      console.log(res);
                      $scope.context=res.data.context;
                      var text ="";
                      for(var t in res.data.output.text){
                          text = res.data.output.text[t];
                      }
                      $scope.chats.push(
                        {
                          bot:true,
                          text:(text)?text:"Sorry, I didn't unterstand that",
                          timestamp:Date.now()
                        });
                        //console.log($scope.context);
                        console.log($scope.chats);
                      //console.log(res.data.output.text);
                      $scope.spinnerWidgetChat = "";
                    },function (e) {
                      console.log(e);
                        $scope.spinnerWidgetChat = "";
                    });
                }

                $scope.submit = function () {
                  submit();
                };

                $scope.$on("event:editMode", function (event, data) {
                    console.log(data);
                    $scope.editMode = data.edit;
                });

                $scope.deleteWidget = function() {
                    $scope.$root.removeDashboardItem($scope.id);
                };
            }
        };
    }]);

})();
