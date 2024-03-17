import { Request, Response } from "express";
import axios from "axios";
import HouseModel from "../models/house";
import MiscModel from "../models/misc";
import dotenv from "dotenv";
import { addToEmailQueue, addToUpsertQueue } from "./bull";
import PuuModel from "../models/priceupdateusers";
import moment = require("moment");
import SoldHouseModel from "../models/soldHouse";
dotenv.config();

var cron = require("node-cron");

// Routes 1, 2 and 3 are for initial importing of properties. They only need to be ran once, hence disabled.
// route 1:- active under contract
export const loadPropertiesActiveUnderContract = async (
  req: Request,
  res: Response
) => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Active Under Contract'",
          $expand: "Media,Rooms",
          $top: 1000,
          $skip: skip,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
        return (
          value.PropertyType == "Residential"
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ListPrice,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //creating karma-data and store in database
      HouseModel.create(data);

      // console.log(karmaData)
      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Initial Import: All under contract properties added.");
        res.status(200).json({ success: true });
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log(value);

      if (nextData) {
        reload(value);
      } else {
        res.status(200).json({ success: false });
      }
    }

    await reload("0");
    // console.log("here we get the value",value)
  } catch (error: any) {
    console.log(
      "Initial Import: Error while loading properties under contract: ",
      error.toString()
    );
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }
};

// route 2:- is active
export const loadPropertiesActive = async (req: Request, res: Response) => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Active'",
          $expand: "Media,Rooms",
          $top: 1000,
          $skip: skip,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
        return (
          value.PropertyType == "Residential"
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ListPrice,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //  console.log(house.Rooms.find(room => room.RoomTypes && room.RoomTypes.includes("Primary Bedroom"))?.RoomLevel)

      //creating karma-data and store in database
      // console.log(karmaData)
      HouseModel.create(data);
      // console.log(karmaData.garageBays)
      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Initial Import: All active properties added.");
        res.status(200).json({ success: true });
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log("Adding Active properties. Current counter: " + value);

      if (nextData) {
        reload(value);
      } else {
        res.status(200).json({ success: false });
      }
    }

    await reload("0");

    // console.log("here we get the value",value)
  } catch (error: any) {
    console.log(
      "Initial Import: Error while loading Active Properties : ",
      error.toString()
    );
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }
};

// route 3 :- comingsoon
export const loadPropertiesComingSoon = async (req: Request, res: Response) => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Coming Soon'",
          $expand: "Media,Rooms",
          $skip: skip,
          $top: 1000,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
        return (
          value.PropertyType == "Residential"
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ListPrice,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //  console.log(house.Rooms.find(room => room.RoomTypes && room.RoomTypes.includes("Primary Bedroom"))?.RoomLevel)

      //creating karma-data and store in database

      HouseModel.create(data);

      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Initial Replication: All coming soon properties added.");
        res.status(200).json({ success: true });
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log("Adding Coming Soon properties. Current counter: " + value);

      if (nextData) {
        reload(value);
      } else {
        res.status(200).json({ success: false });
      }
    }

    await reload("0");

    // console.log("here we get the value",value)
  } catch (error: any) {
    console.log("Error in loadPropertiesComingSoon : ", error.toString());
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }
};

// route 4 :- closed
export const loadPropertiesClosed = async (req: Request, res: Response) => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Closed' and ModificationTimestamp gt 2019-12-31T23:59:59.99Z",
          $expand: "Media,Rooms",
          $top: 1000,
          $skip: skip,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
        return (
          value.PropertyType == "Residential" &&
          moment(value.CloseDate).isAfter(
            moment().startOf("year").subtract(3, "year")
          )
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ListPrice,
          closePrice: house.ClosePrice,
          closeDate: house.CloseDate,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //  console.log(house.Rooms.find(room => room.RoomTypes && room.RoomTypes.includes("Primary Bedroom"))?.RoomLevel)

      //creating karma-data and store in database
      SoldHouseModel.create(data);
      // console.log(karmaData)
      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Initial Replication: All Sold properties added.");
        res.status(200).json({ success: true });
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log("Adding Sold properties. Current counter: " + value);

      if (nextData) {
        reload(value);
      } else {
        res.status(200).json({ success: false });
      }
    }

    await reload("0");

    // console.log("here we get the value",value)
  } catch (error: any) {
    console.log("Error in loadPropertiesComingSoon : ", error.toString());
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
    return;
  }
};

