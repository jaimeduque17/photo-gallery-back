const Album = require("../models/album");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.albumById = (req, res, next, id) => {
    Album.findById(id).exec((err, album) => {
        if (err || !album) {
            return res.status(400).json({
                err: "Album doesn't exist"
            });
        }
        req.album = album;
        next();
    });
};

exports.create = (req, res) => {
    const album = new Album(req.body);
    album.save((err, data) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.read = (req, res) => {
    return res.json(req.album);
};

exports.update = (req, res) => {
    const album = req.album;
    album.name = req.body.name;
    album.save((err, data) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const album = req.album;
    album.remove((err, data) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json({
            message: "Album deleted"
        });
    });
};

exports.list = (req, res) => {
    Album.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json(data);
    });
};