const CacheSchema = require('../repository/schema/CacheSchema');
const moment = require('moment');
const env = require('../../env');

const NumberOfAllowedCacheEntries = env.NumberOfAllowedCacheEntries;
const cacheTTL = env.CacheTTL;

class CacheApiRepository {

    constructor(logger) {
        this.logger = logger;
    }

    async getItemByKey(key) {
        try {
            let item = await CacheSchema.findOne({key:key});
            this.logger.debug('Get item by key from db succeeded');
            if(item) {
                this.logger.debug('Cache hit');
                const currentTime = moment();
                const expiryTimeOfItem = item.expiresAt;
                //generating new random data with same key if ttl exceeded for current retrieved key
                if(expiryTimeOfItem.isBefore(currentTime)) {
                    item = {
                        data: `CacheRandomData-${key}`,
                        key: key
                    };
                } else {
                    // resetting ttl on every cache hit
                    item.expiresAt = moment().add(cacheTTL,"seconds").toISOString();
                }
                await this.upsertItem(item);
                return item;
            } else {
                this.logger.debug('Cache miss');
                const newItem = {
                    data: `CacheRandomData-${key}`,
                    key: key,
                    expiresAt: moment().add(cacheTTL,"seconds").toISOString()
                };
                await this.upsertItem(newItem);
                return newItem;
            }
        } catch (error) {
            this.logger.error(`Get item by key from db failed with error: ${error}`);
            throw new Error(error);
        }
    }

    async getAllItems() {
        try {
            const items = await CacheSchema.find();
            this.logger.debug('getAllItems from db succeeded');
            return items;
        } catch (error) {
            this.logger.error(`getAllItems from db failed with error: ${error}`);
            throw new Error(error);
        }
    }

    /*
    Every time before new cache entry is inserted, allowed number of cache entries is checked.
    if allowed number cache entries is equal to total number of cache entries in db-
        -the oldest cache entry from the db is deleted and current new entry is inserted
    else
        -new cache entry is inserted
     */
    async upsertItem(itemToBeInserted) {
        try {
            const item = new CacheSchema(itemToBeInserted);
            const noOfItemsInCacheDb = await CacheSchema.countDocuments();
            if(noOfItemsInCacheDb === NumberOfAllowedCacheEntries) {
                const oldestItem = await CacheSchema.findOne({}, {}, {sort:{created_at: 1 }});
                await oldestItem.remove();
            }
            await item.save();
            this.logger.debug('Upsert item to db succeeded');
            return item;
        } catch (error) {
            throw new Error(error);
        }
    }

    async removeItemByKey(key) {
        try {
            await CacheSchema.deleteOne({ key: key });
            this.logger.debug('removeItemByKey from db succeeded');
            return 'removeItemByKey from db succeeded';
        } catch (error) {
            this.logger.error(`removeItemByKey from db failed with error: ${error}`);
            throw new Error(error);
        }
    }

    async removeAllItems() {
        try {
            await CacheSchema.deleteMany({});
            this.logger.debug('removeAllItems from db succeeded');
            return 'removeAllItems from db succeeded';
        } catch (error) {
            this.logger.error(`removeItemByKey from db failed with error: ${error}`);
            throw new Error(error);
        }
    }

}

module.exports = CacheApiRepository;
