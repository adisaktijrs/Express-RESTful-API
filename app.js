
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


/////////////////////////////////////////////////////////Req targetting all articles

app.route("/articles")
    .get((req, res) => {
        Article.find({}, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added new article.");
            } else {
                res.send(err);
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfullt deleted all articles.");
            } else {
                res.send(err);
            }
        });
    });


/////////////////////////////////////////////////////////Req targetting specific article

app.route("/articles/:articleTitle")
    .get((req, res) => {
        
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    });

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});