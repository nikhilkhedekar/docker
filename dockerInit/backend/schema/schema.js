const { Schema, model } = require('mongoose');

const favoriteSchema = new Schema({
  type: { type: String, required: true }, // 'ship' | 'character'
  name: { type: String, required: true },
  url: { type: String, required: [true, "URL required"] }
}); 

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;