import mongoose from "mongoose";
const { Schema } = mongoose;

//House schema declaration
const MeetingSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  phoneNo: {
    type: Number,
    require: true,
  },
  Email: {
    type: String,
    require: true,
  },
  Date: {
    type: String,
  },
  Description: {
    type: String,
  },
  Meetingtype: {
    type: String,
  },
  id: {
    type: String,
  },
});

const MeetingModel = mongoose.model("Meeting", MeetingSchema);
export default MeetingModel;
