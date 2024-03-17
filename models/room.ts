import mongoose  from 'mongoose';
const { Schema } = mongoose;

export const  RoomSchema = new Schema({
    bathsFull:{
        type:String
    },
    bathsHalf:{
        type:String
    },
    bedsTotal:{
        type:Number
    },
    roomKey:{
        type:String
    },
    roomLevel:{
        type:String
    },
    roomTypes:{
        type:String
    }
    
  });
