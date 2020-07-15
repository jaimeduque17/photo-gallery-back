const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const pictureSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    album: {
        type: ObjectId,
        ref: 'Album',
        required: true,
    },
    photo: {
        data: Buffer,
        contentType: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Picture", pictureSchema);