// ---------------------------------------------------------------------------------------------------------------------
// BaseCharacterService
//
// @module characterService.js
// ---------------------------------------------------------------------------------------------------------------------

function CharacterServiceFactory($routeParams, CharModel)
{
    function CharacterService()
    {
        this._current = undefined;
    } // end CharacterService

    CharacterService.prototype = {
        get current()
        {
            if($routeParams.charID)
            {
                return this._current || this.get($routeParams.charID, true);
            } // end if
        }
    }; // end prototype

    CharacterService.prototype.get = function(charID, skipRefresh)
    {
        this._current = CharModel(charID);

        if(!skipRefresh)
        {
            // Get the latest version of the character
            this._current.refresh();
        } // end if

        return this._current;
    }; // end get

    return new CharacterService();
} // end CharacterServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').service('CharacterService', [
    '$routeParams',
    'CharacterModel',
    CharacterServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------