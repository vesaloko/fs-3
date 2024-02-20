require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(express.json())
morgan.token('request-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))
app.use(express.static('dist'))

const cors = require('cors')
const Person = require('./models/person.js')
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
  };

  app.use(requestLogger)

const errorHandler = (error, request, response, next) => {
                    console.error(error.message);
                  
                    if (error.name === 'CastError') {
                      return response.status(400).send({ error: 'Malformatted ID' });
                    } else if (error.name === 'ValidationError') {
                      return response.status(400).json({ error: error.message });
                    }
                  
                    next(error);
                  };
                  
                  app.use(errorHandler);


const mongoose = require('mongoose')

  
    app.get('/info', (request, response, next) => {
        Person.countDocuments({})
        .then(count => {
            const info = {
                message: `Phonebook has info for ${count} people`,
                timestamp: Date.now()
            };
            response.json(info);
        })
        .catch(error => next(error));
});

      app.get('/api/persons', (request, response, next) => {
        Person.find({})
        .then(persons => {
            response.json(persons);
        })
        .catch(error => {next(error)});
});


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (!person) {
            return response.status(404).json({ error: 'Person not found' });
        }
        response.json(person);
    })
    .catch(error => {next(error)});
});


      app.delete('/api/persons/:id', (request, response, next) => {
        Person.findByIdAndDelete(request.params.id)
        .then((deletedPerson) => {
            if (!deletedPerson) {
                return response.status(404).json({ error: 'Person not found' });
            }
            response.status(204).end();
        })
        .catch(error => next(error));
});
      

      app.post('/api/persons', (request, response, next) => {
        if (request.body.name === undefined || request.body.number === undefined) {
            response.status(400).json({ error: 'Missing fields in request' })
        }
        else {
            const { name, number } = request.body
            const person = { name, number }
            const newPerson = new Person(person);
          newPerson.save().then(savedPerson => {
            response.json(savedPerson)
      })
      .catch(error => {next(error)});
    }})


    app.put('/api/persons/:id', (request, response, next) => {
        const { name, number } = request.body
         const person = { name, number }

         Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
          .then(updatedPerson => {
            response.json(updatedPerson)
          })
          .catch(error => {next(error)})
      })
      

      const unknownEndpoint = (request, response) => {
        response.status(404).send({ error: 'unknown endpoint' })
      }
      
      app.use(unknownEndpoint)

      const PORT = process.env.PORT
      app.listen(PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`)
      })

