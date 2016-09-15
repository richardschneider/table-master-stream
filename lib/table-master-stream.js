'use strict';

var stream = require('stream');
var util = require('util');
var lines = require('lstream');
var pipe = require('multipipe');
var tm = require('table-master-parser');

function TableMasterStream(opts) {
    opts = opts || {};
    opts.objectMode = true;
    stream.Transform.call(this, opts);
}
util.inherits(TableMasterStream, stream.Transform);

TableMasterStream.prototype._transform = function(line, encoding, done) {
    var self = this;
    tm.parse(line, (err, msg) => {
        if (err) {
            err.message += ': ' + line;
            return done(err);
        }
        msg.text = line;
        self.push(msg);
        self.otherEmitter.emit(msg.kind, msg);
        done();
    });
};

TableMasterStream.prototype._flush = function(done) {
    done();
};

module.exports = function(opts) {
    var tms = new TableMasterStream(opts);
    var pipeline = pipe(lines(), tms);
    tms.otherEmitter = pipeline;
    return pipeline;
};
