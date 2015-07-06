// ---------------------------------------------------------------------------------------------------------------------
// AddTalentModal
//
// @module addTalent.js
// ---------------------------------------------------------------------------------------------------------------------

function AddTalentModal($scope, $http, _)
{
    $scope.talent = {};
    $scope.disabled = false;

    $scope.activationTypes = [
        'Passive',
        'Active (Incidental)',
        'Active (Incidental - Out of turn)',
        'Active (Maneuver)',
        'Active (Action)'
    ];

    $scope.$watch('talent.name', function()
    {
        if($scope.talent.description && $scope.talent.name != $scope.talent.description.name)
        {
            $scope.talent.description = undefined;
            $scope.disabled = false;
            $scope.talent = { name: $scope.talent.name };
        } // end if
    });

    $scope.selectTalent = function(talent)
    {
        $scope.disabled = true;
        $scope.talent.name = talent.name;
        $scope.talent.description = angular.copy(talent);
    }; // end selectTalents

    $scope.searchTalents = function(query)
    {
        return $http.get('/systems/eote/talents', { params: { name: '@>' + query } })
            .then(function(response)
            {
                return _.filter(response.data, function(talent)
                {
                    return !_.find($scope.char.talents, { name: talent.name });
                });
            });
    }; // end searchTalents

    $scope.save = function(talent)
    {
        if(!$scope.disabled)
        {
            var talentDesc = { name: talent.name };
            _.assign(talentDesc, talent.description);

            $http.put('/systems/eote/talents/' + talent.name, talentDesc);
        } // end if

        $scope.$close(talent);
    }; // end save
} // end AddTalentModal

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').controller('AddTalentModal', [
    '$scope',
    '$http',
    'lodash',
    AddTalentModal
]);

// ---------------------------------------------------------------------------------------------------------------------