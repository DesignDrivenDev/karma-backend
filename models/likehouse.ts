import mongoose  from 'mongoose';
const { Schema } = mongoose;

export const  likehouseSchema = new Schema({
    userId:{
        type:String,
        require: true,
    },
    roomid:{
        type:String,
        require: true,
    } 
});

const likehouseModel = mongoose.model("likehouse", likehouseSchema);
export default likehouseModel;