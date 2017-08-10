var router = require("express").Router();
var mixController = require("./controllers/mixController");

router.post("/mix", mixController.addToQueue);
router.get("/mix", mixController.getMaxSpend);

module.exports = router;
