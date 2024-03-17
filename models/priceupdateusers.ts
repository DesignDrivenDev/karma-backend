import mongoose from "mongoose";
const { Schema } = mongoose;

//Adding user to send notifiaction if the price changes on selected properties.
const PriceUpdateUsers = new Schema({
  email: {
    type: String,
    require: true,
  },
  houseids : {
    type: [String],
    default: [],
  }
});

const PuuModel = mongoose.model("PriceUpdateUser", PriceUpdateUsers);
export default PuuModel;