const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')

app.use(bodyParser.json())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
  };

  app.use(requestLogger)
  morgan.token("body", req => JSON.stringify(req.body));

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


let persons =[
      { 
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
    ]
  
    app.get('/info', (request, response, next) => {
        const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id)) 
        : 0

        let resp =
                `<div>
                    <p>Phonebook has info for ${maxId} people</p>
                    <p>${Date()}</p>
                </div>`
            response.send(resp)
      })

      app.get('/api/persons', (request, response, next) => {
        response.json(persons)
        .catch((error) => next(error))
      })


      app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(person => person.id === id)
        console.log(person)
        if (person) {
            response.json(person)
          } else {
            response.status(404).end()
          }   })
          .catch((error) => next(error))
   


      app.delete('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        persons = persons.filter(person => person.id !== id)
      
        response.status(204).end()
    
      })
      

      const generateId = () => {
        const maxId = persons.length > 0
          ? Math.max(...persons.map(n => n.id))
          : 0
        return maxId + 1
      }


      app.post('/api/persons', (request, response, next) => {
        if (request.body.name === undefined || request.body.number === undefined) {
            response.status(400).json({ error: 'Missing fields in request' })
        }
        
        if (persons.some(person => person.name === request.body.name)) {
            return response.status(400).json({ error: 'Name already exists in the phonebook' });
          }

          const person = {
            name: request.body.name,
            number: request.body.number,
            id: generateId(),
          }
        
        persons = persons.concat(person)
        response.json(person)
        .catch((error) => next(error))
      })

      const unknownEndpoint = (request, response) => {
        response.status(404).send({ error: 'unknown endpoint' })
      }
      
      app.use(unknownEndpoint)


      const PORT = process.env.PORT || 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })

