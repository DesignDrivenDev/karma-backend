import express, { Router } from "express";

import {
  // fetchProperties,
  fetchById,
  fetchBySoldPropertiesId,
  fetchByProperties,
  loadPropertiesActiveUnderContract,
  loadPropertiesActive,
  loadPropertiesComingSoon,
  loadPropertiesClosed,
  fetchByAddress,
  runupsert,
} from "../controllers/properties";

import { contactDetails } from "../controllers/contact";
import { meetingDetails } from "../controllers/meeting";
import {
  userLogin,
  userSignup,
  getUser,
  addHouse,
  removeHouse,
  getlikedhouses,
  forgotPassword,
  resetPassword,
  addusertoupdate,
} from "../controllers/Usercontroller";
import { fetchuser } from "../middleware/fetchuser";
import {
  neighbourHoodSummary,
  zipCodeTrends,
  getNeighbourHoodHouses,
} from "../controllers/zipcodetrend";

const router = express.Router();

router.get("/runupsert", runupsert);
router.get(
  "/loadPropertiesActiveUnderContract",
  loadPropertiesActiveUnderContract
);
router.get("/loadPropertiesActive", loadPropertiesActive);
router.post("/fetchByAddress", fetchByAddress);
router.get("/loadPropertiesComingSoon", loadPropertiesComingSoon);
router.get("/loadPropertiesClosed", loadPropertiesClosed);
router.post("/fetchbyid/:id", fetchById);
router.post("/fetchbysoldid/:id", fetchBySoldPropertiesId);
router.post("/fetchbyproperties/:page", fetchByProperties);
router.post("/contact", contactDetails);
router.post("/signup", userSignup);
router.post("/login", userLogin);
router.post("/meeting", meetingDetails);
router.post("/getuser", fetchuser, getUser);
router.post("/addhouse", fetchuser, addHouse);
router.post("/removehouse", fetchuser, removeHouse);
router.post("/getlikedhouses", fetchuser, getlikedhouses);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);
router.post("/addusertoupdate", addusertoupdate);
router.post("/neighbourhoodSummary", neighbourHoodSummary);
router.post("/realestatetrends", zipCodeTrends);
router.post("/getNeighbourHoodHouses", getNeighbourHoodHouses);

export = router;
