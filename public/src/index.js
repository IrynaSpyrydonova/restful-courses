

const Joi = require('joi');
const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());

// Path to the file
COURSES_PATH =  __dirname + '/' + 'courses.json';


// GET METHOD
app.get('/', (req, res) => {
    fs.readFile(COURSES_PATH, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
    
        res.send(JSON.parse(data));
    });
});


// POST METHOD
app.post('/api/courses', (req, res)=>{
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    fs.readFile(COURSES_PATH, 'utf-8', (err, data) => {
        if (err)  return res.status(500).send(err.message);
        let courses = JSON.parse(data);
        console.log(courses);
        const course = {
            id: courses.length + 1,
            name: req.body.name
        };
        courses.push(course);
        res.send(course);
        let newData = JSON.stringify(courses, null, 2);
        
        fs.writeFile(COURSES_PATH, newData, (err) => {
            if (err) return res.status(500).send(err.message);
            console.log('Data written to file');
        });
    });
});

// PUT METHOD
app.put('/api/courses/:id', (req, res)=>{
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message);
  
    fs.readFile(COURSES_PATH, 'utf-8', (err, data) => {
        if (err) return res.status(500).send(err.message);
        let courses = JSON.parse(data);
        const course =courses.find(c => c.id === parseInt(req.params.id))

        if(!course) res.status(404).send('The course with the given ID was not found!');
        
        course.name=req.body.name;
        res.send(course);
        
        let updatedData = JSON.stringify(courses, null, 2);
        
        fs.writeFile(COURSES_PATH, updatedData, (err) => {
            if (err) return res.status(500).send(err.message);
            console.log('File is updated');
        });
    })
})

// VALIDATION
function validateCourse(course){
    const schema = Joi.object({ name: Joi.string() .min(3) .required() });
    return schema.validate(course);
}



// Port
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port} ...`));
