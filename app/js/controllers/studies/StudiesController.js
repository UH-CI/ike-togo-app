angular.module('AgaveToGo').controller('StudiesController', function ($scope, $state, $translate,$filter, MetaController, FilesController, FilesMetadataService, ActionsService, MessageService) {
    $scope._COLLECTION_NAME = 'metadata';
    $scope._RESOURCE_NAME = 'metadatum';


    $scope.queryLimit = 99999;

    $scope.offset = 0;
    $scope.limit = 10000;

    $scope.sortType = 'name';
    $scope.sortReverse  = true;
    $scope.status = 'active';
    $scope.available = true;
    $scope.query = '{name: "Study"}';

    $scope.refresh = function() {
      $scope.requesting = true;

      MetaController.listMetadata(
        $scope.query,$scope.limit,$scope.offset
      )
        .then(
          function (response) {
            $scope.totalItems = response.result.length;
            $scope.pagesTotal = Math.ceil(response.result.length / $scope.limit);
            $scope[$scope._COLLECTION_NAME] = response.result;
            $scope.studyMarkers = $filter('filter')($scope[$scope._COLLECTION_NAME], {name: "Study"});
            $scope.marks = {};
            angular.forEach($scope.studyMarkers, function(datum) {
                if(datum.value.latitude != undefined){
                $scope.marks[datum.uuid.replace(/-/g," ")] = {lat: datum.value.latitude, lng: datum.value.longitude, message: "Study Name: " + datum.value.name + "<br/>" + "Description: " + datum.value.description + "<br/>" + "Latitude: " + datum.value.latitude + "<br/>" + "Longitude: " + datum.value.longitude, draggable:false}
              }
            });
            $scope.markers = $scope.marks
            $scope.requesting = false;
          },
          function(response){
            MessageService.handle(response, $translate.instant('error_metadata_list'));
            $scope.requesting = false;
          }
      );

    };

    $scope.searchTools = function(query){
      $scope.query = query;
      $scope.refresh();
    }


    $scope.refresh();

    $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
      ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
    }

    //looking for an array of JSON association_Id objects
    $scope.download = function(associationIds_array){
      var file_urls =[];
      angular.forEach(associationIds_array, function(value, key){
        file_urls.push(value.href);
      })
      $scope.requesting = true;
      //pass array of file hrefs
      FilesMetadataService.downloadSelected(file_urls).then(function(result){
        $scope.requesting = false;
      });
    }

    angular.extend($scope, {
        hawaii: {
            lat: 21.289373,
            lng: -157.91,
            zoom: 7
        },
        events: {
          map: {
            enable: ['click', 'drag', 'blur', 'touchstart'],
            logic: 'emit'
          }
        },
        defaults: {
            scrollWheelZoom: false
        },
    });

    $scope.$on('leafletDirectiveMap.click', function(event, args){
    console.log(args.leafletEvent.latlng);
});
    /*angular.extend($scope, {
        markers: {
            honoluluMarker: {
                lat: 21.315603,
                lng: -157.858093,
                message: "I want to travel here!",
                focus: true,
                draggable: false
            }
        }
    });*/
    /*angular.extend($scope, {
        geojson: {
            data: {"type": "Feature",
                "properties": {
                    "name": "Honolulu",
                    "popupContent": "This is where the a marker!"
                },
            "geometry": {"type":"Point","coordinates":[21.315603,-157.858093]}
          },
            style: {
                fillColor: "green",
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }
        }
    });*/

});
