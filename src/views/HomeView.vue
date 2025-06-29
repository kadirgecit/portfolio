<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from '@/components/Navigation.vue'
import HeroSection from '@/components/HeroSection.vue'
import AboutSection from '@/components/AboutSection.vue'
import ProjectsSection from '@/components/ProjectsSection.vue'
import SkillsSection from '@/components/SkillsSection.vue'
import ContactSection from '@/components/ContactSection.vue'
import ThreeBackground from '@/components/ThreeBackground.vue'

gsap.registerPlugin(ScrollTrigger)

const isLoaded = ref(false)

onMounted(() => {
  // Page load animation
  gsap.set('.page-content', { opacity: 0 })
  
  gsap.to('.page-content', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    onComplete: () => {
      isLoaded.value = true
    }
  })
})
</script>

<template>
  <div class="home">
    <ThreeBackground />
    <Navigation />
    
    <div class="page-content">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  </div>
</template>

<style scoped>
.home {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.page-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 100vw;
}
</style>
