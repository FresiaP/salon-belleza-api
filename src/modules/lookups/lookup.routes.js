const express = require("express");
const router = express.Router();
const controller = require("./lookup.controller");
const auth = require("../../middleware/auth");
const validate = require("../../middleware/validate");

const { getLookupSchema } = require("./lookup.validation");

router.get("/", auth(), controller.getAvailableLookups);

router.get(
  "/:resource",
  auth(),
  validate(getLookupSchema),
  controller.getLookupOptions,
);

module.exports = router;
