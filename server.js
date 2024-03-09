var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
app.use(express.static('public'));
var path = require("path");
// Require the collegeData module from the modules folder
var collegeData = require("./modules/collegeData.js");
 
// Add express.urlencoded middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
 
 
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
    // Route for GET /students/add
    app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
    });
 
 
    // Route for GET /about
    app.get("/about", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'about.html'));
    });
 
    // Route for GET /htmlDemo
    app.get("/htmlDemo", (req, res) => {
        res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
    });
    // Route for POST /students/add
    app.post("/students/add", (req, res) => {
        collegeData.addStudent(req.body)
            .then(() => {
                res.redirect("/students");
             })
            .catch(err => {
            // Handle errors appropriately
            console.log(err);
            res.status(500).send("Unable to save student data");
        });
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