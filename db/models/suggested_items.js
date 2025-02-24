const suggestedItemSchema = new mongoose.Schema({
    user_id: String,
    item_id: String,
    name: String,
    category: String,
    suggested_reason: String
});

const SuggestedItem = mongoose.model("SuggestedItem", suggestedItemSchema);
module.exports = SuggestedItem;
