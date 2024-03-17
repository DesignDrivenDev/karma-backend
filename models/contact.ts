import mongoose from "mongoose";
const { Schema } = mongoose;

//House schema declaration
const ContactSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  inquiryType: {
    type: String,
  },
  phoneNo: {
    type: Number,
  },
  email: {
    type: String,
    require:true
  },
  inquiryDetails : {
    type: String,
  },
  value : {
    type :Number,
  },
});

const ContactModel = mongoose.model("Contact", ContactSchema);
export default ContactModel;
