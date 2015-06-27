//----------------------------------------------------------------------------------------------------------------------
// Routes for system operations
//
// @module characters.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var models = require('../models');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();

//----------------------------------------------------------------------------------------------------------------------
// Middleware
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

//----------------------------------------------------------------------------------------------------------------------
// REST Endpoints
//----------------------------------------------------------------------------------------------------------------------

router.get('/:charID', function(req, resp)
{
    models.Character.get(req.params.charID)
        .then(function(character)
        {
            resp.json(character);
        })
        .catch(models.errors.DocumentNotFound, function(error)
        {
            resp.status(404).json({
                human: "Character not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.put('/:charID', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.Character.get(req.params.charID)
            .catch(models.errors.DocumentNotFound, function()
            {
                // Build a new Character model
                return new models.Character({ baseChar: req.params.charID });
            })
            .then(function(character)
            {
                _.assign(character, req.body);

                // Clean talents
                character.talents = _.map(character.talents, function(talent)
                {
                    return _.omit(talent, 'description');
                });

                // Clean force powers
                character.forcePowers = _.map(character.forcePowers, function(forcePower)
                {
                    return _.omit(forcePower, 'base');
                });

                return character.save()
                    .then(function()
                    {
                        //FIXME: If we return the character, angular replaces the object, instead of updating, which
                        // causes bound inputs to lose focus. Weird, huh?
                        //resp.json(character);

                        resp.end();
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save character.",
                    message: error.message,
                    stack: error.stack
                });
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});

router.delete('/:charID', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.Character.get(req.params.charID)
            .then(function(char)
            {
                return char.remove();
            })
            .then(function()
            {
                resp.end();
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot delete character.",
                    message: error.message,
                    stack: error.stack
                });
            });
    }
    else
    {
        resp.status(403).end();
    } // end if
});


//----------------------------------------------------------------------------------------------------------------------

module.exports = router;

//----------------------------------------------------------------------------------------------------------------------