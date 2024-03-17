import { Request, Response } from "express";
import HouseModel from "../models/house";

export const neighbourHoodSummary = async (req: Request, res: Response) => {
  const { month, subdivision }: any = req.body;

  let response = await HouseModel.find({
    newConstructionYN: true,
    subdivisionName: subdivision,
    standardStatus: "Closed",
    propertySubType: "Single Family Residence",
   })
    .lean()
    .select("modificationTimestamp price sqFtTotal _id");

  if (response.length > 0) {
    let data = response;

    var compdate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - month,
      new Date().getDate()
    );

    // console.log(response.length)
    // console.log(compdate)
    let newData = data.filter((val: any) => {
      return val.modificationTimestamp > compdate;
    });

    let priceArray = newData.map((val: any) => parseInt(val.price));

    let sqftArray = newData.map((val: any) => {
      if (val.price > 0 && val.price != undefined && val.sqFtTotal != 0 && val.sqFtTotal != undefined) {
        return Math.floor(parseInt(val.price!) / parseInt(val.sqFtTotal!));
      }
    });

    // console.log(sqftArray);

    let finalPriceArray:any = priceArray.sort();
    let finalSqftArray:any = sqftArray.sort();

    // console.log(finalPriceArray, finalSqftArray)

    let medainprice =
      finalPriceArray.length > 1
        ? finalPriceArray[Math.floor((finalPriceArray.length + 1) / 2)]
        : finalPriceArray[0];

    let medainsqft =
      finalSqftArray.length > 1
        ? finalSqftArray[Math.floor((finalPriceArray.length + 1) / 2)]
        : finalSqftArray[0];

    let houseids = newData.map((val: any) => val._id);

    // console.log(finalPriceArray[0] , finalPriceArray[finalPriceArray.length - 1])
    // console.log(finalSqftArray[0] , finalSqftArray[finalSqftArray.length - 1]);

    res.json({
      medainprice: medainprice,
      startpricearray: Math.min(...finalPriceArray),
      endpricearray: Math.max(...finalPriceArray),
      medainsqft: medainsqft,
      startsqft: finalSqftArray[0],
      endsqft: Math.max(...finalSqftArray),
      data: houseids,
    });
  } else {
    res.json(false);
  }
};

