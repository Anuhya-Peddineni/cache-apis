const uuid = require('uuid');
const moment = require('moment');
const CacheApiRepository = require('../repository/CacheApiRepository');
const env = require('../../env');

const cacheTTL = env.CacheTTL;

class CacheApiService {

    constructor(logger) {
        this.logger = logger;
        this.cacheApiRepository = new CacheApiRepository(logger);
    }

    async getItemByKey(key) {
        try {
            const item = await this.cacheApiRepository.getItemByKey(key);
            this.logger.debug(`getItemByKey succeeded with result: ${item}`);
            return constructAndGetRequestBodyForGetItem(item);
        } catch (error) {
            this.logger.error(`getItemByKey failed with error: ${error}`);
            throw new Error(error);
        }
    }

    async getAllItems() {
        try {
            const item = await this.cacheApiRepository.getAllItems();
            this.logger.debug(`getAllItems succeeded with result: ${item}`);
            return constructAndGetRequestBodyForGetItem(item);
        } catch (error) {
            this.logger.error(`getAllItems failed with error: ${error}`);
            throw new Error(error);
        }
    }

    async upsertItem(request) {
        try {
            const requestBody = constructAndGetRequestBodyForUpsertItem(request);
            await this.cacheApiRepository.upsertItem(requestBody);
            this.logger.debug(`Upsert item succeeded with request body: ${requestBody}`);
            requestBody.resourceType = 'CacheItem';
            return requestBody;
        } catch (error) {
            this.logger.error(`Upsert item failed with error: ${error}`);
            throw new Error(error);
        }
    }

    async removeItemByKey(key) {
        try {
            await this.cacheApiRepository.removeItemByKey(key);
            this.logger.debug(`removeItemByKey succeeded for item with key: ${key}`);
            return `removeItemByKey succeeded for item with key: ${key}`;
        } catch (error) {
            this.logger.error(`removeItemByKey failed with error: ${error}`);
            throw new Error(error);
        }
    }

    async removeAllItems() {
        try {
            await this.cacheApiRepository.removeAllItems();
            this.logger.debug('removeAllItems succeeded');
            return 'removeAllItems succeeded';
        } catch (error) {
            this.logger.error(`removeItemByKey failed with error: ${error}`);
            throw new Error(error);
        }
    }
}

function constructAndGetRequestBodyForUpsertItem(req) {
    const expiryTime = moment().add(cacheTTL,"seconds");
    return {
        data: req.body.data,
        key: uuid.v4(),
        expiresAt: expiryTime.toISOString()
    }
}

function constructAndGetRequestBodyForGetItem(items) {
    return {
        resourceType: 'CacheItem',
        entry: items
    }
}


module.exports = CacheApiService;
