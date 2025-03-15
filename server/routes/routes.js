
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const transactionController = require("../controllers/transactionController")
const orderController = require("../controllers/orderController")
const bidController = require("../controllers/bidController")
const marketPriceController = require("../controllers/marketPriceController")
const sellOrderController = require("../controllers/sellOrderController")

router.post("/register", authController.register);
router.post("/login", authController.login)
router.post("/balance", authController.checkWalletBalance);

router.post("/buy", transactionController.buyTokens);
router.post("/sell", transactionController.sellTokens);

router.post("/order", orderController.placeOrder)
router.get("/listorder", orderController.getAllOrders)
router.post("/buyexecute", orderController.executeBuy)

router.post("/placebid", bidController.placeBid);
router.post("/listbid", bidController.viewBids);
router.post("/bidbywallet", bidController.getBidsByWallet);

router.get("/getmarketprice", marketPriceController.getMarketPrice)

router.post("/approve", sellOrderController.approveTokens)
router.post("/sellorder", sellOrderController.createSellOrder)

module.exports = router;
