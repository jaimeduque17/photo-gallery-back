const express = require("express");
const router = express.Router();

const { create, albumById, read, update, remove, list } = require("../controllers/album");

router.post("/album/create", create);
router.get("/album/:albumId", read);
router.put("/album/:albumId", update);
router.delete("/album/:albumId", remove);
router.get("/albums", list);

router.param("albumId", albumById);

module.exports = router;