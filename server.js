var express = require ('express');
var app = express();
var bodyParser= require('body-parser');
var mongoose =  require ('mongoose');
var request =require ('request');
var cheerio = require ('cheerio')
//var logger = ('morgan');
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({ defualtLayout: "main"}))
app.set("view engine", 'handlebars')

var Article = require ("./models/Article.js");
//var Note = require ('./models/Note.js');

mongoose.Promise = Promise;

var app = express();

var PORT = process.env.PORT || 3000;

//app.use(logger("dev"));
app.use(bodyParser.urlencoded({
        extended: false
}));

//app.use(express.static("public"));

mongoose.connect('mongodb://newuser1234:newuser1234@ds259620.mlab.com:59620/kotakuscrapper');
var db = mongoose.connection;

db.on("error", function(error){
    console.log("Mongoose Error: ", error);
});

db.once("open", function(){
    console.log ("Mongoose connection sucessful.");
});

//Routes
app.get('/', function(req, res){
    res.render("index")
})

//GET request to scrape echojs
app.get("/scrape", function(req, res){
    //Grab html body
    request("https://kotaku.com/", function(error, response, html){
    //     var $ = cheerio.load(html);
    // $("ul.headlineStack_list li").each(function(i, element){
    //     var result = {};
    // result.title = $(this).children("a").text();
    // result.link = $(this).children("a").attr("href");

    // var entry = new Article(result);
    // entry.save(function(err, doc){
    //     if (err) {
    //         console.log(err);
    //     }else{
    //         console.log(doc);
    //     }

    //         });
    //     });
    res.send(html);
    });

   
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

app.post("/articles/:id", function(req, res){
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

app.listen(PORT);