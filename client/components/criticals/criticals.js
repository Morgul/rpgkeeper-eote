// ---------------------------------------------------------------------------------------------------------------------
// CriticalTracker
//
// @module criticals
// ---------------------------------------------------------------------------------------------------------------------

function CriticalTrackerFactory(_, criticals)
{
    function CriticalTrackerController($scope)
    {
        $scope.criticals = criticals;
        $scope.selectedCrit = criticals[0];

        // -------------------------------------------------------------------------------------------------------------
        // Formatting
        // -------------------------------------------------------------------------------------------------------------

        $scope.getRange = function(critName)
        {
            var critical = $scope.getCrit(critName);
            return _.range(critical.severity);
        }; // end getRange

        $scope.getCrit = function(critName)
        {
            return _.find(criticals, { title: critName });
        }; // end getCrit

        $scope.formatCrit = function(critical)
        {
            var minRange = _.padLeft(critical.range[0], 3, '0');
            var maxRange = critical.range[1] != Infinity ? ' - ' + _.padLeft(critical.range[1], 3, '0') : '+';
            return minRange + maxRange + ': ' + critical.title;
        }; // end formatCrit

        // -------------------------------------------------------------------------------------------------------------
        // Functions
        // -------------------------------------------------------------------------------------------------------------

        $scope.selectCrit = function(critical)
        {
            $scope.selectedCrit = critical;
        }; // end selectedCrit

        $scope.add = function()
        {
            if($scope.selectedCrit)
            {
                console.log('crits:', $scope.char);

                //$scope.char.criticals = $scope.char.criticals || [];
                $scope.char.criticals.push($scope.selectedCrit.title);


                $scope.char.save();
            } // end if
        }; // end add

        $scope.remove = function(index)
        {
            $scope.char.criticals.splice(index, 1);
            $scope.char.save();
        }; // end remove

        // -------------------------------------------------------------------------------------------------------------
    } // end CriticalTrackerController

    return {
        restrict: 'E',
        scope: {
            char: "="
        },
        templateUrl: "/systems/eote/components/criticals/criticals.html",
        controller: ['$scope', CriticalTrackerController]
    };
} // end CriticalTrackerFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').directive('criticalTracker', [
    'lodash',
    'CriticalsList',
    CriticalTrackerFactory
]);

// ---------------------------------------------------------------------------------------------------------------------