//route 5 :-  getting single data mongo database using id ;
export const fetchById = async (req: Request, res: Response) => {
  //getting id from user
  let id = req.params["id"];

  let response = await HouseModel.findById(id);

  if (response) {
    res.json(response);
  } else {
    return res.status(400).json({ error: "data does not exist" });
  }

  //getting data from particular house
  // if (id.match(/^[0-9a-fA-F]{24}$/)) {
  //   let response = await HouseModel.find( {"_id" : id} );
  //   res.json(response);
  // }else{
  //   return res.status(400).json({ error: "data does not exist" })
  // }
};

//route 5 :-  getting single data mongo database using id ;
export const fetchBySoldPropertiesId = async (req: Request, res: Response) => {
  //getting id from user
  let id = req.params["id"];

  let response = await SoldHouseModel.findById(id);

  if (response) {
    res.json(response);
  } else {
    return res.status(400).json({ error: "data does not exist" });
  }

  //getting data from particular house
  // if (id.match(/^[0-9a-fA-F]{24}$/)) {
  //   let response = await HouseModel.find( {"_id" : id} );
  //   res.json(response);
  // }else{
  //   return res.status(400).json({ error: "data does not exist" })
  // }
};

//route 6 :- get data using properties;
export const fetchByProperties = async (req: Request, res: Response) => {
  // using params to change page
  let param = req.params["page"];
  let page = parseInt(param);

  //destructuring the body
  const {
    newConstructionYN,
    minPrice,
    maxPrice,
    bedroomsTotal,
    minbuildingAreaTotal,
    maxbuildingAreaTotal,
    minyearBuilt,
    maxyearBuilt,
    propertySubType,
    communityFeatures,
    exteriorFeatures,
    bathroomsTotalInteger,
    lotSizeArea,
    lotSizeUnits,
    masterBedroomLevel,
    standardStatus,
    searchtext,
    sort,
    subdivname,
  } = req.body;

  //created match to store the object
  let match: any = {};
  let sortingdata: any = {};
  //condition to put obj in match
  if (bedroomsTotal) {
    match.bedroomsTotal = { $gte: bedroomsTotal };
  }
  if (bathroomsTotalInteger) {
    match.bathroomsTotalInteger = { $gte: bathroomsTotalInteger };
  }
  if (minPrice || maxPrice) {
    match.price = { $gt: minPrice, $lt: maxPrice };
  }
  if (minbuildingAreaTotal || maxbuildingAreaTotal) {
    match.buildingAreaTotal = {
      $gt: minbuildingAreaTotal,
      $lt: maxbuildingAreaTotal,
    };
  }
  if (minyearBuilt || maxyearBuilt) {
    match.yearBuilt = { $gt: minyearBuilt, $lt: maxyearBuilt };
  }
  if (propertySubType) {
    if (propertySubType == "Single Family Residence") {
      match.propertySubType = propertySubType;
    } else if (propertySubType == "Condo/Townhouse") {
      match.propertySubType = {
        $in: ["Condo/Townhouse", "Townhouse", "Condominium"],
      };
    } else {
      match.propertySubType = "";
    }
  }
  if (masterBedroomLevel) {
    match.masterBedroomLevel = masterBedroomLevel;
  }
  if (standardStatus) {
    match.standardStatus = standardStatus;
  }
  //changes has to be done here
  if (communityFeatures != "") {
    match.communityFeatures = { $all: [...communityFeatures] };
  }
  if (exteriorFeatures != "") {
    match.exteriorFeatures = { $all: [...exteriorFeatures] };
  }
  if (lotSizeArea) {
    match.lotSizeArea = { $gte: lotSizeArea };
  }
  if (lotSizeUnits) {
    match.lotSizeUnits = { $gte: lotSizeUnits };
  }
  if (newConstructionYN) {
    match.newConstructionYN = newConstructionYN;
  }
  if (subdivname) {
    match.subdivisionName = { $eq: subdivname };
  }
  if(standardStatus == "Closed"){
    if (sort) {
      if (sort == 1) {
        sortingdata.closePrice = 1;
      }
      if (sort == 2) {
        sortingdata.closePrice = -1;
      }
      if (sort == 3) {
        sortingdata.modificationTimestamp = -1;
      }
      if (sort == 4) {
        sortingdata.listingContractDate = -1;
      }
    }
  }else{
    if (sort) {
      if (sort == 1) {
        sortingdata.price = 1;
      }
      if (sort == 2) {
        sortingdata.price = -1;
      }
      if (sort == 3) {
        sortingdata.modificationTimestamp = -1;
      }
      if (sort == 4) {
        sortingdata.listingContractDate = -1;
      }
    }
  }
  if (searchtext) {
    // match.city = { $regex: searchtext}
    match = {
      ...match,
      $or: [
        { city: { $regex: searchtext, $options: "i" } },
        { postalCode: { $eq: searchtext } },
        { subdivisionName: { $regex: searchtext, $options: "i" } },
        { listingId: { $regex: searchtext, $options: "i" } },
        { address: { $regex: searchtext, $options: "i" } },
      ],
    };
  }

  if (standardStatus == "Closed") {
    //to get the total no of pages
    let pages = await SoldHouseModel.countDocuments(match);

    // console.log(pages);

    let totalpage;

    if (pages < 8) {
      totalpage = 1;
    } else {
      totalpage = Math.ceil(pages / 8);
    }

    //filtered data from the database.
    let response = await SoldHouseModel.aggregate([
      { $match: match },
      { $sort: sortingdata },
      { $skip: 8 * page },
      { $limit: 8 },
    ]);

    res.json({ data: response, pages: totalpage });
   }
   else {
    //to get the total no of pages
    let pages = await HouseModel.countDocuments(match);

    // console.log(pages);

    let totalpage;

    if (pages < 8) {
      totalpage = 1;
    } else {
      totalpage = Math.ceil(pages / 8);
    }

    //filtered data from the database.
    let response = await HouseModel.aggregate([
      { $match: match },
      { $sort: sortingdata },
      { $skip: 8 * page },
      { $limit: 8 },
    ]);

    res.json({ data: response, pages: totalpage });
  }
};

