import mongoose from "mongoose";
const { Schema } = mongoose;

//Misc schema declaration
const MiscSchema = new Schema({
    Date: {
      type: Date,
    },
});


const MiscModel = mongoose.model("Misc", MiscSchema);
export default MiscModel;