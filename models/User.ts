import mongoose from "mongoose";
const { Schema } = mongoose;

//House schema declaration
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  resetLink : {
     data: String,
     default: ""
  },
  likehouse : {
    type: [{type: mongoose.Schema.Types.ObjectId , ref:'House'}],
    default: [],
  }
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
