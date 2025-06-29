<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const aboutRef = ref<HTMLElement>()
const statsRef = ref<HTMLElement>()

onMounted(() => {
  // About section animation
  gsap.fromTo('.about-content > *', 
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: aboutRef.value,
        start: 'top 80%',
        end: 'bottom 20%',
      }
    }
  )

  // Stats counter animation
  gsap.fromTo('.stat-number',
    { textContent: 0 },
    {
      textContent: (i, target) => target.getAttribute('data-value'),
      duration: 2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: statsRef.value,
        start: 'top 80%',
      }
    }
  )
})
</script>

<template>
  <section id="about" class="about">
    <div class="container">
      <div ref="aboutRef" class="about-content">
        <div class="section-header">
          <h2 class="section-title">About Me</h2>
          <div class="section-line"></div>
        </div>

        <div class="about-grid">
          <div class="about-text">
            <h3 class="about-subtitle">
              Passionate Developer with a Vision
            </h3>
            <p class="about-description">
              With over 8 years of freelancing experience, I've had the privilege of working 
              with diverse clients across various industries. My journey in software development 
              has been driven by a passion for creating elegant solutions to complex problems.
            </p>
            <p class="about-description">
              While many of my projects are under NDA, I've contributed to everything from 
              enterprise applications to innovative startups. I specialize in full-stack 
              development, with expertise in modern frameworks and technologies that drive 
              today's digital landscape.
            </p>
            <p class="about-description">
              I believe in clean, maintainable code and user-centric design. Every project 
              is an opportunity to push boundaries and deliver exceptional results that 
              exceed expectations.
            </p>

            <div class="about-highlights">
              <div class="highlight-item">
                <div class="highlight-icon">🚀</div>
                <div class="highlight-text">
                  <h4>Innovation First</h4>
                  <p>Always exploring cutting-edge technologies</p>
                </div>
              </div>
              <div class="highlight-item">
                <div class="highlight-icon">🎯</div>
                <div class="highlight-text">
                  <h4>Results Driven</h4>
                  <p>Focused on delivering measurable outcomes</p>
                </div>
              </div>
              <div class="highlight-item">
                <div class="highlight-icon">🤝</div>
                <div class="highlight-text">
                  <h4>Client Focused</h4>
                  <p>Building long-term partnerships</p>
                </div>
              </div>
            </div>
          </div>

          <div class="about-visual">
            <div class="visual-card">
              <div class="card-content">
                <h4>My Approach</h4>
                <ul class="approach-list">
                  <li>🔍 Deep problem analysis</li>
                  <li>💡 Creative solution design</li>
                  <li>⚡ Agile development</li>
                  <li>🧪 Rigorous testing</li>
                  <li>📈 Continuous optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div ref="statsRef" class="stats-grid">
          <div class="stat-item">
            <div class="stat-number" data-value="8">0</div>
            <div class="stat-label">Years Experience</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-value="50">0</div>
            <div class="stat-label">Projects Completed</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-value="25">0</div>
            <div class="stat-label">Happy Clients</div>
          </div>
          <div class="stat-item">
            <div class="stat-number" data-value="99">0</div>
            <div class="stat-label">Success Rate %</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
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
  margin: 0 auto;
  border-radius: 2px;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 6rem;
  align-items: start;
}

.about-subtitle {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #ffffff;
}

.about-description {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.about-highlights {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.highlight-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.highlight-text h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #ffffff;
}

.highlight-text p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.visual-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.card-content h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.approach-list {
  list-style: none;
  padding: 0;
}

.approach-list li {
  padding: 0.8rem 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.approach-list li:last-child {
  border-bottom: none;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

@media (max-width: 768px) {
  .about {
    padding: 4rem 0;
  }

  .about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 4rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .highlight-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>