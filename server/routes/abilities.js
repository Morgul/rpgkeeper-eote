//----------------------------------------------------------------------------------------------------------------------
// Routes for Abilities
//
// @module abilities.js
//----------------------------------------------------------------------------------------------------------------------

var _ = require('lodash');
var express = require('express');

var routeUtils = require('./utils');
var queryModel = require('./querymodel');
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

router.get('/', function(req, resp)
{
    queryModel.search(models.Ability, req.query)
        .then(function(results)
        {
            resp.json(results);
        });
});

router.get('/*', function(req, resp)
{
    models.Ability.get(req.params[0])
        .then(function(ability)
        {
            resp.json(ability);
        })
        .catch(models.errors.DocumentNotFound, function(error)
        {
            resp.status(404).json({
                human: "Ability not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.put('/*', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.Ability.get(req.params[0])
            .then(function(ability)
            {
                _.assign(ability, req.body);
                ability.save()
                    .then(function()
                    {
                        resp.json(ability);
                    });
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                new models.Ability(req.body).save()
                    .then(function()
                    {
                        resp.end();
                    })
                    .catch(function(error)
                    {
                        resp.status(500).json({
                            human: "Cannot save ability.",
                            message: error.message,
                            stack: error.stack
                        });
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save ability.",
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

router.delete('/*', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.Ability.get(req.params[0])
            .then(function(ability)
            {
                ability.remove()
                    .then(function()
                    {
                        resp.end();
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save ability.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                resp.status(404).json({
                    human: "Ability not found.",
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
