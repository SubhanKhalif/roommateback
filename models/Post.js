import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    rent: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Post", PostSchema);
