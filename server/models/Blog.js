import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    isPublished: { type: String, required: true }
},{timestamps:true})
const Model=mongoose.model("user",blogSchema,'aiBlogs')
export default Model
