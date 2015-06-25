// ---------------------------------------------------------------------------------------------------------------------
// AddForcePowerModal
//
// @module addForcePower
// ---------------------------------------------------------------------------------------------------------------------

function AddForcePowerModal($scope, $http, _)
{
    $scope.save = function(forcePower)
    {
        $scope.$close(forcePower);
    }; // end save
} // end AddForcePowerModal

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').controller('AddForcePowerModal', [
    '$scope',
    '$http',
    'lodash',
    AddForcePowerModal
]);

// ---------------------------------------------------------------------------------------------------------------------