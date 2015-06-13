// ---------------------------------------------------------------------------------------------------------------------
// AbilityService
//
// @module abilityService.js
// ---------------------------------------------------------------------------------------------------------------------

function AbilityServiceFactory($http)
{
    function AbilityService()
    {
        var self = this;
        this.abilities = [];
        this.loaded = $http.get('/systems/eote/abilities')
            .success(function(abilities)
            {
                self.abilities = abilities;
            });
    } // end AbilityService

    AbilityService.prototype.find = function(name)
    {
        return _.find(this.abilities, { name: name });
    }; // end find

    return new AbilityService();
} // end AbilityServiceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').service('AbilityService', [
    '$http',
    AbilityServiceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------