const express = require('express')
const app = express()
app.use(express.json())


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
  
    app.get('/info', (request, response) => {
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

      app.get('/api/persons', (request, response) => {
        response.json(persons)
      })

      app.get('/api/persons/:id', (request, response) => {
        const id = Number(request.params.id)
        const person = persons.find(person => person.id === id)
        console.log(person)
        if (person) {
            response.json(person)
          } else {
            response.status(404).end()
          }
      })

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

      app.post('/api/persons', (request, response) => {
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
      })


      const PORT = 3001
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })