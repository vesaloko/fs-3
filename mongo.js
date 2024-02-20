const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://vesaloko:${password}@cluster0.bj87qwu.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id:  mongoose.Schema.Types.ObjectId,
})

const Person = mongoose.model('Person', personSchema)

Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
  const name = process.argv[3]
  const number = process.argv[4]
  const id = process.argv[5]

  const person = new Person({
    name: name, 
    number: number,
    id: id
  })

person.save().then(result => {
  console.log(process.argv[3], process.argv[4], 'to phonebook')
  mongoose.connection.close()
})