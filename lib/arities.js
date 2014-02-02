'use strict';

var pursuit = require('pursuit');

var isArray = pursuit({ typeOf: 'array' });
var isValidPattern = pursuit({
    test: [{ typeOf: 'object' }, { typeOf: 'function' }],
    fn: [{typeOf: 'string'}, {typeOf: 'function'}]
});

function match (patterns) {
    if (! isArray(patterns)) {
        throw new Error('Expected an array');
    }

    if (! patterns.every(isValidPattern)) {
        throw new Error('Every pattern should have a test and a function');
    }

    patterns.map(function (item) {
        if (typeof item.test !== 'function') {
            item.test = pursuit(item.test);
        }
        return item;
    });

    return function () {
        for (var i = 0; i < patterns.length; i += 1) {
            if (! patterns[i].test(arguments)) {
                continue;
            }
            var type = typeof patterns[i].fn;
            if (type === 'string') {
                return this[patterns[i].fn].apply(this, arguments);
            }
            else if (type === 'function') {
                return patterns[i].fn.apply(this, arguments);
            }
        }
        return null;
    };
}

module.exports = match;
