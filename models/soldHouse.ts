import mongoose from "mongoose";
import { MediaSchema } from "./media";
import { RoomSchema } from "./room";

const { Schema } = mongoose;

//House schema declaration
const HouseSchema = new Schema({
  appliances: [
    {
      type: String,
    },
  ],
  associationFee: {
    type: Number,
  },
  associationName: {
    type: String,
  },
  availabilityDate: {
    type: String,
  },
  bathroomsFull: {
    type: Number,
  },
  bathroomsHalf: {
    type: Number,
  },
  bathroomsTotalInteger: {
    type: Number,
  },
  bedroomsTotal: {
    type: Number,
  },
  sqFtBasement: {
    type: Number,
  },
  buildingAreaTotal: {
    type: Number,
  },
  buyerAgencyCompensation: {
    type: String,
  },
  sellingAgentMLSBoard: {
    type: String,
  },
  sellingAgentFullName: {
    type: String,
  },
  sellingOfficeName: {
    type: String,
  },
  sellingOfficePhone: {
    type: String,
  },
  additionalInformation: {
    type: String,
  },
  auctionBidInformation: {
    type: String,
  },
  auctionBidType: {
    type: String,
  },
  auctionYn: {
    type: String,
  },
  ceilingHeight: {
    type: String,
  },
  price: {
    type: Number,
  },
  closePrice: {
    type: Number,
  },
  closeDate: { type: Date, default: new Date().toUTCString() },
  constructionStatus: {
    type: String,
  },
  constructionType: {
    type: String,
  },
  coSellingTeamMUI: {
    type: String,
  },
  coSellingTeamMLSID: {
    type: String,
  },
  coSellingTeamName: {
    type: String,
  },
  financingInformation: {
    type: String,
  },
  hoaSubjectToDues: {
    type: String,
  },
  garageBays: {
    type: String,
  },
  sqFtTotal: {
    type: Number,
  },
  coSellingAgentMLSBoard: {
    type: String,
  },
  coSellingAgentPrimaryBoard: {
    type: String,
  },
  coSellingAgentFullName: {
    type: String,
  },
  coSellingAgentMUI: {
    type: String,
  },
  coSellingAgentMLSID: {
    type: String,
  },
  coSellingAgentDirectWorkPhone: {
    type: String,
  },
  coSellingOfficeMUI: {
    type: String,
  },
  coSellingOfficeMLSID: {
    type: String,
  },
  coSellingOfficeName: {
    type: String,
  },
  coSellingOfficePhone: {
    type: String,
  },
  coListAgentMLSBoard: {
    type: String,
  },
  coListAgentPrimaryBoard: {
    type: String,
  },
  coListAgentFullName: {
    type: String,
  },
  coListAgentMUI: {
    type: String,
  },
  coListAgentMLSID: {
    type: String,
  },
  coListAgentDirectWorkPhone: {
    type: String,
  },
  coListOfficeMUI: {
    type: String,
  },
  coListOfficeMLSID: {
    type: String,
  },
  coListOfficeName: {
    type: String,
  },
  communityFeatures: {
    type: [String],
    default: [],
  },
  sellerContribution: {
    type: Number,
  },
  countyOrParish: {
    type: String,
  },
  cumulativeDaysOnMarket: {
    type: Number,
  },
  daysOnMarket: {
    type: Number,
  },
  elementarySchool: {
    type: String,
  },
  highSchool: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  listingAgentMLSBoard: {
    type: String,
  },
  listingAgentPrimaryBoard: {
    type: String,
  },
  listAgentDirectWorkPhone: {
    type: String,
  },
  listAgentFullName: {
    type: String,
  },
  listAgentMUI: {
    type: String,
  },
  listAgentMLSID: {
    type: String,
  },
  listingType: {
    type: String,
  },
  listingContractDate: {
    type: Date,
  },
  listingId: {
    type: String,
  },
  listPrice: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  lastChangeTimestamp: {
    type: String,
  },
  middleOrJuniorSchool: {
    type: String,
  },
  newConstructionYN: {
    type: Boolean,
  },
  modificationTimestamp: {
    type: Date,
    default: new Date().toUTCString(),
  },
  parking: [
    {
      type: String,
    },
  ],
  parkingTotal: {
    type: String,
  },
  propertySubType: {
    type: String,
  },
  propertyType: {
    type: String,
  },
  publicRemarks: {
    type: String,
  },
  streetName: {
    type: String,
  },
  streetNumber: {
    type: String,
  },
  subdivisionName: {
    type: String,
  },
  waterSource: {
    type: [String],
    default: [],
  },
  yearBuilt: {
    type: Number,
  },
  description: {
    type: String,
  },
  accessibilityFeatures: {
    type: [String],
    default: [],
  },
  builderName: {
    type: String,
  },
  numberOfCompletedUnitsTotal: {
    type: String,
  },
  numberOfDocksTotal: {
    type: String,
  },
  numberOfDriveInDoorsTotal: {
    type: String,
  },
  numberOfProjectedUnitsTotal: {
    type: String,
  },
  sqFtMain: {
    type: String,
  },
  sqFtMaximumLease: {
    type: String,
  },
  sqFtMinimumLease: {
    type: String,
  },
  sqFtThird: {
    type: String,
  },
  sqFtUpper: {
    type: String,
  },
  streetViewParam: {
    type: String,
  },
  city: {
    type: String,
  },
  directions: {
    type: String,
  },
  fireplaceYN: {
    type: String,
  },
  furnished: {
    type: String,
  },
  laundryFeatures: {
    type: [String],
    default: [],
  },
  livingArea: {
    type: String,
  },
  originalListPrice: {
    type: String,
  },
  postalCode: {
    type: String,
  },
  taxAssessedValue: {
    type: String,
  },
  virtualTourURLUnbranded: {
    type: String,
  },
  exteriorFeatures: {
    type: [String],
    default: [],
  },
  lotSizeArea: {
    type: Number,
  },
  lotSizeUnits: {
    type: String,
  },
  standardStatus: {
    type: String,
  },
  masterBedroomLevel: {
    type: String,
  },
  address: {
    type: String,
  },
  highschool: {
    type: String,
  },
  sewer: {
    type: [String],
    default: [],
  },
  air: {
    type: [String],
    default: [],
  },
  fireplace: {
    type: [String],
    default: [],
  },
  siding: {
    type: [String],
    default: [],
  },
  flooring: {
    type: [String],
    default: [],
  },
  listinghistorydata: [
    {
      originalListPrice: {
        type: String,
      },
      listingContractDate: {
        type: Date,
      },
      newprice: {
        type: Number,
      },
      lastChangeTimestamp: {
        type: String,
      },
    },
  ],
  media: [MediaSchema],
  rooms: [RoomSchema],
});

// originalListPrice: house.OriginalListPrice,
// listingdate : house.listingContractDate,
// newprice: house.ListPrice,
// lastChangeTimestamp: house.MajorChangeTimestamp,

const SoldHouseModel = mongoose.model("SoldHouse", HouseSchema);
export default SoldHouseModel;
