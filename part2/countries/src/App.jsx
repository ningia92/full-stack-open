import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import CountryForm from './components/CountryForm'

function App() {
  const [countries, setCountries] = useState([])
  const [searchCountry, setSearchCountry] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
      .catch(error => console.log('Error:', error))
  }, [])

  const handleChange = (event) => {
    setSearchCountry(event.target.value)
    handleFilter(event.target.value)
  }

  const handleFilter = (value) => {
    const result = countries.filter(country => country.name.common.toLowerCase().includes(value.toLowerCase()))
    setFilteredCountries(result)
  }

  return (
    <div>
      <CountryForm value={searchCountry} handleChange={handleChange} />
      <Countries filteredCountries={filteredCountries} searchCountry={searchCountry} handleFilter={handleFilter} />
    </div>
  )
}

export default App
