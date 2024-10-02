import Person from './Person'

const Persons = ({ searchName, persons, deletePerson }) => {
    return (
        <div>
            {searchName === ''
                ? persons.map(person => (
                    <Person
                        key={person.id}
                        name={person.name}
                        number={person.number}
                        deletePerson={() => deletePerson(person.id)} />)
                )
                : persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))
                    .map(filtered => (
                        <Person
                            key={filtered.id}
                            name={filtered.name}
                            number={filtered.number}
                            deletePerson={() => deletePerson(filtered.id)} />)
                    )}
        </div>
    )
}

export default Persons