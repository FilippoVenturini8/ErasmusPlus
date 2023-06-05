const mongoose = require('mongoose')

const universitySchema = new mongoose.Schema({
    name: String,
    country: String,
    city: String,
    offer: {
        period: String,
        places: String,
        field: String,
    },
    logo: String,
    wallpaper: String,
    cardImg: String,
    plot: String,

});

module.exports = mongoose.model('universities', universitySchema);