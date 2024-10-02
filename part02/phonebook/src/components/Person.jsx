const Person = ({ id, name, number, deletePerson }) => {
    return (
        <div key={id}>
            {name} {number} <button onClick={deletePerson}>delete</button>
        </div>
    )
}

export default Person