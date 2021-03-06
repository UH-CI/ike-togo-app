angular.module('AgaveToGo').controller('SystemDirectoryController', function ($injector, $rootScope, $scope, $state, $stateParams, $q, $translate, SystemsController, RolesService, ActionsService, MessageService) {

    $scope.offset = $scope.offset || 0;
    $scope.limit = $scope.limit || 50;
    $scope.systems = [];
    $scope.modalResource = '';

    $scope._COLLECTION_NAME = 'systems';
    $scope._RESOURCE_NAME = 'system';

    $scope.sortType = 'id';
    $scope.sortReverse  = false;
    $scope.filter = '';
    $scope.query = 'filter=id,name,type,status,description,default,public,uuid';

    $scope.refresh = function() {
        $scope.requesting = true;

        SystemsController.searchSystems($scope.query).then(
            function (response) {
              $scope[$scope._COLLECTION_NAME] = [];
              _.each(response.result, function(system){
                if ($scope.query.indexOf("available.eq=false") === -1){
                  system.available = true;
                  $scope[$scope._COLLECTION_NAME].push(system);
                } else {
                  $scope[$scope._COLLECTION_NAME].push(system);
                }
              });
              $scope.requesting = false;
            },
            function(response){
              MessageService.handle(response, $translate.instant('error_systems_search'));
            }
        );
    };

    $scope.searchTools = function(query){
      $scope.query = 'filter=id,name,type,status,description,default,public,uuid&';
      $scope.query += query;
      $scope.refresh();
    }


    $scope.editRoles = function(system) {
        RolesService.editRoles(system);
    };

    $scope.confirmAction = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
        ActionsService.confirmAction(resourceType, resource, resourceAction, resourceList, resourceIndex);
    }

    $scope.clone = function(resourceType, resource, resourceAction, resourceList, resourceIndex){
        ActionsService.clone(resourceType, resource, resourceAction, resourceList, resourceIndex);
    }

    $scope.getNotifications = function(resourceType, resource){
      ActionsService.getNotifications(resourceType, resource);
    };

    $scope.getMonitor = function(resource){
      $state.go('monitors-manager', {'systemId': resource.id});
    };

    $scope.refresh();

});
