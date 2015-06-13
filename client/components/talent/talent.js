// ---------------------------------------------------------------------------------------------------------------------
// TalentDisplay
//
// @module talent.js
// ---------------------------------------------------------------------------------------------------------------------

function TalentDisplayFactory(_, $modal)
{
    function TalentDisplayController($scope)
    {
        $scope.collapse = true;

        $scope.edit = function(talent)
        {
            $modal.open({
                    templateUrl: '/systems/eote/components/talent/modals/editTalent.html',
                    keyboard: false,
                    scope: $scope,
                    controller: 'EditTalentModal',
                    resolve: {
                        talent: function()
                        {
                            return talent;
                        }
                    }
                })
                .result
                .then(function(modTalent)
                {
                    _.apply(talent, modTalent);
                    $scope.char.save();
                });
        }; // end edit

        $scope.remove = function(index)
        {
            $scope.talents.splice(index, 1);
            $scope.char.save();
        }; // end remove
    } // end TalentDisplayController

    return {
        restrict: 'E',
        scope: {
            talents: "=",
            char: "="
        },
        templateUrl: "/systems/eote/components/talent/talent.html",
        controller: ['$scope', TalentDisplayController]
    };
} // end TalentDisplayFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').directive('talentList', [
    'lodash',
    '$modal',
    TalentDisplayFactory
]);

// ---------------------------------------------------------------------------------------------------------------------