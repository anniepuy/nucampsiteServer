const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema 
const favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    campsites: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
    }
}, {
    timestamps: true
});

//model for the schema
const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;