// ---------------------------------------------------------------------------------------------------------------------
// AddForcePowerModal
//
// @module addForcePower
// ---------------------------------------------------------------------------------------------------------------------

function AddForcePowerModal($scope, $http, _)
{
    var selectedPower = undefined;

    $scope.forcePower = {};
    $scope.disabled = false;

    // -----------------------------------------------------------------------------------------------------------------
    // Watches
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$watch('forcePower.name', function()
    {
        if(selectedPower && $scope.forcePower.name != selectedPower.name)
        {
            $scope.disabled = false;
            $scope.forcePower = { name: $scope.forcePower.name };
        } // end if
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.selectForcePower = function(forcePower)
    {
        $scope.disabled = true;
        $scope.forcePower.name = forcePower.name;
        $scope.forcePower.description = forcePower.description;
        $scope.forcePower.upgrades = forcePower.upgrades;
        selectedPower = { name: forcePower.name };
    }; // end selectForcePowers

    $scope.searchForcePowers = function(query)
    {
        return $http.get('/systems/eote/force-powers', { params: { name: '@>' + query } })
            .then(function(response)
            {
                return _.filter(response.data, function(forcePower)
                {
                    return !_.find($scope.char.forcePowers, { name: forcePower.name });
                });
            });
    }; // end searchForcePowers

    $scope.save = function(forcePower)
    {
        if(!$scope.disabled)
        {
            $http.put('/systems/eote/force-powers/' + forcePower.name, forcePower);
        } // end if

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