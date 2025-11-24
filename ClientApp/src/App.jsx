import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'

function App() {
  const [personalData, setPersonalData] = useState(null)
  const [education, setEducation] = useState([])
  const [employment, setEmployment] = useState([])

  useEffect(() => {
    // Fetch personal data
    fetch('/json/personal.json')
      .then(res => res.json())
      .then(data => setPersonalData(data[0]))
      .catch(err => console.error('Error loading personal data:', err))

    // Fetch education data
    fetch('/json/education.json')
      .then(res => res.json())
      .then(data => setEducation(data))
      .catch(err => console.error('Error loading education data:', err))

    // Fetch employment data
    fetch('/json/employment.json')
      .then(res => res.json())
      .then(data => setEmployment(data))
      .catch(err => console.error('Error loading employment data:', err))
  }, [])

  if (!personalData) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="App">
      <Header personalData={personalData} />
      <Hero personalData={personalData} />
      <About personalData={personalData} education={education} employment={employment} />
    </div>
  )
}

export default App
