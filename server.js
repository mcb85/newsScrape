var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;


var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

var MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines9";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Routes

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/savedArticles", function (req, res) {
    res.render("savedArticles");
});


    app.get("/scrape", function (req, res) {
       
        axios.get("https://www.orlandosentinel.com/news/breaking-news").then(function (response) {
           
            var $ = cheerio.load(response.data);

            $("div.width-100.flex-container-column.flex.river").each(function (i, element) {
                
                var result = {};
              console.log($(this));
              result.title = $(this).find("a.no-u").text();
              let linkName = "https://www.orlandosentinel.com" + $(this).find("a.no-u").attr("href");
              result.link = "<a class=\"text-white target=\"blank\" href=\"https://www.orlandosentinel.com" +
                $(this).find("a.no-u").attr("href") + "\"" + ">" + linkName + "</a>";
              result.summary = $(this).find("p.preview-text").text();
                
        
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.send("Scrape Complete");
        });
    });

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.get("/articles/:id", function (req, res) {
  
  db.Article.findOne({ _id: req.params.id })
    
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});


app.post("/savedArticles/:id", function (req, res) {
  console.log("saving article" + req.params.id);
    db.Article.findOne({ _id: req.params.id })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
})

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
