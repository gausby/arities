/*jslint maxlen:140*/
/* global require process */
'use strict';

var buster = require('buster'),
    arities = require('../lib/arities')
;

var assert = buster.assert;
var refute = buster.refute;

buster.testCase('Arities', {
    'should throw an exception on non-valid input': function () {
        assert.exception(function () {arities();});
    },

    'should throw an exception if a test is missing in a pattern': function () {
        assert.exception(function () {
            arities([{fn: function() { return arguments; }}]);
        });
        assert.exception(function () {
            arities([
                { test: {}, fn: function() { return arguments; }},
                { fn: function() { return arguments; }},
                { test: {}, fn: function() { return arguments; }}
            ]);
        });
    },

    'should find the function to call based on input pattern': function () {
        var match = arities([
            {
                test: { '0': {equals: 'foo'} },
                fn: function (x, y, z) { return [x, y, z]; }
            },
            {
                test: { '0': {equals: 'baz'} },
                fn: function (x, y, z) { return [z, y, x]; }
            }
        ]);

        assert.equals(match('foo', 'bar', 'baz'), ['foo', 'bar', 'baz']);
        assert.equals(match('baz', 'foo', 'bar'), ['bar', 'foo', 'baz']);
    },

    'should work with objects': function () {
        function Test (message) {
            this.message = message;
        }

        Test.prototype.test = arities([
            { test: { 0: { equals: 'bar' }}, fn: 'bar' },
            { test: { 0: { equals: 'foo' }}, fn: 'foo' }
        ]);

        Test.prototype.foo = function () {
            return this.message;
        };

        Test.prototype.bar = function () {
            return this.message+'!';
        };
        
        assert.equals((new Test('foo')).test('foo'), 'foo');
        assert.equals((new Test('bar')).test('bar'), 'bar!');
    }
});
