const express = require('express');
const router = express.Router();
const CacheApiService = require('../service/CacheApiService');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({name: 'cache-api'});
const cacheApiService = new CacheApiService(logger);

router.get('/:key', async (req, res) => {
    try {
        const item = await cacheApiService.getItemByKey(req.params.key);
        logger.debug('retrieved item from cache db ', item);
        res.status(200).json(item);
    } catch (error) {
        logger.error('error occurred while retrieving item from cache db ', error);
        res.send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const item = await cacheApiService.getAllItems();
        logger.debug('retrieved all items from cache db ', item);
        res.status(200).json(item);
    } catch (error) {
        logger.error('error occurred while retrieving all items from cache db ', error);
        res.send(error);
    }
});

router.post('/', async (req, res) => {
    try {
        if(!req.body.data) {
            res.status(400).json(getErrorResponse('Required field data is missing', 'BadRequest'));
        }
        else{
            const item = await cacheApiService.upsertItem(req);
            logger.debug('create new cache item in db succeeded ', item);
            res.status(201).json(item);
        }
    } catch (error) {
        logger.error('error while creating new item in cache db ', error);
        res.status(500).json(getErrorResponse('Unknown error occurred', 'InternalServerError'));
    }
});

router.delete('/:key', async (req, res) => {
    try {
        await cacheApiService.removeItemByKey(req.params.key);
        logger.debug('deletion of item from db succeeded');
        res.status(204).end();
    } catch (error) {
        logger.error('error occurred while deleting item from cache db ', error);
        res.send(error);
    }
});

router.delete('/', async (req, res) => {
    try {
        await cacheApiService.removeAllItems();
        logger.debug('removal of all items from cache db');
        res.status(204).end();
    } catch (error) {
        logger.error('error occurred while removing items from cache db ', error);
        res.send(error);
    }
});

function getErrorResponse(message, errorType){
    return {
        resourceType: 'OperationOutcome',
        errorType: errorType,
        message: message
    }
}

module.exports = router;
