const CountryForm = ({ searchCountry, handleChange }) => {
    return (
        <div>
            find countries <input value={searchCountry} onChange={handleChange} />
        </div>
    )
}

export default CountryForm