import './About.css'

function About({ personalData, education, employment }) {
  // Placeholder skill percentages
  const skills = [
    { name: 'Graphic Design', percentage: 50 },
    { name: 'Development', percentage: 75 },
    { name: 'Marketing Ideas', percentage: 38 },
    { name: 'Web Management', percentage: 63 }
  ]

  return (
    <section className="about" id="about">
      <div className="about-container">
        <div className="about-header">
          <h2 className="about-title">Who I Am</h2>
          <p className="about-subtitle">About My Resume</p>
        </div>

        <div className="about-content">
          <div className="about-left">
            <div className="info-box">
              <h3>About Me</h3>
              <p>{personalData.aboutMe}</p>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{personalData.name}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{personalData.email}</span>
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{personalData.phone}</span>
              </div>
              <div className="info-item">
                <label>Age:</label>
                <span>{personalData.age}</span>
              </div>
              <div className="info-item">
                <label>Location:</label>
                <span>{personalData.location}</span>
              </div>
            </div>

            <div className="experience-section">
              <h3>Education</h3>
              {education.map((edu, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-dates">{edu.startDate} - {edu.endDate}</div>
                  <div className="experience-title">{edu.institution}</div>
                  <div className="experience-description">{edu.description}</div>
                </div>
              ))}
            </div>

            <div className="experience-section">
              <h3>Employment</h3>
              {employment.slice(0, 4).map((job, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-dates">{job.startDate} - {job.endDate}</div>
                  <div className="experience-title">{job.company}</div>
                  <div className="experience-description">{job.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-right">
            <div className="about-image-wrapper">
              <img src="/assets/Þorvarðar.png" alt={personalData.name} className="about-image" />
            </div>

            <div className="skills-grid">
              {skills.map((skill, index) => (
                <div key={index} className="skill-card">
                  <div className="skill-percentage">{skill.percentage}%</div>
                  <div className="skill-name">{skill.name}</div>
                  <div className="skill-bar">
                    <div 
                      className="skill-bar-fill" 
                      style={{ width: `${skill.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
