import { useState } from 'react'

const Heading = ({ text }) => <h1>{text}</h1>

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {text === "positive" ? "%" : ""}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad, all, average, positive }) => {
  if (all === 0)
    return <p>No feedback given</p>

  return (
    <div>
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={all} />
          <StatisticsLine text="average" value={average} />
          <StatisticsLine text="positive" value={positive} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const all = good + neutral + bad
  const average = (all === 0 ? 0 : (good - bad) / all)
  const positive = (all === 0 ? 0 : (good / all) * 100)

  return (
    <div>
      <Heading text="give feedback" />
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Heading text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive} />
    </div>
  )
}

export default App
