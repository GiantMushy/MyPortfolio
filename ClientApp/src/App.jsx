import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'

function App() {
  const [personalData, setPersonalData] = useState(null)
  const [education, setEducation] = useState([])
  const [employment, setEmployment] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get base path for GitHub Pages deployment
    const basePath = import.meta.env.BASE_URL || '/'
    console.log('Base path for assets:', basePath)
    console.log('Current URL:', window.location.href)
    
    const fetchData = async () => {
      try {
        // Fetch all data concurrently
        const [personalRes, educationRes, employmentRes] = await Promise.all([
          fetch(`${basePath}json/personal.json`),
          fetch(`${basePath}json/education.json`),
          fetch(`${basePath}json/employment.json`)
        ])

        // Check if all requests succeeded
        if (!personalRes.ok) throw new Error(`Personal data fetch failed: ${personalRes.status}`)
        if (!educationRes.ok) throw new Error(`Education data fetch failed: ${educationRes.status}`)
        if (!employmentRes.ok) throw new Error(`Employment data fetch failed: ${employmentRes.status}`)

        // Parse all JSON data
        const [personalData, educationData, employmentData] = await Promise.all([
          personalRes.json(),
          educationRes.json(),
          employmentRes.json()
        ])

        // Set all state
        setPersonalData(personalData[0])
        setEducation(educationData)
        setEmployment(employmentData)
      } catch (err) {
        console.error('Error loading portfolio data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Loading portfolio data...</div>
  }

  if (error) {
    return <div className="error">Error loading portfolio: {error}</div>
  }

  if (!personalData) {
    return <div className="error">No personal data available. Check console for fetch errors.</div>
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
