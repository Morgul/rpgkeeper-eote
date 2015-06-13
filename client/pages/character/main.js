// ---------------------------------------------------------------------------------------------------------------------
// MainController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function MainController($scope, $modal, charSvc)
{
    $scope.nav = 'character';
    $scope.notfound = false;

    charSvc.current.loaded
        .then(function()
        {
            $scope.char = charSvc.current;
        })
        .catch(function(error)
        {
            if(error.status == 404)
            {
                $scope.notfound = true;
            } // end if
        });

    $scope.editBio = function()
    {
        $modal.open({
            templateUrl: '/systems/eote/pages/character/modals/editBio.html',
            keyboard: false,
            controller: 'EditBioModal',
            resolve: {
                char: function()
                {
                    return charSvc.current;
                }
            }
        });
    }; // end editBio
} // end MainController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.controllers').controller('MainCtrl', [
    '$scope',
    '$modal',
    'CharacterService',
    MainController
]);

// ---------------------------------------------------------------------------------------------------------------------