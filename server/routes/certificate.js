const express = require("express");
const router = express.Router();
const { sendCertificateEmail } = require("../controllers/Certificate");

// POST /sendCertificateEmail
router.post("/sendCertificateEmail", sendCertificateEmail);

module.exports = router;