export const fetchByAddress = async (req: Request, res: Response) => {
  const { address } = req.body;

  let searchedaddress = await HouseModel.find({
    address: { $regex: address, $options: "i" },
  });

  if (searchedaddress) {
    res.json({ data: searchedaddress });
  } else {
    return res.status(400).json({ error: "oops address not found" });
  }
};

//route 7 :- upsert data in mongodb activeundercontract
export const upsertActiveunderContract = async () => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Active Under Contract'",
          $expand: "Media,Rooms",
          $top: 1000,
          $skip: skip,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
        return (
          value.PropertyType == "Residential"
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ListPrice,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //function for upsert and bull.
      data.forEach(async (house: any) => {
        let queryobject = {
          listingId: house.listingId,
        };

        let olddata: any = await HouseModel.findOne(queryobject);

        if (olddata) {
          if (olddata.price > house.price) {
            // console.log("smaller than original value");

            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                } else {
                }
              });
            });
          } else if (olddata.price < house.price) {
            // console.log("greater than original value");
            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                } else {
                }
              });
            });
          } else {
            let newupdatedvalues = {
              $set: { ...house },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);
          }
        } else {
          let newupdatedvalues = {
            $set: { ...house },
          };

          const option = { upsert: true };

          await HouseModel.updateMany(queryobject, newupdatedvalues, option);
        }
      });

      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Finished updating Under Contract properties.");
        let misc_id = "63d1431106befa03ced8d876";
        MiscModel.findByIdAndUpdate(
          misc_id,
          { Date: Date.now() },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated Date : ", docs);
            }
          }
        );
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log(value);

      if (nextData) {
        reload(value);
      } else {
        console.log("An error occured.");
      }
    }

    await reload("0");

    // console.log("here we get the value",value)
  } catch (error: any) {
    console.log(
      "An error occured while running upsert for properties under contract.",
      error.toString()
    );
    return;
  }
};

