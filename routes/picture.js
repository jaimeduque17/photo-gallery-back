const express = require("express");
const router = express.Router();

const { create, pictureById, read, remove, update, list, listSearch, listRelated, listAlbums, listBySearch, photo } = require("../controllers/picture");

router.post("/picture/create", create);
router.get("/picture/:pictureId", read);
router.put("/picture/:pictureId", update);
router.delete("/picture/:pictureId", remove);

router.get("/pictures", list);
router.get("/pictures/search", listSearch);
router.get("/pictures/related/:pictureId", listRelated);
router.get("/pictures/albums", listAlbums);
router.post("/pictures/by/search", listBySearch);
router.get("/picture/photo/:pictureId", photo);

router.param("pictureId", pictureById);

module.exports = router;