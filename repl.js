/* global require module process */
'use strict';

var repl = require('repl'),
    arities = require('./lib/arities')
;

var local = repl.start('> ');
local.context.arities = arities;
