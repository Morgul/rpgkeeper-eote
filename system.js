//----------------------------------------------------------------------------------------------------------------------
// This is the main system module for the EotE System.
//
// @module system.js
//----------------------------------------------------------------------------------------------------------------------

var path = require('path');
var express = require('express');

var routeUtils = require('./server/routes/utils');
var charRoute = require('./server/routes/characters');
var abilityRoute = require('./server/routes/abilities');
var talentRoute = require('./server/routes/talents');
var forcePowersRoute = require('./server/routes/forcePowers');

var logger = require('omega-logger').loggerFor(module);

//----------------------------------------------------------------------------------------------------------------------

var router = express.Router();
var staticRoot = path.resolve(__dirname + '/client');

//----------------------------------------------------------------------------------------------------------------------
// System Router Setup
//----------------------------------------------------------------------------------------------------------------------

// Basic request logging
router.use(routeUtils.requestLogger(logger));

// Basic error logging
router.use(routeUtils.errorLogger(logger));

// Setup static serving
router.use(express.static(staticRoot));

// Sub routes
router.use('/characters', charRoute);
router.use('/abilities', abilityRoute);
router.use('/talents', talentRoute);
router.use('/force-powers', forcePowersRoute);

//----------------------------------------------------------------------------------------------------------------------

module.exports = {
    name: "Edge of the Empire",
    id: "eote",
    description: "A system designed for Fantasy Flight's Edge of the Empire (and associated) RPGs.",
    router: router,
    staticRoot: staticRoot,
    scripts: ["client/modules.js", "client/**/*.js"]
}; // end exports

//----------------------------------------------------------------------------------------------------------------------