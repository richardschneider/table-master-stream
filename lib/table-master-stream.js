'use strict';

var stream = require('stream');
var util = require('util');
var lines = require('lstream');
var pipe = require('multipipe');
var tm = require('table-master-parser');

function TableMasterStream(opts) {
    if (!(this instanceof TableMasterStream)) return new TableMasterStream(opts);
    opts = opts || {};
    opts.objectMode = true;
    stream.Transform.call(this, opts);
}
util.inherits(TableMasterStream, stream.Transform);

TableMasterStream.prototype._transform = function(line, encoding, done) {
    var self = this;
    tm.parse(line, (err, msg) => {
        if (err) {
            return done(err);
        }
        msg.text = line;
        self.push(msg);
        done();
    });
};

TableMasterStream.prototype._flush = function(done) {
    done();
};

module.exports = opts => pipe(lines(), new TableMasterStream(opts));
