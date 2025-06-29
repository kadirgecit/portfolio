<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

const heroRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const descriptionRef = ref<HTMLElement>()
const ctaRef = ref<HTMLElement>()

onMounted(() => {
  // Hero animation timeline
  const tl = gsap.timeline({ delay: 1 })

  // Animate title with typewriter effect
  tl.fromTo(titleRef.value,
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
  )
  .to(titleRef.value, {
    text: "Kadir Geçit",
    duration: 2,
    ease: "none"
  }, "-=0.5")
  
  // Animate subtitle
  .fromTo(subtitleRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    "-=1"
  )
  
  // Animate description
  .fromTo(descriptionRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    "-=0.5"
  )
  
  // Animate CTA
  .fromTo(ctaRef.value,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    "-=0.3"
  )

  // Floating animation for the hero content
  gsap.to(heroRef.value, {
    y: -10,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut'
  })
})

function scrollToProjects() {
  const element = document.getElementById('projects')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function scrollToContact() {
  const element = document.getElementById('contact')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="hero" class="hero">
    <div class="container">
      <div ref="heroRef" class="hero-content">
        <h1 ref="titleRef" class="hero-title"></h1>
        <h2 ref="subtitleRef" class="hero-subtitle">
          Senior Software Developer
        </h2>
        <p ref="descriptionRef" class="hero-description">
          Crafting exceptional digital experiences with 8+ years of freelancing expertise. 
          Specializing in scalable applications, clean code, and innovative solutions 
          that drive business growth.
        </p>
        <div ref="ctaRef" class="hero-cta">
          <button @click="scrollToProjects" class="cta-primary">
            View My Work
          </button>
          <button @click="scrollToContact" class="cta-secondary">
            Get In Touch
          </button>
        </div>
      </div>
      
      <div class="hero-scroll">
        <div class="scroll-indicator">
          <span>Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.8);
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.6;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-primary,
.cta-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cta-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cta-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transition: left 0.3s ease;
  z-index: -1;
}

.cta-primary:hover::before {
  left: 0;
}

.cta-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.hero-scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  animation: bounce 2s infinite;
}

.scroll-line {
  width: 2px;
  height: 30px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@media (max-width: 768px) {
  .hero-cta {
    flex-direction: column;
    align-items: center;
  }

  .cta-primary,
  .cta-secondary {
    width: 100%;
    max-width: 300px;
  }
}
</style>