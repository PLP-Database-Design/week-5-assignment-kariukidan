const express = require('express')
const app = express()

// DBMS Mysql
const mysql = require('mysql2');

// Question 1 goes here
// cross origin resource sharing - format webbrowser content
const cors = require('cors');
// environment variable
const dotenv = require('dotenv');

app.use(express.json());
app.use(cors());
dotenv.config();

// database configuration
// connecting to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// check connection
db.connect((err) => {
    if(err) return console.log("Error conectiong to MYSQL");

    console.log("Connected to MYSQL as id: ", db.threadId);
})

// GET Method

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/data', (req,res) =>{
    const patientsQuery = 'SELECT * FROM patients';
    const providersQuery = 'SELECT * FROM providers';
    
    // question 1 etrieves all patients and displays their: patientid, first name, last_name, date of birth
    db.query(patientsQuery, (err, patientresults) =>{
        if(err){
            console.error(err);
            return res.status(500).send('Error retrieving data from patients')
        }

        // displays all providers with their: first_name, last_name, provider_specialty
        db.query(providersQuery, (err, providerresults) =>{
            if(err){
                console.error(err);
                return res.status(500).send('Error retrieving data from providers')
            }
            res.render('data', {
              patients:patientresults,
              providers:providerresults
            });
        });       
    });
});

// Question 3 Filter patients by First Name

app.get('/patients/:firstName', (req, res) => {
    const firstName = req.params.firstName;  // Get the firstName from the URL parameter
    const query = 'SELECT * FROM patients WHERE first_name = ?';  // SQL query to filter patients by first name

    db.query(query, [firstName], (err, results) => {
        if (err) {
            console.error('Error retrieving patients by first name:', err);
            return res.status(500).send('Error retrieving patients by first name');
        }

        // Send the filtered patients as JSON
        res.json(results);
    });
});

// Question 4 Retrieve all providers by their specialty
app.get('/providers/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const query = 'SELECT * FROM providers WHERE provider_specialty = ?';

    db.query(query, [specialty], (err, results) => {
        if (err) {
            console.error('Error retrieving providers by specialty:', err);
            return res.status(500).send('Error retrieving providers by specialty');
        }
        res.json(results);
    });
});


// listen to the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`server is runnig on http://localhost:${PORT}`)

      // send message to browser
      console.log('Sending message to the browser...')
      app.get('/', (req,res) => {
          res.send('Server started successfully!!!');
      })
})