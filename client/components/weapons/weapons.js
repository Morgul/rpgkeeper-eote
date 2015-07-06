// ---------------------------------------------------------------------------------------------------------------------
// WeaponList
//
// @module weapons.js
// ---------------------------------------------------------------------------------------------------------------------

function WeaponListFactory(_, $modal)
{
    function WeaponListController($scope)
    {
        $scope.collapse = true;

        $scope.edit = function(weapon)
        {
            $modal.open({
                    templateUrl: '/systems/eote/components/weapons/modals/editWeapon.html',
                    keyboard: false,
                    scope: $scope,
                    size: 'lg',
                    controller: 'EditWeaponModal',
                    resolve: {
                        weapon: function()
                        {
                            return weapon;
                        }
                    }
                })
                .result
                .then(function(modWeapon)
                {
                    _.apply(weapon, modWeapon);
                    $scope.char.save();
                });
        }; // end edit

        $scope.remove = function(index)
        {
            $scope.char.weapons.splice(index, 1);
            $scope.char.save();
        }; // end remove
    } // end WeaponListController

    return {
        restrict: 'E',
        scope: {
            char: "="
        },
        templateUrl: "/systems/eote/components/weapons/weapons.html",
        controller: ['$scope', WeaponListController]
    };
} // end WeaponListFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').directive('weaponList', [
    'lodash',
    '$modal',
    WeaponListFactory
]);

// ---------------------------------------------------------------------------------------------------------------------