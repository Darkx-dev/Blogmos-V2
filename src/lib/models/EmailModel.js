import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
});

const EmailModel =
  mongoose.models.Subscriber || mongoose.model("Subscriber", emailSchema);

export default EmailModel;
