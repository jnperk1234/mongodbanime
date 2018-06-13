var mongoose = require("mongoose");
var Schemea = mongoose.Schema;

var NoteSchema = new Schema ({
    title:{
        type: String
    }
});

var Note = mongoose.model("Note", NoteSchema);
module.exports = Note;