# Arities - A small function overloading framework
Overload functions based on [Pursuit](https://github.com/gausby/pursuit/) patterns. This is heavily inspired by function arity from Erlang (and Elixir).


## Usage
Define patterns using an *array that contain objects* with a *test*- and a *fn*-key defined.

* **test** any valid Pursuit query. Look at the [Pursuit documentation](https://github.com/gausby/pursuit/blob/master/README.md) for all the details on this. Alternatively a function that return true or false can be used. If an object is passed in it will be compiled into a function.

* **fn** A string or a function that will get run if the pattern is matched. If a string is passed it will attempt to run a function with that name on the given scope.

It will run through the patterns and execute the first one that match the given input.

Example:

    var myFunc = arities([
        // will match input where the first argument is 'foo'
        { test: { 0: {equals: 'foo'}}, fn: function() { return 'foo'; } },
        // will match input where the first argument is 'bar'
        { test: { 0: {equals: 'bar'}}, fn: function() { return 'bar'; } }
    ]);

Arities will return a function that will pattern match its given arguments and pass them along to the defined function.

    console.log(myFunc('foo')); // 'foo'
    console.log(myFunc('bar')); // 'bar'
    console.log(myFunc('baz')); // null

`null` will be returned if no pattern is matched.


### Scope binding
If a fn is defined as a string, a named function on the passed scope will be called. This makes it possible to write code like this:

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
        return this.message + '!';
    };
        
    console.log((new Test('this is foo')).test('foo')) // 'this is foo'
    console.log((new Test('this is bar')).test('bar')) // 'this is bar!'


### Catch all pattern
An empty pursuit query will always return true. This fact can be used to create a catch-all, if it is set as the last test pattern.

    var myFunc = arities([
        { test: { 0: {equals: 'foo'}}, fn: function() { return 'foo'; } },
        { test: {}, fn: function() { return 'every thing else'; } }
    ]);
    console.log(myFunc('foo')); // 'foo'
    console.log(myFunc('bar')); // 'every thing else'
    console.log(myFunc('baz')); // 'every thing else'

**Pattern order matters**. The first match is the one being executed. Have this in mind when defining patterns.

    var myFunc = arities([
        { test: {}, fn: function() { return 'catch all'; } }, // CATCH ALL
        { test: { 0: {equals: 'foo'}}, fn: function() { return 'foo'; } }
    ]);
    console.log(myFunc('foo')); // 'catch all'
    console.log(myFunc('bar')); // 'catch all'
    console.log(myFunc('baz')); // 'catch all'

If no catch all is defined, the function will return `null` if no pattern match the given input.


## Development
After cloning the project you will have to run `npm install` in the project root. This will install the various grunt plugins and other dependencies.


### QA tools
The QA tools rely on the [Grunt](http://gruntjs.com) task runner. To run any of these tools, you will need the grunt-cli installed globally on your system. This is easily done by typing the following in a terminal.

    $ npm install grunt-cli -g

The unit tests will need the [Buster](http://busterjs.org/) unit test framework.

    $ npm install -g buster

These two commands will install the buster and grunt commands on your system. These can be removed by typing `npm uninstall buster -g` and `npm uninstall grunt-cli -g`.


#### Unit Tests
If you haven't all ready install the Grunt CLI tools and have a look at the grunt configuration file in the root of the project.

When developing you want to run the script watcher. Navigate to the project root and type the following in your terminal.

    $ grunt watch:scripts

This will run the jshint and tests each time a file has been modified.


## License
The MIT License (MIT)

Copyright (c) 2014 Martin Gausby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
