const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', (req) => JSON.stringify(req.body))


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (
    error.name === 'ValidationError' ||
    error.number === 'ValidationError'
  ) {
    return response.status(400).json({
      error: error.message,
    })
  }

  next(error)
}

app.use(cors())
app.use(express.json())
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: (req) => req.method !== 'POST', // Only log body for POST requests
  })
)
app.use(express.static('dist'))

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentDate = new Date()

      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentDate}</p>
      `)
    })
    .catch(error => next(error)) // Pass errors to the error handler
})


app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => next(error)) // Pass errors to the error handler
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing',
    })
  }

  // Check if name already exists in the database
  Person.findOne({ name: body.name }).then((existingPerson) => {
    if (existingPerson) {
      return response.status(400).json({
        error: 'Name must be unique',
      })
    }
  })

  // Create new person object
  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  // Save the new person to the database
  newPerson.save().then((savedPerson) => {
    response.json(savedPerson)
  }).catch((error) => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // Validate that both name and number are provided
  if (!name || !number) {
    return response.status(400).json({ error: 'Name or number is missing' })
  }
  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )

    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
