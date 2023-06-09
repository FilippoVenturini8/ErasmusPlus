const mongoose = require('mongoose')

const universitySchema = new mongoose.Schema({
    id: String,
    name: String,
    country: String,
    city: String,
    latitude: Number,
    longitude: Number,
    offer: {
        period: String,
        places: Number,
        accepted: Number,
        field: String,
    },
    logo: String,
    wallpaper: String,
    cardImg: String,
    plot: String,
    reviews: Array,

});

module.exports = mongoose.model('universities', universitySchema);