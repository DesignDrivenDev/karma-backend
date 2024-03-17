import mongoose  from 'mongoose';
const { Schema } = mongoose;

export const  MediaSchema = new Schema({
    ongDescription:{
        type:String
    },
    mediaKey:{
        type:String
    },
    order:{
        type:Number
    },
    mediaURL:{
        type:String
    },
    
  });

