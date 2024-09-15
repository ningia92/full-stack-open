import Country from './Country.jsx'

const Countries = ({ filteredCountries, searchCountry, handleFilter }) => {
    if (searchCountry === '') {
        return null
    } else if (filteredCountries.length == 1) {
        return <Country country={filteredCountries[0]} />
    } else if (filteredCountries.length <= 10) {
        return (
            <div>
                {filteredCountries.map(country => {
                    return (
                        <div key={country.name.common}>
                            {country.name.common} <button onClick={() => handleFilter(country.name.common)}>show</button>
                        </div>
                    )
                })}
            </div>
        )
    } else if (filteredCountries.length > 10) {
        return <div>Too many matches, specify another filter</div>
    }
}

export default Countries