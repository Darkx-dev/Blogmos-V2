import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

emailSchema.plugin(mongoosePaginate);

const EmailModel =
  mongoose.models.Subscriber || mongoose.model("Subscriber", emailSchema);

export default EmailModel;
