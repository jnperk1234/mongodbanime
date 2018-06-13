var express = require ('express');
var app = express();
var bodyParser= require('body-parser');
var mongoose =  require ('mongoose');
var request =require ('request');
var cheerio = require ('cheerio')
var logger = ('morgan');

var Article = require ("./models/Article.js");
var Note = require ('./models/Note.js');

mongoose.Promise = Promise;

var app = express();

var PORT = process.env.PORT || 3000;

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
        extended: false
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost/mongoosescraper');
var db = mongoose.connection;

db.on("error", function(error){
    console.log("Mongoose Error: ", error);
});

db.once("open", function(){
    console.log ("Mongoose connection sucessful.");
});

//Routes

//GET request to scrape echojs
app.get("/scrape", function(request, result){
    //Grab html body
    request("https://kotaku.com/", function(error, response, html){
        var $ = cheerio.load(html);
    $("ul.headlineStack_list li").each(function(i, element){
        var result = {};
    result.title = $(this).children("a").text();
    result.link = $(this).children("a").attr("href");

    var entry = new Article(result);
    entry.save(function(err, doc){
        if (err) {
            console.log(err);
        }else{
            console.log(doc);
        }

            });
        });
    });

    res.send("Scrape Complete");
});

app.get("/articles", function(req, res){
    Article.find({}, function(error, doc){
        if(error) {
            console.log(error);
        }else {
            res.JSON(doc);
        }

    });
});

app.get("/articles/:id", function(req, res){
    Article.findOne({"_id": req.params.id })
    .populate('note')
    .exec(function(error, doc){
        if(error) {
            console.log(error);
        }else{
            res.JSON
        };
    });
});

app.POST("/articles/:id", function(req, res){
    var newNote = new Note(req.body);
    newNote.save(function(error){
        if(error) {
            console.log(error);
        }else {
            Article.findOneAndUpdate({"_id" : req.params.id}, { "note": doc.id})
            .exec(function(err, doc){
                if(err) {
                    console.log(err);
                }else{
                    res.send(doc);
                }
            });
        }
    });
});