//route 8 :- upsert data in mongodb active
export const upsertActive = async () => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Active'",
          $expand: "Media,Rooms",
          $top: 1000,
          $skip: skip,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
        return (
          value.PropertyType == "Residential"
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ListPrice,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //upsert functionality here
      data.forEach(async (house: any) => {
        let queryobject = {
          listingId: house.listingId,
        };

        let olddata: any = await HouseModel.findOne(queryobject);

        if (olddata) {
          if (olddata.price > house.price) {
            // console.log("smaller than original value");

            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                }
              });
            });
          } else if (olddata.price < house.price) {
            // console.log("greater than original value");
            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                }
              });
            });
          } else {
            let newupdatedvalues = {
              $set: { ...house },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);
          }
        } else {
          let newupdatedvalues = {
            $set: { ...house },
          };

          const option = { upsert: true };

          await HouseModel.updateMany(queryobject, newupdatedvalues, option);
        }
      });

      // console.log(karmaData.garageBays)
      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Finished updating Active Properties.");
        let misc_id = "63d1431106befa03ced8d876";
        MiscModel.findByIdAndUpdate(
          misc_id,
          { Date: Date.now() },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated Date : ", docs);
            }
          }
        );
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log(value);

      if (nextData) {
        reload(value);
      } else {
        console.log("An error occured.");
      }
    }

    await reload("0");

    // console.log("here we get the value",value)
  } catch (error: any) {
    console.log("Error in upsertcommingsoon : ", error.toString());
    return;
  }
};

//route 9 :- upsert data in mongodb active
export const upsertComingSoon = async () => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Coming Soon'",
          $top: 1000,
          $skip: skip,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
        return (
          value.PropertyType == "Residential"
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ListPrice,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //upsert functionality here
      data.forEach(async (house: any) => {
        let queryobject = {
          listingId: house.listingId,
        };

        let olddata: any = await HouseModel.findOne(queryobject);

        if (olddata) {
          if (olddata.price > house.price) {
            // console.log("smaller than original value");

            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                } else {
                }
              });
            });
          } else if (olddata.price < house.price) {
            // console.log("greater than original value");
            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                } else {
                }
              });
            });
          } else {
            let newupdatedvalues = {
              $set: { ...house },
            };

            const option = { upsert: true };

            await HouseModel.updateMany(queryobject, newupdatedvalues, option);
          }
        } else {
          let newupdatedvalues = {
            $set: { ...house },
          };

          const option = { upsert: true };

          await HouseModel.updateMany(queryobject, newupdatedvalues, option);
        }
      });

      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Finished updating coming soon properties.");
        let misc_id = "63d1431106befa03ced8d876";
        MiscModel.findByIdAndUpdate(
          misc_id,
          { Date: Date.now() },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated Date : ", docs);
            }
          }
        );
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log(value);

      if (nextData) {
        reload(value);
      } else {
        console.log("An error occured.");
      }
    }

    await reload("0");
  } catch (error: any) {
    console.log(
      "An error occured while running upsert for Coming Soon Properties.",
      error.toString()
    );
    return;
  }
};

