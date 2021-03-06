//----------------------------------------------------------------------------------------------------------------------
// Routes for talents
//
// @module talents.js
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
    queryModel.search(models.Talent, req.query)
        .then(function(results)
        {
            resp.json(results);
        });
});

router.get('/*', function(req, resp)
{
    models.Talent.get(req.params[0])
        .then(function(talent)
        {
            resp.json(talent);
        })
        .catch(models.errors.DocumentNotFound, function(error)
        {
            resp.status(404).json({
                human: "Talent not found.",
                message: error.message,
                stack: error.stack
            });
        });
});

router.put('/*', function(req, resp)
{
    if(req.isAuthenticated())
    {
        models.Talent.get(req.params[0])
            .then(function(talent)
            {
                _.assign(talent, req.body);
                talent.save()
                    .then(function()
                    {
                        resp.json(talent);
                    });
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                new models.Talent(req.body).save()
                    .then(function()
                    {
                        resp.end();
                    })
                    .catch(function(error)
                    {
                        resp.status(500).json({
                            human: "Cannot save talent.",
                            message: error.message,
                            stack: error.stack
                        });
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save talent.",
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
        models.Talent.get(req.params[0])
            .then(function(talent)
            {
                talent.remove()
                    .then(function()
                    {
                        resp.end();
                    });
            })
            .catch(function(error)
            {
                resp.status(500).json({
                    human: "Cannot save talent.",
                    message: error.message,
                    stack: error.stack
                });
            })
            .catch(models.errors.DocumentNotFound, function(error)
            {
                resp.status(404).json({
                    human: "Talent not found.",
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
