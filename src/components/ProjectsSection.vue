<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projectsAPI, type Project } from '@/services/api'

gsap.registerPlugin(ScrollTrigger)

const projectsRef = ref<HTMLElement>()

const projects = ref<Project[]>([])
const isLoading = ref(true)

const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
]

const getProjectGradient = (index: number) => {
  return gradients[index % gradients.length]
}

async function loadProjects() {
  try {
    const response = await projectsAPI.getPublic()
    projects.value = response.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadProjects()
  
  // Animate project cards after loading
  setTimeout(() => {
    gsap.fromTo('.project-card',
      { opacity: 0, y: 50, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: projectsRef.value,
          start: 'top 80%',
        }
      }
    )
  }, 100)
})
</script>

<template>
  <section id="projects" class="projects">
    <div class="container">
      <div ref="projectsRef" class="projects-content">
        <div class="section-header">
          <h2 class="section-title">Featured Projects</h2>
          <div class="section-line"></div>
          <p class="section-description">
            A showcase of my work across various industries and technologies
          </p>
        </div>

        <div class="projects-grid">
          <div v-if="isLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading projects...</p>
          </div>
          
          <div 
            v-for="(project, index) in projects"
            :key="project.id"
            class="project-card"
          >
            <div class="card-header" :style="{ background: getProjectGradient(index) }">
              <div class="project-category">{{ project.category }}</div>
              <div class="project-status">{{ project.status }}</div>
            </div>

            <div class="card-content">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-description">{{ project.description }}</p>

              <div class="project-features">
                <h4>Key Features:</h4>
                <ul class="features-list">
                  <li v-for="feature in project.features" :key="feature">
                    {{ feature }}
                  </li>
                </ul>
              </div>

              <div class="project-tech">
                <h4>Technologies:</h4>
                <div class="tech-tags">
                  <span 
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="project-note">
                <span class="note-icon">🔒</span>
                <span class="note-text">Details protected by NDA</span>
              </div>
            </div>
          </div>
        </div>

        <div class="projects-note">
          <div class="note-card">
            <div class="note-icon-large">🤝</div>
            <h3>Confidential Work</h3>
            <p>
              Due to the nature of my freelance work, most projects are under strict 
              Non-Disclosure Agreements (NDAs). The projects shown here represent the 
              types of solutions I've delivered, with details modified to respect 
              client confidentiality.
            </p>
            <p>
              I'm happy to discuss my experience and approach in more detail during 
              a consultation, while respecting all confidentiality agreements.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  padding: 8rem 0;
  background: linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(25, 25, 25, 0.9) 100%);
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-line {
  width: 100px;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: 0 auto 2rem;
  border-radius: 2px;
}

.section-description {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.card-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
}

.project-category,
.project-status {
  position: relative;
  z-index: 1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.card-content {
  padding: 2rem;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.project-description {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.project-features {
  margin-bottom: 2rem;
}

.project-features h4,
.project-tech h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ffffff;
}

.features-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.features-list li {
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.7);
  position: relative;
  padding-left: 1.5rem;
}

.features-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.project-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.note-icon {
  font-size: 1.2rem;
}

.loading-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.projects-note {
  margin-top: 4rem;
}

.note-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.note-icon-large {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.note-card h3 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #ffffff;
}

.note-card p {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.note-card p:last-child {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .projects {
    padding: 4rem 0;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .features-list {
    grid-template-columns: 1fr;
  }

  .note-card {
    padding: 2rem;
  }
}
</style>