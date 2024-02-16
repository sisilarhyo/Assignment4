/*********************************************************************************
*  WEB700 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name:Oluwademilade Jeleel Salami Student ID:125970228 Date: 02-16-2024
*
********************************************************************************/ 

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
// Require the collegeData module from the modules folder
var collegeData = require("./modules/collegeData.js");

// Call the initialize function before setting up the routes
collegeData.initialize().then(() => {
    console.log("Data initialized. Setting up the routes.");

    // Serve static files from the 'views' directory
    app.use(express.static(path.join(__dirname, 'views')));

    // Serve the home page directly from the views directory (remove the redirect)
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    });

    // Route for GET /students
    app.get("/students", (req, res) => {
        if (req.query.course) {
            collegeData.getStudentsByCourse(req.query.course)
                .then((students) => res.json(students))
                .catch(() => res.json({message: "no results"}));
        } else {
            collegeData.getAllStudents()
                .then((students) => res.json(students))
                .catch(() => res.json({message: "no results"}));
        }
    });

    // Route for GET /tas
    app.get("/tas", (req, res) => {
        collegeData.getTAs()
            .then((tas) => res.json(tas))
            .catch(() => res.json({message: "no results"}));
    });

    // Route for GET /courses
    app.get("/courses", (req, res) => {
        collegeData.getCourses()
            .then((courses) => res.json(courses))
            .catch(() => res.json({message: "no results"}));
    });
    // Route for GET /student/num
    app.get("/student/:num", (req, res) => {
        const studentNum = req.params.num;
        collegeData.getStudentByNum(studentNum)
            .then((student) => res.json(student))
            .catch(() => res.json({message: "no results"}));
    });


    // Route for GET /about
    app.get("/about", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'about.html'));
    });

    // Route for GET /htmlDemo
    app.get("/htmlDemo", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
    });

    // Catch-all route for handling unmatched routes
    app.use((req, res) => {
        res.status(404).send("Page Not Found");
    });

    // Start the server after the data has been initialized
    app.listen(HTTP_PORT, () => {
        console.log("Server listening on port: " + HTTP_PORT);
    });

}).catch(err => {
    console.error("Failed to initialize data:", err);
});