import { useState, useEffect } from 'react'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'
import phoneBService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState('')

  useEffect(() => {
    phoneBService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = event => {
    event.preventDefault()
    const personFound = persons.find(person => person.name === newName)
    if (personFound) {
      if (window.confirm(`${personFound.name} is already added to phonebook, replace the old number with the new one?`)) {
        const changedPerson = { ...personFound, number: newNumber }
        phoneBService
          .update(personFound.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== personFound.id ? person : returnedPerson))
          })
          .catch(error => {
            setMessage(`Information of ${personFound.name} has already been removed from server`)
            setStyle('red')
          })
        setMessage(`${personFound.name}'s number modified`)
        setStyle('green')
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      }
      phoneBService
        .create(newPerson)
        .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
      setMessage(`Added ${newPerson.name}`)
      setStyle('green')
    }
    setTimeout(() => {
      setMessage(null)
    }, 5000);
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = id => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      phoneBService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const handleName = event => setNewName(event.target.value)

  const handleNumber = event => setNewNumber(event.target.value)

  const handleSearchName = event => setSearchName(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} style={style} />
      <Filter searchName={searchName} handleSearchName={handleSearchName} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleName={handleName} newNumber={newNumber} handleNumber={handleNumber} />
      <h3>Numbers</h3>
      <Persons searchName={searchName} persons={persons} deletePerson={deletePerson} />
    </div>
  )
}

export default App