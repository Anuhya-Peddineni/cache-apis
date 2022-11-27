'use strict';

const {expect} = require('chai-for-sinon');
let chai = require('chai');
let chaiHttp = require('chai-http');
const env = require('../env');
const server = `http://localhost:${env.Port}`
chai.use(chaiHttp);

describe('Test Get all cache items', () => {
    it('TC01-Get all cache items call should succeed with proper request', (done) => {
        chai.request(server)
            .get('/cache')
            .end((err, res) => {
                expect(res.status).to.equals(200);
                expect(res.body.resourceType).to.equals('CacheItem');
                done();
            });
    });

});
