
(function () {

  app.directive('widgetFeed', ['$sanitize', '$sce', 'api', '$mdToast', '$mdDialog', '$http', 'feedSocket', function ($sanitize, $sce, api, $mdToast, $mdDialog, $http, feedSocket) {

    return {
      templateUrl: 'templates/directive/directiveFeed.html',
      restrict: 'E',
      scope: {
        id: '@'
      },
      link: function ($scope, attrs) {
        $scope.id = attrs.id;
        $scope.feed = [];

        getFeed();

        feedSocket.subscribe(function (newUpdate) {
          $scope.feed.push(newUpdate);
        });

        function getFeed() {
          $scope.spinnerWidget = "query";
          $http({
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + btoa(api.user_database + ':' + api.pass_database)
            },
            url: api.url_database + '_all_docs?include_docs=true'
          }).then(function (response) {
            response = response.data;
            for (var i = 0; i < response.total_rows; i++) {
              $scope.feed.push(response.rows[i].doc);
            }
            $scope.spinnerWidget = "";
          }).catch(function (err) {
            console.log(err);
            $scope.spinnerWidget = "";
            $mdToast.showSimple("Previous feed updates do not seem to be present");
          });
        }

        $scope.postFeedback = function () {
          if (typeof $scope.feedback === 'string'
            && $scope.feedback.trim().length > 0) {
            var feedback = $scope.feedback.trim();
            $scope.spinnerWidget = "query";
            // INSERT [YOUR_BLUEMIX_ROUTE]
            $http({
              url: 'https://[YOUR_BLUEMIX_ROUTE].mybluemix.net/postFeedback',
              method: 'POST',
              headers: {
                "Content-Type": "text/plain"
              },
              data: feedback
            }).then(function () {
              $scope.spinnerWidget = "";
              $mdToast.showSimple("Your feedback is appreciated!");
              $scope.feedback = '';
            }).catch(function (err) {
              $scope.spinnerWidget = "";
              console.log(err);
            });
          }
        };

        $scope.format = function (data_obj) {
          var message = $sanitize(data_obj.payload);
          console.log(">>> payload: ", message);
          console.log(">>> data: ", data_obj);

          if (data_obj.features) {
            message = wrapElement(message, data_obj.features['sentiment']);
            console.log(">>> output message:", message);
            console.log(">>> 'doc-sentiment':", data_obj.features['sentiment']);

            // Check Entities
            if (data_obj.features.entity) {
              for (var i in data_obj.features.entity) {
                var entity = data_obj.features.entity[i];
                messsage = message.replace($sanitize(entity.text), wrapElement(entity.text, entity.sentiment));
              }
            }

            if (data_obj.features.keyword) {
              for (var i in data_obj.features.keyword) {
                var keyword = data_obj.features.keyword[i];
                messsage = message.replace($sanitize(keyword.text), wrapElement(keyword.text, keyword.sentiment));
              }
            }

            if (data_obj.features.sentiment) {
                var document = data_obj.features.sentiment.document;
                messsage = message.replace($sanitize(data_obj.payload), wrapElement(data_obj.payload, document));
            }
          }
          return $sce.trustAsHtml(message);
        };

        $scope.$on("event:editMode", function (event, data) {
          console.log(data);
          $scope.editMode = data.edit;
        });

        $scope.deleteWidget = function () {
          $scope.$root.removeDashboardItem($scope.id);
        };
      }
    };
  }]);

  function wrapElement(text, sentiment) {
    if (sentiment.document) {
      var temp = sentiment.document;
      sentiment = temp;
    }

    if (!sentiment || !sentiment.score) {
      return text;
    }
    var score = Number(sentiment.score);
    if (score) {
      if (score > 0) {
        return '<span style="background-color: rgba(0, 255, 0, ' + score * 0.7 + ')">' + text + '</span>';
      } else if (score < 0) {
        return '<span style="background-color: rgba(255, 0, 0, ' + score * 0.7 + ')">' + text + '</span>';
      } else {
        return text;
      }
    }
  }
})();
