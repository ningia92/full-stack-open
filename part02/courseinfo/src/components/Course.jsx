import Heading from "./Heading"

const Total = ({ parts }) => (
    <strong><p>total of {parts.reduce((accum, part) => accum + part.exercises, 0)} exercises</p></strong>
)

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => <Part key={part.id} name={parts[part.id-1].name} exercises={parts[part.id-1].exercises} />)}
        </div>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Heading size="h2" title={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course