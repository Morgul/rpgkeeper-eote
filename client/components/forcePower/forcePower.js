// ---------------------------------------------------------------------------------------------------------------------
// ForcePowerList
//
// @module forcePower.js
// ---------------------------------------------------------------------------------------------------------------------

function ForcePowerListFactory(_, $modal)
{
    function ForcePowerListController($scope)
    {
        $scope.collapse = true;

        $scope.edit = function(forcePower)
        {
            $modal.open({
                    templateUrl: '/systems/eote/components/forcePower/modals/editForcePower.html',
                    keyboard: false,
                    scope: $scope,
                    size: 'lg',
                    controller: 'EditForcePowerModal',
                    resolve: {
                        forcePower: function()
                        {
                            return forcePower;
                        }
                    }
                })
                .result
                .then(function(modForcePower)
                {
                    //modForcePower = _.omit(modForcePower, 'base');
                    _.apply(forcePower, modForcePower);
                    $scope.char.save();
                });
        }; // end edit

        $scope.remove = function(index)
        {
            $scope.char.forcePowers.splice(index, 1);
            $scope.char.save();
        }; // end remove
    } // end ForcePowerListController

    return {
        restrict: 'E',
        scope: {
            char: "="
        },
        templateUrl: "/systems/eote/components/forcePower/forcePower.html",
        controller: ['$scope', ForcePowerListController]
    };
} // end ForcePowerListFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').directive('forcePowerList', [
    'lodash',
    '$modal',
    ForcePowerListFactory
]);

// ---------------------------------------------------------------------------------------------------------------------