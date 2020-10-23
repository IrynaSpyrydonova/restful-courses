

const Joi = require('joi');
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// Path to the file
COURSES_PATH =  __dirname + '/' + 'courses.json';



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



// DELETE METHOD

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('The course with the given ID was not found!')

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

// VALIDATION
function validateCourse(course){
    const schema = Joi.object({ name: Joi.string() .min(3) .required() });
    return schema.validate(course);
}



// Port
const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port} ...`));
