const mongoose = require('mongoose');

const cacheDbSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    expiresAt: {
        type: String
    }
});

const CacheSchema = mongoose.model('cacheDbSchema', cacheDbSchema);
module.exports = CacheSchema;
