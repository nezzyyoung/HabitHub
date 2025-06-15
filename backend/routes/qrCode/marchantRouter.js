const express = require('express')
const marchant_controller = require('../../controllers/qrcode/qrcode.controllers')
const marchantRouter = express.Router()

/**
 * Une route  permet de creer un qrcode d'un produit
 *@method POST
 * @url /qrcode/users/marchant/create
 */

 marchantRouter.post("/marchant/create", marchant_controller.createQrcode)

 /**
 * Une route  permet de recuperer code de qrcode et le verifier dans la base
 *@method POST
 * @url /qrcode/users/client/check/:code
 */

 marchantRouter.get("/client/check/:code", marchant_controller.checkQrcodeExist)

 module.exports=marchantRouter