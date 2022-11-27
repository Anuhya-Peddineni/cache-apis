'use strict';

let CacheSchema = require('../../src/repository/schema/CacheSchema');
const sinon = require('sinon');
const CacheRepository = require('../../src/repository/CacheApiRepository');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const bunyan = require('bunyan');
const logger = bunyan.createLogger({name: 'cache-api'});


describe('Cache Repository test', () => {
    const cacheRepo = new CacheRepository(logger);

    it('TC01-upsert item should succeed with proper request',  (done) => {
        const dbStub = sinon.stub(CacheSchema.prototype, 'save').callsFake(() => Promise.resolve(this));
        cacheRepo.upsertItem({"data":"abc"});
        dbStub.restore();
        done();
    });
});
