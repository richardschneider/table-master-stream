# Table master stream

[![Travis build status](https://travis-ci.org/richardschneider/table-master-stream.svg)](https://travis-ci.org/richardschneider/table-master-stream)
[![Coverage Status](https://coveralls.io/repos/github/richardschneider/table-master-stream/badge.svg?branch=master)](https://coveralls.io/github/richardschneider/table-master-stream?branch=master)
 [![npm version](https://badge.fury.io/js/table-master-stream.svg)](https://badge.fury.io/js/table-master-stream) 
 
**table-master-stream** parses and transforms a stream of  [Blue Chip Bridge Table Manager Protocol](http://www.bluechipbridge.co.uk/protocol.htm) messages into a series of javascript objects via the [node stream](https://nodejs.org/api/stream.html#stream_api_for_stream_consumers) design pattern. It is available for [Node.js](https://nodejs.org) 
and most modern browsers.  If you want to know if your currrent browser is compatible, 
run the [online test suite](https://unpkg.com/table-master-stream/test/index.html).

The transformed object contains a `kind`, `text` and other properties that describes the message.  The 
[message](https://unpkg.com/table-master-parser/dist/doc/index.html) parsing
is performed by [table-master-parser](https://github.com/richardschneider/table-master-parser).

The [change log](https://github.com/richardschneider/table-master-stream/releases) is automatically produced with
the help of [semantic-release](https://github.com/semantic-release/semantic-release).


## Getting started

Install the latest version with [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)

    > npm install table-master-stream --save

## Usage

Include the package

    const tms = require('table-master-stream');

Process a stream

    const Readable = require('stream').Readable;

    // A stream of text
    function text(s) {
        var s = new Readable();
        s.push(s);
        s.push(null);
        return s;
    }

    // Process the message
    text('south plays AS')
        .pipe(tms())
        .on('data', msg => console.log(msg))
        .on('error', err => console.error(err.message));

Produces the output

    { 
        kind: 'play', 
        card: 'AS', 
        seat: 'S', 
        text: 'south plays AS' 
    }
    
Individual messages can be acted upon.  The event name is the `message.kind`, as in:

    .on('play', msg => console.log(msg))

## Browser

Include the package from your project

    <script src="./node_modules/table-master-stream/dist/table-master-stream.min.js" type="text/javascript"></script>

or from the [unpkg CDN](https://unpkg.com)

    <script src="https://unpkg.com/table-master-stream/dist/table-master-stream.min.js"></script>

This will provide `tableMasterStream` as a global object, or `define` it if you are using [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition).

# License
The [MIT license](LICENSE).

Copyright © 2016 Richard Schneider [(makaretu@gmail.com)](mailto:makaretu@gmail.com?subject=table+master+stream)