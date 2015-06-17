// ---------------------------------------------------------------------------------------------------------------------
// MainController
//
// @module main.js
// ---------------------------------------------------------------------------------------------------------------------

function MainController($scope, $routeParams, $modal, charSvc)
{
    $scope.nav = 'character';
    $scope.notfound = false;

    // Get the current character
    $scope.char = charSvc.get($routeParams.charID);

    $scope.char.loaded
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
                        return {
                            name: charSvc.current.name,
                            gender: charSvc.current.gender,
                            species: charSvc.current.species,
                            age: charSvc.current.age,
                            height: charSvc.current.height
                        };
                    }
                }
            })
            .result
            .then(function(char)
            {
                charSvc.current.name = char.name;
                charSvc.current.gender = char.gender;
                charSvc.current.species = char.species;
                charSvc.current.age = char.age;
                charSvc.current.height = char.height;
                charSvc.current.save();
            });
    }; // end editBio
} // end MainController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.controllers').controller('MainCtrl', [
    '$scope',
    '$routeParams',
    '$modal',
    'CharacterService',
    MainController
]);

// ---------------------------------------------------------------------------------------------------------------------