// ---------------------------------------------------------------------------------------------------------------------
// EditForcePowerModal
//
// @module editForcePower
// ---------------------------------------------------------------------------------------------------------------------

function EditForcePowerModal($scope, $http, _)
{
    $scope.save = function(forcePower)
    {
        $scope.$close(forcePower);
    }; // end save
} // end EditForcePowerModal

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').controller('EditForcePowerModal', [
    '$scope',
    '$http',
    'lodash',
    EditForcePowerModal
]);

// ---------------------------------------------------------------------------------------------------------------------