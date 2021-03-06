'use strict';

require('should');

let tms = require('..'),
    Readable = require('stream').Readable;

describe('Table Master Stream', () => {

    function text(doc) {
        var s = new Readable();
        s.push(doc);    // the string you want
        s.push(null);   // indicates end-of-file basically - the end of the stream
        return s;
    }

    it('should produce a parsed message', done => {
        text('north bids 1NT')
            .pipe(tms())
            .on('error', done)
            .on('end', () => done())
            .on('data', data => {
                data.should.be.an.Object();
            });
    });

    it('should produce multiple parsed messages', done => {
        let count = 0;
        text('north bids 1NT\r\east passes')
            .pipe(tms())
            .on('error', done)
            .on('end', () => {
                count.should.equal(2);
                done();
            })
            .on('data', () => ++count);
    });

    it('should error on an invalid message', done => {
        text('south-east bids 1NT')
            .pipe(tms())
            .on('error', e => {
                e.should.be.instanceOf(Error);
                e.should.have.property('message');
                done();
            })
            .on('data', () => done('should raise error'));
    });

    it('should emit events based on the kind of message', done => {
        let eventSeen = false;
        text('west passes')
            .pipe(tms())
            .on('error', done)
            .on('end', () => {
                eventSeen.should.equal(true);
                done();
            })
            .on('data', () => {})
            .on('bid', msg => {
                eventSeen = true;
                msg.should.have.property('bid', 'pass');
                msg.should.have.property('seat', 'W');
            });
    });

});
