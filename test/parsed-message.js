'use strict';

require('should');

let tms = require('..'),
    Readable = require('stream').Readable;

describe('Parsed Message', () => {

    function text(doc) {
        var s = new Readable();
        s.push(doc);    // the string you want
        s.push(null);   // indicates end-of-file basically - the end of the stream
        return s;
    }

    it('should have message kind', done => {
        text('north bids 1NT')
            .pipe(tms())
            .on('error', done)
            .on('end', () => done())
            .on('data', msg => msg.should.have.property('kind', 'bid'));
    });

    it('should have message text', done => {
        text('north bids 1NT')
            .pipe(tms())
            .on('error', done)
            .on('end', () => done())
            .on('data', msg => msg.should.have.property('text', 'north bids 1NT'));
    });

    it('should have specific message properties', done => {
        text('north bids 1NT')
            .pipe(tms())
            .on('error', done)
            .on('end', () => done())
            .on('data', msg => msg.should.have.property('bid', '1NT'));
    });

});
