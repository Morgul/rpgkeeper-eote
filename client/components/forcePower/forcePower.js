// ---------------------------------------------------------------------------------------------------------------------
// TalentDisplay
//
// @module forcePower.js
// ---------------------------------------------------------------------------------------------------------------------

function TalentDisplayFactory(_, $modal)
{
    function TalentDisplayController($scope)
    {
        $scope.collapse = true;

        $scope.edit = function(forcePower)
        {
            $modal.open({
                    templateUrl: '/systems/eote/components/forcePower/modals/editTalent.html',
                    keyboard: false,
                    scope: $scope,
                    controller: 'EditTalentModal',
                    resolve: {
                        forcePower: function()
                        {
                            return forcePower;
                        }
                    }
                })
                .result
                .then(function(modTalent)
                {
                    _.apply(forcePower, modTalent);
                    $scope.char.save();
                });
        }; // end edit

        $scope.remove = function(index)
        {
            $scope.char.forcePowers.splice(index, 1);
            $scope.char.save();
        }; // end remove
    } // end TalentDisplayController

    return {
        restrict: 'E',
        scope: {
            char: "="
        },
        templateUrl: "/systems/eote/components/forcePower/forcePower.html",
        controller: ['$scope', TalentDisplayController]
    };
} // end TalentDisplayFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').directive('forcePowerList', [
    'lodash',
    '$modal',
    TalentDisplayFactory
]);

// ---------------------------------------------------------------------------------------------------------------------