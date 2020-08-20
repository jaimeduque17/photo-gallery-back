const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Picture = require("../models/picture");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.pictureById = (req, res, next, id) => {
    Picture.findById(id)
        .populate("album")
        .exec((err, picture) => {
            if (err || !picture) {
                return res.status(400).json({
                    err: "Picture not found"
                });
            }
            req.picture = picture;
            next();
        });
};

exports.read = (req, res) => {
    req.picture.photo = undefined;
    return res.json(req.picture);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                err: "Image couldn't be uploaded"
            });
        }

        // check for all fields
        const { name, album } = fields;

        if (!name || !album) {
            return res.status(400).json({
                err: "All fields are required"
            });
        }

        let picture = new Picture(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    err: "Image should be less than 1mb in size"
                });
            }

            picture.photo.data = fs.readFileSync(files.photo.path);
            picture.photo.contentType = files.photo.type;
        }

        picture.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    err: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.remove = (req, res) => {
    let picture = req.picture;
    picture.remove((err, deletedPicture) => {
        if (err) {
            return res.status(400).json({
                err: errorHandler(err)
            });
        }
        res.json({
            // deletedPicture, <-- show me all the information of the deleted picture
            "message": "Picture deleted successfully"
        });
    })
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                err: "Image couldn't be uploaded"
            });
        }

        let picture = req.picture;
        picture = _.extend(picture, fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.photo) {

            if (files.photo.size > 1000000) {
                return res.status(400).json({
                    err: "Image should be less than 1mb in size"
                });
            }

            picture.photo.data = fs.readFileSync(files.photo.path);
            picture.photo.contentType = files.photo.type;
        }

        picture.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    err: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

// if no params are sent, then all pictures are returned
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Picture.find()
        .select("-photo")
        .populate("album")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, pictures) => {
            if (err) {
                return res.status(400).json({
                    err: "Picture not found"
                });
            }
            res.json(pictures);
        });
};

// it will find the pictures based on the album and the search form
exports.listSearch = (req, res) => {
    // create query object to hold search value and album value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: "i" }
        // assign album value to query.album
        if (req.query.album && req.query.album != "All") {
            query.album = req.query.album
        }
        // find the picture based on query object with 2 properties
        // search and album
        Picture.find(query, (err, pictures) => {
            if (err) {
                return res.status(400).json({
                    err: errorHandler(err)
                });
            }
            res.json(pictures);
        }).select("-photo");
    }
}

// it will find the pictures based on the request picture album
// other pictures that have the same album, will be returned
exports.listRelated = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    // $ne means Not Included
    Picture.find({ _id: { $ne: req.picture }, album: req.picture.album })
        .limit(limit)
        .populate("album", "_id name")
        .exec((err, pictures) => {
            if (err) {
                return res.status(400).json({
                    err: "Pictures not found"
                });
            }
            res.json(pictures);
        });
};

exports.listAlbums = (req, res) => {
    Picture.distinct("album", {}, (err, albums) => {
        if (err) {
            return res.status(400).json({
                err: "Albums not found"
            });
        }
        res.json(albums);
    });
};

/**
 * list pictures by search
 * we will implement picture search in react frontend
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the pictures to users based on what he wants
 */

exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "filt") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Picture.find(findArgs)
        .select("-photo")
        .populate("album")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Pictures not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) => {
    if (req.picture.photo.data) {
        res.set("Content-Type", req.picture.photo.contentType);
        return res.send(req.picture.photo.data);
    }
    next();
};