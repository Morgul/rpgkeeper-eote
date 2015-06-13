// ---------------------------------------------------------------------------------------------------------------------
// Notes widget.
//
// @module notes.js
// ---------------------------------------------------------------------------------------------------------------------

function NotesController($scope, $timeout, _, charSvc)
{
    $scope.editing = false;
    $scope.newPageInst = {};

    $scope.editor = {
        refresh: false,
        options: {
            lineWrapping : true,
            mode: 'gfm'
        }
    };

    // Set the first page as active on load.
    $scope.char.loaded
        .then(function()
        {
            ($scope.char.notes[0] || {}).active = true;
        });

    //--------------------------------------------------------------------------------------------------------------
    // Functions
    //--------------------------------------------------------------------------------------------------------------

    $scope.refreshCodeMirror = function()
    {
        $timeout(function()
        {
            $scope.editor.refresh = !$scope.editor.refresh;
        }, 250);
    }; // end refreshCodemirror

    $scope.initTab = function(index, page)
    {
        // Reset our state flags
        $scope.isNew = false;
        $scope.editing = false;

        $scope.editPage = angular.copy(page);
    };

    $scope.newPage = function()
    {
        $scope.isNew = true;
        $scope.edit();
    }; // end newPage

    $scope.isFavorite = function()
    {
        return (_.find($scope.char.notes, { active: true }) || {}).favorite;
    }; // end isFavorite

    $scope.favorite = function()
    {
        var pageIdx = _.findIndex($scope.char.notes, { active: true });
        var page = $scope.char.notes[pageIdx];
        if(page)
        {
            page.favorite = !page.favorite;
            $scope.char.save()
                .then(function()
                {
                    // Reset the active page.
                    $scope.char.notes[pageIdx].active = true;
                });
        } // end page
    }; // end favorite

    $scope.edit = function()
    {
        $scope.editing = true;
        $scope.refreshCodeMirror();
    }; // end edit

    $scope.save = function()
    {
        $scope.editing = false;

        if($scope.isNew)
        {
            $scope.char.notes.push($scope.newPageInst);
            $scope.newPageInst = {};

            // Save to character
            $scope.char.save()
                .then(function()
                {
                    // Reset the active page.
                    $scope.char.notes[$scope.char.notes.length - 1].active = true;
                });
        }
        else
        {
            // Copy editPage to page
            var pageIdx = _.findIndex($scope.char.notes, { active: true });
            _.assign($scope.char.notes[pageIdx], _.pick($scope.editPage, ['name', 'content']));
            $scope.char.save()
                .then(function()
                {
                    // Reset the active page.
                    $scope.char.notes[pageIdx].active = true;
                });
        } // end if
    }; // end save

    $scope.cancel = function()
    {
        $scope.editing = false;
    }; // end save

    $scope.delete = function(index, event)
    {
        event.preventDefault();
        event.stopPropagation();

        $scope.char.notes.splice(index, 1);
        $scope.char.save();

        // Reset the active page.
        $scope.char.notes[index - 1].active = true;
    }; // end delete

    //--------------------------------------------------------------------------------------------------------------
} // end NotesController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('rpgkeeper.controllers').controller('EotENotesController', [
    '$scope',
    '$timeout',
    'lodash',
    'CharacterService',
    NotesController
]);

// ---------------------------------------------------------------------------------------------------------------------