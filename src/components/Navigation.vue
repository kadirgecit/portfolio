<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const navRef = ref<HTMLElement>()
const isMenuOpen = ref(false)

onMounted(() => {
  // Animate navigation on load
  if (navRef.value) {
    gsap.fromTo(navRef.value, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out' }
    )
  }
})

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  isMenuOpen.value = false
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav ref="navRef" class="navigation">
    <div class="nav-container">
      <div class="nav-logo">
        <span class="logo-text">KG</span>
      </div>

      <div class="nav-links" :class="{ 'nav-open': isMenuOpen }">
        <a @click="scrollToSection('hero')" class="nav-link">Home</a>
        <a @click="scrollToSection('about')" class="nav-link">About</a>
        <a @click="scrollToSection('skills')" class="nav-link">Skills</a>
        <a @click="scrollToSection('projects')" class="nav-link">Projects</a>
        <a @click="scrollToSection('contact')" class="nav-link">Contact</a>
      </div>

      <div class="nav-toggle" @click="toggleMenu">
        <span class="hamburger-line" :class="{ 'active': isMenuOpen }"></span>
        <span class="hamburger-line" :class="{ 'active': isMenuOpen }"></span>
        <span class="hamburger-line" :class="{ 'active': isMenuOpen }"></span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: 700;
}

.logo-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  position: relative;
  padding: 0.5rem 0;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: #667eea;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
}

.hamburger-line {
  width: 25px;
  height: 3px;
  background: #ffffff;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger-line.active:nth-child(2) {
  opacity: 0;
}

.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 2rem;
    gap: 1.5rem;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .nav-links.nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
}
</style>