const mongoose = require("mongoose");

const kitchenItemSchema = new mongoose.Schema({
    item_id: String,
    name: String,
    category: String,
    unit: String,
    storage_type: String,
    expiration_days: Number
});

const KitchenItem = mongoose.model("KitchenItem", kitchenItemSchema);
module.exports = KitchenItem;
