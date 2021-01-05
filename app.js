const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const homeStartingContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.";
const aboutContent = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source";
const contactContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true});

    const postSchema = {
        title: String,
        content: String
    };

    const Post = mongoose.model("Post", postSchema);

// let posts = [];

app.get("/", function(req, res){

    Post.find({}, function(err, posts){
        res.render("home", {
            startingContent: homeStartingContent,
            posts: posts
        });
    });
});

app.get("/about", function(req, res){
    res.render("about", {startingContent: aboutContent,});
});

app.get("/contact", function(req, res){
    res.render("contact", {startingContent: contactContent});
});

app.get("/compose", function(req, res){
    res.render("compose");
});

app.post("/compose", function(req,res){
    
    const post = new Post ({
        title: req.body.postTitle,
        content: req.body.postBody
    });

    post.save(function(err) {
        if (!err) {
            res.redirect("/");  
        }
    });
    
});

app.get("/posts/:postId", function(req, res){
    
    const requestedPostId = req.params.postId;
    
    Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {           
            title: post.title,
            content: post.content
        });
    });    
});

app.listen(3000, function(){
    console.log("app started at port 3000")
});