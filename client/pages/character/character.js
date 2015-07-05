// ---------------------------------------------------------------------------------------------------------------------
// CharacterCtrl
//
// @module character.js
// ---------------------------------------------------------------------------------------------------------------------

function CharacterCtrl($scope, $anchorScroll, $modal, charSvc, diceSvc, abilitySvc)
{
    Object.defineProperties($scope, {
        abilities: {
            get: function(){ return abilitySvc.abilities; }
        },
        char: {
            get: function(){ return charSvc.current; }
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Stats
    //------------------------------------------------------------------------------------------------------------------

    $scope.editDefenses = function()
    {
        $modal.open({
                templateUrl: '/systems/eote/pages/character/modals/editDefenses.html',
                keyboard: false,
                controller: 'EditDefensesModal',
                resolve: {
                    defenses: function()
                    {
                        return {
                            soak: charSvc.current.soak,
                            meleeDefense: charSvc.current.meleeDefense,
                            rangedDefense: charSvc.current.rangedDefense
                        };
                    }
                }
            })
            .result
            .then(function(defenses)
            {
                charSvc.current.soak = defenses.soak;
                charSvc.current.meleeDefense = defenses.meleeDefense;
                charSvc.current.rangedDefense = defenses.rangedDefense;
                charSvc.current.save();
            });
    }; // end editDefenses

    $scope.editForce = function()
    {
        $modal.open({
                templateUrl: '/systems/eote/pages/character/modals/editForce.html',
                keyboard: false,
                controller: 'EditForceModal',
                resolve: {
                    force: function()
                    {
                        return {
                            rank: charSvc.current.forceRank,
                            pool: charSvc.current.forcePool,
                            committed: charSvc.current.forceCommitted
                        };
                    }
                }
            })
            .result
            .then(function(force)
            {
                charSvc.current.forceRank = force.rank;
                charSvc.current.forcePool = force.pool;
                charSvc.current.forceCommitted = force.committed;
                charSvc.current.save();
            });
    }; // end editForce

    $scope.editExperience = function()
    {
        $modal.open({
                templateUrl: '/systems/eote/pages/character/modals/editExperience.html',
                keyboard: false,
                controller: 'EditExperienceModal',
                resolve: {
                    experience: function()
                    {
                        return {
                            total: charSvc.current.totalXP,
                            available: charSvc.current.availableXP
                        };
                    }
                }
            })
            .result
            .then(function(experience)
            {
                charSvc.current.totalXP = experience.total;
                charSvc.current.availableXP = experience.available;
                charSvc.current.save();
            });
    }; // end editExperience

    //------------------------------------------------------------------------------------------------------------------
    // Abilities
    //------------------------------------------------------------------------------------------------------------------

    $scope.addAbility = function()
    {
        $modal.open({
                templateUrl: '/systems/eote/pages/character/modals/addAbility.html',
                keyboard: false,
                controller: 'AddAbilityModal'
            })
            .result
            .then(function(ability)
            {
                charSvc.current.abilities.push(ability.name);
                charSvc.current.save();
            });
    }; // end addAbility

    //------------------------------------------------------------------------------------------------------------------
    // Talents
    //------------------------------------------------------------------------------------------------------------------

    $scope.addTalent = function()
    {
        $modal.open({
            templateUrl: '/systems/eote/pages/character/modals/addTalent.html',
            keyboard: false,
            scope: $scope,
            controller: 'AddTalentModal'
        })
            .result
            .then(function(talent)
            {
                charSvc.current.talents.push(talent);
                charSvc.current.save();
            });
    }; // end addTalent

    //------------------------------------------------------------------------------------------------------------------
    // ForcePowers
    //------------------------------------------------------------------------------------------------------------------

    $scope.addForcePower = function()
    {
        $modal.open({
                templateUrl: '/systems/eote/pages/character/modals/addForcePower.html',
                keyboard: false,
                scope: $scope,
                controller: 'AddForcePowerModal'
            })
            .result
            .then(function(forcePower)
            {
                charSvc.current.forcePowers.push({
                    name: forcePower.name,
                    base: forcePower
                });
                charSvc.current.save();
            });
    }; // end addForcePower

    //------------------------------------------------------------------------------------------------------------------
    // Characteristics
    //------------------------------------------------------------------------------------------------------------------

    $scope.editChars = function()
    {
        $modal.open({
                templateUrl: '/systems/eote/pages/character/modals/editCharacteristics.html',
                keyboard: false,
                controller: 'EditCharacteristicsModal',
                resolve: {
                    characteristics: function()
                    {
                        return {
                            brawn: charSvc.current.characteristics.brawn.ranks,
                            agility: charSvc.current.characteristics.agility.ranks,
                            intellect: charSvc.current.characteristics.intellect.ranks,
                            cunning: charSvc.current.characteristics.cunning.ranks,
                            willpower: charSvc.current.characteristics.willpower.ranks,
                            presence: charSvc.current.characteristics.presence.ranks
                        }
                    }
                }
            })
            .result
            .then(function(characteristics)
            {
                charSvc.current.characteristics.brawn.ranks = characteristics.brawn;
                charSvc.current.characteristics.agility.ranks = characteristics.agility;
                charSvc.current.characteristics.intellect.ranks = characteristics.intellect;
                charSvc.current.characteristics.cunning.ranks = characteristics.cunning;
                charSvc.current.characteristics.willpower.ranks = characteristics.willpower;
                charSvc.current.characteristics.presence.ranks = characteristics.presence;

                charSvc.current.save();
            });
    }; // end editChars

    //------------------------------------------------------------------------------------------------------------------
    // Skills
    //------------------------------------------------------------------------------------------------------------------

    $scope.setSkillDice = function(skill)
    {
        // First, we find the rank of the skill, and the value of the characteristic
        var ranks = skill.ranks || 0;
        var charScore = _.find(charSvc.current.characteristics, { name: skill.characteristic }).ranks || 0;

        // Now, we calculate how many proficiency and ability dice are rolled
        var proficiency = ranks > charScore ? charScore : ranks;
        var ability = ranks > charScore ? ranks - charScore : charScore - ranks;

        diceSvc.setDice({ proficiency: proficiency, ability: ability });

        $anchorScroll('dice-roller');
    }; // end setSkillDice

    //------------------------------------------------------------------------------------------------------------------
    // Armor and Weapons
    //------------------------------------------------------------------------------------------------------------------

    $scope.editArmor = function()
    {
        $modal.open({
                templateUrl: '/systems/eote/pages/character/modals/editArmor.html',
                keyboard: false,
                controller: 'EditArmorModal',
                resolve: {
                    armor: function()
                    {
                        return _.cloneDeep(charSvc.current.armor);
                    }
                }
            })
            .result
            .then(function(armor)
            {
                console.log('armor:', armor);
                _.assign(charSvc.current.armor, armor);
                charSvc.current.save();
            });
    }; // end editArmor

    //------------------------------------------------------------------------------------------------------------------
} // end CharacterCtrl

// ---------------------------------------------------------------------------------------------------------------------

angular.module('eote.controllers').controller('CharacterCtrl', [
    '$scope',
    '$anchorScroll',
    '$modal',
    'CharacterService',
    'DiceRollerService',
    'AbilityService',
    CharacterCtrl
]);

// ---------------------------------------------------------------------------------------------------------------------