export const upsertClosed = async () => {
  try {
    async function reload(skip: string) {
      const response = await axios.get("https://api.mlsgrid.com/v2/Property", {
        params: {
          $filter:
            "OriginatingSystemName eq 'carolina' and MlgCanView eq true and StandardStatus eq 'Closed'",
          $top: 1000,
          $skip: skip,
        },
        headers: {
          "Accept-Encoding": "gzip,deflate",
          Authorization: process.env.MLS_TOKEN,
        },
      });

      let commonData = response.data;

      let karmaData = commonData.value.filter((value: any) => {
       
        return (
          value.PropertyType == "Residential" &&
          moment(value.CloseDate).isAfter(
            moment().startOf("year").subtract(3, "year")
          )
        );
      });

      // filtering data from api and stored in karmaData
      let data = karmaData.map((house: any) => {
        return {
          appliances: house.Appliances,
          associationFee: house.AssociationFee,
          associationName: house.AssociationName,
          availabilityDate: house.AvailabilityDate,
          bathroomsFull: house.BathroomsFull,
          bathroomsHalf: house.BathroomsHalf,
          bathroomsTotalInteger: house.BathroomsTotalInteger,
          bedroomsTotal: house.BedroomsTotal,
          sqFtBasement: house.BelowGradeFinishedArea,
          buildingAreaTotal: house.BuildingAreaTotal,
          buyerAgencyCompensation: house.BuyerAgencyCompensation,
          sellingAgentMLSBoard: house.BuyerAgentAOR,
          sellingAgentFullName: house.BuyerAgentFullName,
          sellingOfficeName: house.BuyerOfficeName,
          sellingOfficePhone: house.BuyerOfficePhone,
          additionalInformation: house.CAR_AdditionalInformation,
          auctionBidInformation: house.CAR_AuctionBidInformation,
          auctionBidType: house.CAR_AuctionBidType,
          auctionYn: house.CAR_AuctionYN,
          ceilingHeight: house.CAR_CeilingHeight,
          price: house.ClosePrice,
          closePrice: house.ClosePrice,
          closeDate: house.CloseDate,
          constructionStatus: house.CAR_ConstructionStatus,
          constructionType: house.CAR_ConstructionType,
          coSellingTeamMUI: house.CAR_CoSellingTeam_MUI,
          coSellingTeamMLSID: house.CAR_CoSellingTeamMLSID,
          coSellingTeamName: house.CAR_CoSellingTeamName,
          financingInformation: house.CAR_FinancingInformation,
          hoaSubjectToDues: house.CAR_HOASubjectToDues,
          garageBays: house.CAR_NumberOfBays,
          officeSqFt: house.CAR_OfficeSqFt,
          porch: house.CAR_Porch,
          potentialIncome: house.CAR_PotentialIncome,
          sqFtGarage: house.CAR_SqFtGarage,
          sqFtTotal: house.CAR_TotalPrimaryHLA,
          coSellingAgentMLSBoard: house.CoBuyerAgentAOR,
          coSellingAgentPrimaryBoard: house.CoBuyerAgentAOR,
          coSellingAgentFullName: house.CoBuyerAgentFullName,
          coSellingAgentMUI: house.CoBuyerAgentKey,
          coSellingAgentMLSID: house.CoBuyerAgentMlsId,
          coSellingAgentDirectWorkPhone: house.CoBuyerAgentOfficePhone,
          coSellingOfficeMUI: house.CoBuyerOfficeKey,
          coSellingOfficeMLSID: house.CoBuyerOfficeMlsId,
          coSellingOfficeName: house.CoBuyerOfficeName,
          coSellingOfficePhone: house.CoBuyerOfficePhone,
          coListAgentMLSBoard: house.CoListAgentAOR,
          coListAgentPrimaryBoard: house.CoListAgentAOR,
          coListAgentFullName: house.CoListAgentFullName,
          coListAgentMUI: house.CoListAgentKey,
          coListAgentMLSID: house.CoListAgentMlsId,
          coListAgentDirectWorkPhone: house.CoListAgentPreferredPhone,
          coListOfficeMUI: house.coListOfficeKey,
          coListOfficeMLSID: house.CoListOfficeMlsId,
          coListOfficeName: house.CoListOfficeName,
          communityFeatures: house.CommunityFeatures,
          sellerContribution: house.ConcessionsAmount,
          countyOrParish: house.CountyOrParish,
          cumulativeDaysOnMarket: house.CumulativeDaysOnMarket,
          daysOnMarket: house.DaysOnMarket,
          elementarySchool: house.ElementarySchool,
          highSchool: house.HighSchool,
          latitude: house.Latitude,
          listingAgentMLSBoard: house.ListAgentAOR,
          listingAgentPrimaryBoard: house.ListAgentAOR,
          listAgentDirectWorkPhone: house.ListAgentDirectPhone,
          listAgentFullName: house.ListAgentFullName,
          listAgentMUI: house.ListAgentKey,
          listAgentMLSID: house.ListAgentMlsId,
          listingType: house.ListingAgreement,
          listingContractDate: house.ListingContractDate,
          listingId: house.ListingId,
          longitude: house.Longitude,
          lastChangeTimestamp: house.MajorChangeTimestamp,
          middleOrJuniorSchool: house.MiddleOrJuniorSchool,
          newConstructionYN: house.NewConstructionYN,
          modificationTimestamp: house.OriginatingSystemModificationTimestamp,
          parking: house.ParkingFeatures,
          parkingTotal: house.ParkingTotal,
          propertySubType: house.PropertySubType,
          propertyType: house.PropertyType,
          publicRemarks: house.PublicRemarks,
          streetName: house.StreetName,
          streetNumber: house.StreetNumber,
          subdivisionName: house.SubdivisionName,
          waterSource: house.WaterSource,
          yearBuilt: house.YearBuilt,
          description: house.LongDescription,
          accessibilityFeatures: house.AccessibilityFeatures,
          builderName: house.BuilderName,
          numberOfCompletedUnitsTota: house.CAR_NumberOfCompletedUnitsTotal,
          numberOfDocksTotal: house.CAR_NumberOfDocksTotal,
          numberOfDriveInDoorsTotal: house.CAR_NumberOfDriveInDoorsTotal,
          numberOfProjectedUnitsTotal: house.CAR_NumberOfProjectedUnitsTotal,
          sqFtMain: house.CAR_SqFtMain,
          sqFtMaximumLease: house.CAR_SqFtMaximumLease,
          sqFtMinimumLease: house.CAR_SqFtMinimumLease,
          sqFtThird: house.CAR_SqFtThird,
          sqFtUpper: house.CAR_SqFtUpper,
          streetViewParam: house.CAR_StreetViewParam,
          city: house.City,
          directions: house.Directions,
          fireplaceYN: house.FireplaceYN,
          furnished: house.Furnished,
          laundryFeatures: house.LaundryFeatures,
          livingArea: house.LivingArea,
          originalListPrice: house.OriginalListPrice,
          postalCode: house.PostalCode,
          taxAssessedValue: house.TaxAssessedValue,
          virtualTourURLUnbranded: house.VirtualTourURLUnbranded,
          exteriorFeatures: house.ExteriorFeatures,
          lotSizeArea: house.LotSizeArea,
          lotSizeUnits: house.LotSizeUnits,
          standardStatus: house.StandardStatus,
          address:
            house.StreetNumber?.trim() +
            " " +
            house.StreetName?.trim() +
            " " +
            house.StreetSuffix?.trim() +
            " " +
            house.City?.trim() +
            " NC " +
            house.PostalCode,
          highschool: house.MiddleOrJuniorSchool,
          sewer: house.Sewer,
          air: house.Cooling,
          fireplace: house.Heating,
          siding: house.ConstructionMaterials,
          flooring: house.Flooring,
          listinghistorydata: [
            {
              originalListPrice: house.OriginalListPrice,
              listingContractDate: house.ListingContractDate,
              newprice: house.ListPrice,
              lastChangeTimestamp: house.OriginatingSystemModificationTimestamp,
            },
          ],
          masterBedroomLevel:
            house.Rooms?.find(
              (room: any) =>
                room.CAR_RoomTypes &&
                room.CAR_RoomTypes.includes("Primary Bedroom")
            )?.RoomLevel || "",
          media: house.Media
            ? house.Media.map((el: any) => ({
                longDescription: el.LongDescription,
                mediaKey: el.MediaKey,
                order: el.Order,
                mediaURL: el.MediaURL,
              }))
            : [],
          rooms: house.Rooms
            ? house.Rooms.map((el: any) => ({
                bathsFull: el.CAR_BathsFull,
                bathsHalf: el.CAR_BathsHalf,
                bedsTotal: el.CAR_BedsTotal,
                roomKey: el.RoomKey,
                roomLevel: el.RoomLevel,
                roomTypes: el.CAR_RoomTypes,
              }))
            : [],
        };
      });

      //upsert functionality here
      data.forEach(async (house: any) => {
        let queryobject = {
          listingId: house.listingId,
        };

        let olddata: any = await SoldHouseModel.findOne(queryobject);

        if (olddata) {
          if (olddata.price > house.price) {
            // console.log("smaller than original value");

            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await SoldHouseModel.updateMany(queryobject, newupdatedvalues, option);

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                } else {
                }
              });
            });
          } else if (olddata.price < house.price) {
            // console.log("greater than original value");
            let newlistinghistory = {
              originalListPrice: house.originalListPrice,
              listingContractDate: house.listingContractDate,
              newprice: house.price,
              lastChangeTimestamp: house.lastChangeTimestamp,
            };

            let arrNew = [...olddata.listinghistorydata, newlistinghistory];

            let newupdatedvalues = {
              $set: { ...house, listinghistorydata: arrNew },
            };

            const option = { upsert: true };

            await SoldHouseModel.updateMany(
              queryobject,
              newupdatedvalues,
              option
            );

            let userdata = await PuuModel.find();

            userdata.map((value) => {
              value.houseids.map((ids) => {
                if (ids == house.listingId) {
                  addToEmailQueue({
                    email: value.email,
                    ogprice: olddata.price,
                    price: house.originalListPrice,
                  });
                } else {
                }
              });
            });
          } else {
            let newupdatedvalues = {
              $set: { ...house },
            };

            const option = { upsert: true };

            await SoldHouseModel.updateMany(
              queryobject,
              newupdatedvalues,
              option
            );
          }
        } else {
          let newupdatedvalues = {
            $set: { ...house },
          };

          const option = { upsert: true };

          await SoldHouseModel.updateMany(
            queryobject,
            newupdatedvalues,
            option
          );
        }
      });

      let nextData = commonData["@odata.nextLink"];

      if (typeof nextData === "undefined") {
        console.log("Finished updating coming soon properties.");
        let misc_id = "63d1431106befa03ced8d876";
        MiscModel.findByIdAndUpdate(
          misc_id,
          { Date: Date.now() },
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated Date : ", docs);
            }
          }
        );
        return;
      }

      let value = nextData.substring(nextData.lastIndexOf("=") + 1);

      console.log(value);

      if (nextData) {
        reload(value);
      } else {
        console.log("An error occured.");
      }
    }

    await reload("0");
  } catch (error: any) {
    console.log(
      "An error occured while running upsert for Coming Soon Properties.",
      error.toString()
    );
    return;
  }
};

// cron functionality to run after 15 minutes
export const runupsert = async (req: Request, res: Response) => {
  try {
    await addToUpsertQueue();
    res.status(200).json("successfully executed");
    return;
  } catch (error) {
    res.send(500).json("some error occured");
    return;
  }
};

// cron.schedule("*/2 * * * *", async () => {
//   upsertActive();
// });

// cron.schedule("*/25 * * * *", () => {
//   upsertActiveunderContract();
// });

// cron.schedule("*/37 * * * *", () => {
//   upsertComingSoon();
// });
