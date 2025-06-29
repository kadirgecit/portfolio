<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillsRef = ref<HTMLElement>()

const skillCategories = [
  {
    title: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'Vue.js', level: 95, color: '#4FC08D' },
      { name: 'React', level: 90, color: '#61DAFB' },
      { name: 'TypeScript', level: 88, color: '#3178C6' },
      { name: 'JavaScript', level: 95, color: '#F7DF1E' },
      { name: 'HTML/CSS', level: 92, color: '#E34F26' },
      { name: 'Tailwind CSS', level: 85, color: '#06B6D4' }
    ]
  },
  {
    title: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js', level: 90, color: '#339933' },
      { name: 'Python', level: 85, color: '#3776AB' },
      { name: 'PHP', level: 80, color: '#777BB4' },
      { name: 'PostgreSQL', level: 88, color: '#336791' },
      { name: 'MongoDB', level: 82, color: '#47A248' },
      { name: 'Redis', level: 75, color: '#DC382D' }
    ]
  },
  {
    title: 'DevOps & Tools',
    icon: '🛠️',
    skills: [
      { name: 'Docker', level: 85, color: '#2496ED' },
      { name: 'AWS', level: 80, color: '#FF9900' },
      { name: 'Git', level: 95, color: '#F05032' },
      { name: 'CI/CD', level: 82, color: '#326CE5' },
      { name: 'Linux', level: 88, color: '#FCC624' },
      { name: 'Nginx', level: 75, color: '#009639' }
    ]
  }
]

onMounted(() => {
  // Animate skill categories
  gsap.fromTo('.skill-category',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: skillsRef.value,
        start: 'top 80%',
      }
    }
  )

  // Animate skill bars
  gsap.fromTo('.skill-progress',
    { width: 0 },
    {
      width: (i, target) => target.getAttribute('data-level') + '%',
      duration: 1.5,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: skillsRef.value,
        start: 'top 60%',
      }
    }
  )
})
</script>

<template>
  <section id="skills" class="skills">
    <div class="container">
      <div ref="skillsRef" class="skills-content">
        <div class="section-header">
          <h2 class="section-title">Skills & Expertise</h2>
          <div class="section-line"></div>
          <p class="section-description">
            Technologies and tools I use to bring ideas to life
          </p>
        </div>

        <div class="skills-grid">
          <div 
            v-for="category in skillCategories" 
            :key="category.title"
            class="skill-category"
          >
            <div class="category-header">
              <div class="category-icon">{{ category.icon }}</div>
              <h3 class="category-title">{{ category.title }}</h3>
            </div>

            <div class="skills-list">
              <div 
                v-for="skill in category.skills"
                :key="skill.name"
                class="skill-item"
              >
                <div class="skill-info">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-level">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                  <div 
                    class="skill-progress"
                    :data-level="skill.level"
                    :style="{ backgroundColor: skill.color }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="skills-summary">
          <div class="summary-card">
            <h3>What I Bring to the Table</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-icon">🚀</div>
                <div class="summary-text">
                  <h4>Performance Optimization</h4>
                  <p>Building fast, efficient applications that scale</p>
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-icon">🔧</div>
                <div class="summary-text">
                  <h4>Full-Stack Development</h4>
                  <p>End-to-end solution development and deployment</p>
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-icon">📊</div>
                <div class="summary-text">
                  <h4>Data-Driven Solutions</h4>
                  <p>Analytics and insights to drive business decisions</p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  padding: 8rem 0;
  background: #0a0a0a;
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.skill-category {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skill-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-weight: 500;
  color: #ffffff;
}

.skill-level {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.skill-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  border-radius: 4px;
  transition: width 1.5s ease;
  position: relative;
}

.skill-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skills-summary {
  margin-top: 4rem;
}

.summary-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.summary-card h3 {
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 3rem;
  color: #ffffff;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  flex-shrink: 0;
}

.summary-text h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.summary-text p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .skills {
    padding: 4rem 0;
  }

  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .summary-card {
    padding: 2rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .summary-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>