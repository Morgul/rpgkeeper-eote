// ---------------------------------------------------------------------------------------------------------------------
// CharacterModel
//
// @module characterModel.js
// ---------------------------------------------------------------------------------------------------------------------

function CharacterModelFactory($http, Promise, baseSvc)
{
    function CharacterModel(id)
    {
        this.id = id;
        this.baseChar = baseSvc.current;
        this.char = {};

        this._url = '/systems/eote/characters/' + this.id;

        // load the character
        this.loaded = this._loadChar();
    } // end CharacterModel

    CharacterModel.prototype = {

        // Base Char
        get name(){ return this.baseChar.name; },
        set name(val){ this.baseChar.name = val; },
        get portrait(){ return this.baseChar.portrait; },
        set portrait(val){ this.baseChar.portrait = val; },
        get thumbnail(){ return this.baseChar.thumbnail; },
        set thumbnail(val){ this.baseChar.thumbnail = val; },
        get biography(){ return this.baseChar.biography; },
        set biography(val){ this.baseChar.biography = val; },
        get description(){ return this.baseChar.description; },
        set description(val){ this.baseChar.description = val; },

        // EotE Char
        get gender(){ return this.char.gender; },
        set gender(val){ this.char.gender = val; },
        get species(){ return this.char.species; },
        set species(val){ this.char.species = val; },
        get age(){ return this.char.age; },
        set age(val){ this.char.age = val; },
        get height(){ return this.char.height; },
        set height(val){ this.char.height = val; },
        get skills(){ return this.char.skills; },
        set skills(val){ this.char.skills = val; },
        get abilities(){ return this.char.abilities; },
        set abilities(val){ this.char.abilities = val; },
        get talents(){ return this.char.talents; },
        set talents(val){ this.char.talents = val; },
        get soak(){ return this.char.soak; },
        set soak(val){ this.char.soak = val; },
        get meleeDefense(){ return this.char.meleeDefense; },
        set meleeDefense(val){ this.char.meleeDefense = val; },
        get rangedDefense(){ return this.char.rangedDefense; },
        set rangedDefense(val){ this.char.rangedDefense = val; },
        get forceRank(){ return this.char.forceRank; },
        set forceRank(val){ this.char.forceRank = val; },
        get forcePool(){ return this.char.forcePool; },
        set forcePool(val){ this.char.forcePool = val; },
        get forceCommitted(){ return this.char.forceCommitted; },
        set forceCommitted(val){ this.char.forceCommitted = val; },
        get forcePowers(){ return this.char.forcePowers; },
        set forcePowers(val){ this.char.forcePowers = val; },
        get wounds(){ return this.char.wounds; },
        set wounds(val){ this.char.wounds = val; },
        get woundThreshold(){ return this.char.woundThreshold; },
        set woundThreshold(val){ this.char.woundThreshold = val; },
        get strains(){ return this.char.strains; },
        set strains(val){ this.char.strains = val; },
        get strainThreshold(){ return this.char.strainThreshold; },
        set strainThreshold(val){ this.char.strainThreshold = val; },
        get equipment(){ return this.char.equipment; },
        set equipment(val){ this.char.equipment = val; },
        get notes(){ return this.char.notes; },
        set notes(val){ this.char.notes = val; },
        get quickNotes(){ return this.char.quickNotes; },
        set quickNotes(val){ this.char.quickNotes = val; },
        get totalXP(){ return this.char.totalXP; },
        set totalXP(val){ this.char.totalXP = val; },
        get availableXP(){ return this.char.availableXP; },
        set availableXP(val){ this.char.availableXP = val; },

        // Read Only
        get characteristics()
        {
            if(!this.char.characteristics)
            {
                return {
                    brawn: 0,
                    agility: 0,
                    intellect: 0,
                    cunning: 0,
                    willpower: 0,
                    presence: 0
                }
            } // end if

            return {
                brawn: _.find(this.char.characteristics, {name: "Brawn"}),
                agility: _.find(this.char.characteristics, {name: "Agility"}),
                intellect: _.find(this.char.characteristics, {name: "Intellect"}),
                cunning: _.find(this.char.characteristics, {name: "Cunning"}),
                willpower: _.find(this.char.characteristics, {name: "Willpower"}),
                presence: _.find(this.char.characteristics, {name: "Presence"})
            }
        },

        // Calculated
        get encumbranceThreshold(){ return this.characteristics.brawn.ranks + 5; }
    }; // end prototype

    // -----------------------------------------------------------------------------------------------------------------
    // Internal Functions
    // -----------------------------------------------------------------------------------------------------------------

    CharacterModel.prototype._loadChar = function()
    {
        var self = this;
        return this.baseChar.promise
            .then(function()
            {
                return $http.get(self._url)
                    .success(function(char)
                    {
                        self.char = char;

                        console.log('char:', char);

                        var promises = [];

                        //----------------------------------------------------------------------------------------------
                        // Populate Talents
                        //----------------------------------------------------------------------------------------------

                        _.each(char.talents, function(talent)
                        {
                            promises.push($http.get('/systems/eote/talents/' + talent.name)
                                .success(function(talentDesc)
                                {
                                    talent.description = talentDesc;
                                }));
                        });

                        //----------------------------------------------------------------------------------------------
                        // Populate Force Powers
                        //----------------------------------------------------------------------------------------------

                        _.each(char.forcePowers, function(forcePower)
                        {
                            promises.push($http.get('/systems/eote/force-powers/' + forcePower.name)
                                .success(function(forcePowerDesc)
                                {
                                    forcePower.base = forcePowerDesc;
                                }));
                        });

                        //----------------------------------------------------------------------------------------------

                        return Promise.all(promises);
                    });
            });
    }; // end _loadChar



    // -----------------------------------------------------------------------------------------------------------------
    // External Functions
    // -----------------------------------------------------------------------------------------------------------------

    CharacterModel.prototype.refresh = function()
    {
        return this._loadChar();
    }; // end refresh

    CharacterModel.prototype.save = _.debounce(function()
    {
        var self = this;
        $http.put(this._url, this.char)
            .success(function()
            {
                self.baseChar.save();
            });
    }, 1000);

    // -----------------------------------------------------------------------------------------------------------------

    return function(id){ return new CharacterModel(id); }
} // end CharacterModelFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.components').factory('CharacterModel', [
    '$http',
    '$q',
    'BaseCharacterService',
    CharacterModelFactory
]);

// ---------------------------------------------------------------------------------------------------------------------