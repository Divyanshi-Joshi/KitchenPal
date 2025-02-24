const userPantrySchema = new mongoose.Schema({
    user_id: String,
    item_id: String,
    name: String,
    quantity: Number,
    unit: String,
    expiration_date: Date
});

const UserPantry = mongoose.model("UserPantry", userPantrySchema);
module.exports = UserPantry;
