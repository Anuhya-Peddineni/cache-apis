'use strict';

const {expect} = require('chai-for-sinon');
let chai = require('chai');
let chaiHttp = require('chai-http');
const env = require('../env');
const server = `http://localhost:${env.Port}`
chai.use(chaiHttp);

describe('Test Create cache item', () => {
    it('TC01-Cache item creation should succeed with proper request body', (done) => {
        chai.request(server)
            .post('/cache')
            .send({"data":"unittestdata"})
            .end((err, res) => {
                expect(res.status).to.equals(201);
                expect(res.body.key).to.exist;
                expect(res.body.expiresAt).to.exist;
                expect(res.body.resourceType).to.equals('CacheItem');
                done();
            });
    });

    it('TC02-Cache item creation should fail when data is not passed in request body', (done) => {
        chai.request(server)
            .post('/cache')
            .send({})
            .end((err, res) => {
                expect(res.status).to.equals(400);
                expect(res.body.resourceType).to.equals('OperationOutcome');
                expect(res.body.message).to.equals('Required field data is missing');
                expect(res.body.errorType).to.equals('BadRequest');
                done();
            });
    });
});