export const getNeighbourHoodHouses = async (req: Request, res: Response) => {
  try {
    const { arraysOfIds }: any = req.body;

    let data = await HouseModel.find({
      _id: { $in: arraysOfIds },
    });

    if (data.length > 0) {
      res.json(data);
    } else {
      res.json("No data found");
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//main function for zipcode trend
export const zipCodeTrends = async (req: Request, res: Response) => {
  try {
    //Taking zipcode as an data
    const { zipcode }: any = req.body;

    //Declare year or month like 9 months.
    var compDate = new Date(
      new Date().getFullYear() - 3,
      0,
      1
    );

    //Declare year or month like 6 months.
    let compDate2 = new Date(
      new Date().getFullYear() - 2,
      0,
      1
    );

    //Declare year or month like 3 months.
    let compDate3 = new Date(
      new Date().getFullYear() - 1,
      0,
      1,
    );

    //Declare year or month
    let compDate4 = new Date(
      new Date().getFullYear(),
       0,
      1,
    );

    

    //Real Estate Trends Part Start here
    let responseForActive = await HouseModel.find({
      standardStatus: "Active",
      propertySubType: "Single Family Residence",
      postalCode: zipcode,
    }).lean().select("modificationTimestamp price sqFtTotal");

    let responseForUnderContract = await HouseModel.find({
      standardStatus: "Active Under Contract",
      propertySubType: "Single Family Residence",
      postalCode: zipcode,
    }).lean().select("modificationTimestamp price sqFtTotal");

    // console.log(responseForActive.length, responseForUnderContract.length);

    let newActiveData = responseForActive.filter((val: any) => {
      return val.modificationTimestamp > compDate;
    });

    let newUnderContract = responseForUnderContract.filter((val: any) => {
      return val.modificationTimestamp > compDate;
    });

    //DATA BETWEEN 2020 - 2021
    let dataForActive2020 = newActiveData.filter((val: any) => {
      return val.modificationTimestamp < compDate2;
    });

    let dataforUnderContrac2020 = newUnderContract.filter((val: any) => {
      return val.modificationTimestamp < compDate2;
    });

    //DATA BETWEEN 2021 - 2022
    let dataForActive2021 = newActiveData.filter((val: any) => {
      return (
        val.modificationTimestamp > compDate2 &&
        val.modificationTimestamp < compDate3
      );
    });

    let dataforUnderContrac2021 = newUnderContract.filter((val: any) => {
      return (
        val.modificationTimestamp > compDate2 &&
        val.modificationTimestamp < compDate3
      );
    });

    //DATA BETWEEN 2022 - 2023
    let dataForActive2022 = newActiveData.filter((val: any) => {
      return (
        val.modificationTimestamp > compDate3 &&
        val.modificationTimestamp < compDate4
      );
    });

    let dataforUnderContrac2022 = newUnderContract.filter((val: any) => {
      return (
        val.modificationTimestamp > compDate3 &&
        val.modificationTimestamp < compDate4
      );
    });
    //Real Estate Trends Part Ends here

    //getiing data from database
    let responseForPreviouslyOwnedHomes = await HouseModel.find({
      standardStatus: "Closed",
      postalCode: zipcode,
    }).lean().select("modificationTimestamp price sqFtTotal");

    let responseForNewConstructionHomes = await HouseModel.find({
      standardStatus: "Closed",
      postalCode: zipcode,
      newConstructionYN: true,
    }).lean().select("modificationTimestamp price sqFtTotal");

    //Filtering data after 2020
    let filteredDataPrevOwnHouse = responseForPreviouslyOwnedHomes.filter(
      (val: any) => {
        return val.modificationTimestamp > compDate;
      }
    );

    let filteredDataNewConstHouse = responseForNewConstructionHomes.filter(
      (val: any) => {
        return val.modificationTimestamp > compDate;
      }
    );

    //FINDING DATA BETWEEN comdate and compdate2 starts here
    let threeYearsDataPrevOwnHouse = filteredDataPrevOwnHouse.filter(
      (val: any) => {
        return (
          val.modificationTimestamp > compDate &&
          val.modificationTimestamp < compDate2
        );
      }
    );

    let threeYearsDataNewConstHouse = filteredDataNewConstHouse.filter(
      (val: any) => {
        return (
          val.modificationTimestamp > compDate &&
          val.modificationTimestamp < compDate2
        );
      }
    );

    let priceArrayDataPrevOwnHouse = threeYearsDataPrevOwnHouse
      .map((val: any) => val.price)
      .sort();

    let priceArrayDataNewConstHouse = threeYearsDataNewConstHouse
      .map((val: any) => val.price)
      .sort();

    //sqft sort part
    let sqftArrayDataPrevOwnHouse = threeYearsDataPrevOwnHouse
      .map((val: any) => Math.floor(val.price / val.sqFtTotal))
      .sort();

    let sqftArrayDataNewConstHouse = threeYearsDataNewConstHouse
      .map((val: any) => Math.floor(val.price / val.sqFtTotal))
      .sort();

    let medianMonthlyPrevOwnHouse =
      sqftArrayDataPrevOwnHouse.length > 1
        ? sqftArrayDataPrevOwnHouse[
            Math.floor((sqftArrayDataPrevOwnHouse.length + 1) / 2)
          ]
        : sqftArrayDataPrevOwnHouse[0];

    let medianMonthlyNewConstHouse =
      sqftArrayDataNewConstHouse.length > 1
        ? sqftArrayDataNewConstHouse[
            Math.floor((sqftArrayDataNewConstHouse.length + 1) / 2)
          ]
        : sqftArrayDataNewConstHouse[0];

    let medianforPrevOwnHouse2020 =
      priceArrayDataPrevOwnHouse.length > 1
        ? priceArrayDataPrevOwnHouse[
            Math.floor((priceArrayDataPrevOwnHouse.length + 1) / 2)
          ]
        : priceArrayDataPrevOwnHouse[0];

    let medianforNewConstHouse2020 =
      priceArrayDataNewConstHouse.length > 1
        ? priceArrayDataNewConstHouse[
            Math.floor((priceArrayDataNewConstHouse.length + 1) / 2)
          ]
        : priceArrayDataNewConstHouse[0];
    //FINDING DATA BETWEEN comdate and compdate2 ends here

    let twoYearsDataPrevOwnHouse = filteredDataPrevOwnHouse.filter(
      (val: any) => {
        return (
          val.modificationTimestamp > compDate2 &&
          val.modificationTimestamp < compDate3
        );
      }
    );

    let twoYearsDataNewConstHouse = filteredDataNewConstHouse.filter(
      (val: any) => {
        return (
          val.modificationTimestamp > compDate2 &&
          val.modificationTimestamp < compDate3
        );
      }
    );

    let priceArrayDataPrevOwnHouse2 = twoYearsDataPrevOwnHouse
      .map((val: any) => val.price)
      .sort();

    let priceArrayDataNewConstHouse2 = twoYearsDataNewConstHouse
      .map((val: any) => val.price)
      .sort();

    //sqft sort part
    let sqftArrayDataPrevOwnHouse2 = twoYearsDataPrevOwnHouse
      .map((val: any) => Math.floor(val.price / val.sqFtTotal))
      .sort();

    let sqftArrayDataNewConstHouse2 = twoYearsDataNewConstHouse
      .map((val: any) => Math.floor(val.price / val.sqFtTotal))
      .sort();

    let medianMonthlyPrevOwnHouse2 =
      sqftArrayDataPrevOwnHouse2.length > 1
        ? sqftArrayDataPrevOwnHouse2[
            Math.floor((sqftArrayDataPrevOwnHouse2.length + 1) / 2)
          ]
        : sqftArrayDataPrevOwnHouse2[0];

    let medianMonthlyNewConstHouse2 =
      sqftArrayDataNewConstHouse2.length > 1
        ? sqftArrayDataNewConstHouse2[
            Math.floor((sqftArrayDataNewConstHouse2.length + 1) / 2)
          ]
        : sqftArrayDataNewConstHouse2[0];

    let medianforPrevOwnHouse2021 =
      priceArrayDataPrevOwnHouse2.length > 1
        ? priceArrayDataPrevOwnHouse2[
            Math.floor((priceArrayDataPrevOwnHouse2.length + 1) / 2)
          ]
        : priceArrayDataPrevOwnHouse2[0];

    let medianforNewConstHouse2021 =
      priceArrayDataNewConstHouse2.length > 1
        ? priceArrayDataNewConstHouse2[
            Math.floor((priceArrayDataNewConstHouse2.length + 1) / 2)
          ]
        : priceArrayDataNewConstHouse2[0];

    //FINDING DATA BETWEEN 2022 AND 2023 = 2022
    let YearsDataPrevOwnHouse = filteredDataPrevOwnHouse.filter((val: any) => {
      return (
        val.modificationTimestamp > compDate3 &&
        val.modificationTimestamp < compDate4
      );
    });

    let YearsDataNewConstHouse = filteredDataNewConstHouse.filter(
      (val: any) => {
        return (
          val.modificationTimestamp > compDate3 &&
          val.modificationTimestamp < compDate4
        );
      }
    );

    let priceArrayDataPrevOwnHouse3 = YearsDataPrevOwnHouse.map(
      (val: any) => val.price
    ).sort();

    let priceArrayDataNewConstHouse3 = YearsDataNewConstHouse.map(
      (val: any) => val.price
    ).sort();

    //sqft sort part
    let sqftArrayDataPrevOwnHouse3 = YearsDataPrevOwnHouse.map((val: any) =>
      Math.floor(val.price / val.sqFtTotal)
    ).sort();

    let sqftArrayDataNewConstHouse3 = YearsDataNewConstHouse.map((val: any) =>
      Math.floor(val.price / val.sqFtTotal)
    ).sort();

    let medianMonthlyPrevOwnHouse3 =
      sqftArrayDataPrevOwnHouse3.length > 1
        ? sqftArrayDataPrevOwnHouse3[
            Math.floor((sqftArrayDataPrevOwnHouse3.length + 1) / 2)
          ]
        : sqftArrayDataPrevOwnHouse3[0];

    let medianMonthlyNewConstHouse3 =
      sqftArrayDataNewConstHouse3.length > 1
        ? sqftArrayDataPrevOwnHouse3[
            Math.floor((sqftArrayDataNewConstHouse3.length + 1) / 2)
          ]
        : sqftArrayDataNewConstHouse3[0];

    // console.log(averageMonthlyPrevOwnHouse3, averageMonthlyNewConstHouse3);

    let medianforPrevOwnHouse2022 =
      priceArrayDataPrevOwnHouse3.length > 1
        ? priceArrayDataPrevOwnHouse3[
            Math.floor((priceArrayDataPrevOwnHouse3.length + 1) / 2)
          ]
        : priceArrayDataPrevOwnHouse3[0];

    let medianforNewConstHouse2022 =
      priceArrayDataNewConstHouse3.length > 1
        ? priceArrayDataNewConstHouse3[
            Math.floor((priceArrayDataNewConstHouse3.length + 1) / 2)
          ]
        : priceArrayDataNewConstHouse3[0];

    // console.log(compDate, compDate2, compDate3, compDate4);

    res.json({
      realestatetrends: {
        totallhouse2020:
          dataForActive2020.length + dataforUnderContrac2020.length,
        activehouses2020: dataForActive2020.length,
        undercontracthouses2020: dataforUnderContrac2020.length,
        totallhouse2021:
          dataForActive2021.length + dataforUnderContrac2021.length,
        activehouses2021: dataForActive2021.length,
        undercontracthouses2021: dataforUnderContrac2021.length,
        totallhouse2022:
          dataForActive2022.length + dataforUnderContrac2022.length,
        activehouses2022: dataForActive2022.length,
        undercontracthouses2022: dataforUnderContrac2022.length,
      },
      medianprices: {
        medianforPrevOwnHouse2020: medianforPrevOwnHouse2020,
        medianforNewConstHouse2020: medianforNewConstHouse2020,
        medianforPrevOwnHouse2021: medianforPrevOwnHouse2021,
        medianforNewConstHouse2021: medianforNewConstHouse2021,
        medianforPrevOwnHouse2022: medianforPrevOwnHouse2022,
        medianforNewConstHouse2022: medianforNewConstHouse2022,
      },
      mediansqft: {
        medianMonthlyPrevOwnHouse2020: medianMonthlyPrevOwnHouse,
        medianMonthlyNewConstHouse2020: medianMonthlyNewConstHouse,
        medianMonthlyPrevOwnHouse2021: medianMonthlyPrevOwnHouse2,
        medianMonthlyNewConstHouse2021: medianMonthlyNewConstHouse2,
        medianMonthlyPrevOwnHouse2022: medianMonthlyPrevOwnHouse3,
        medianMonthlyNewConstHouse2022: medianMonthlyNewConstHouse3,
      },
      avgmonthlyhomesale: {
        avgforprevownhouse2020: Math.ceil(
          threeYearsDataPrevOwnHouse.length / 12
        ),
        avgforNewConstHouse2020: Math.ceil(
          threeYearsDataNewConstHouse.length / 12
        ),
        avgforprevownhouse2021: Math.ceil(twoYearsDataPrevOwnHouse.length / 12),
        avgforNewConstHouse2021: Math.ceil(
          twoYearsDataNewConstHouse.length / 12
        ),
        avgforprevownhouse2022: Math.ceil(YearsDataPrevOwnHouse.length / 12),
        avgforNewConstHouse2022: Math.ceil(YearsDataNewConstHouse.length / 12),
      },
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
