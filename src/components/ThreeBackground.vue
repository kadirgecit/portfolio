<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'

const canvasRef = ref<HTMLCanvasElement>()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationId: number

onMounted(() => {
  initThree()
  animate()
  
  // Responsive handling
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onWindowResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})

function initThree() {
  if (!canvasRef.value) return

  // Scene
  scene = new THREE.Scene()

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Create particles
  createParticles()
  
  // Create floating geometric shapes
  createFloatingShapes()
}

function createParticles() {
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 2000

  const posArray = new Float32Array(particlesCount * 3)
  const colorArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i += 3) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 20
    posArray[i + 1] = (Math.random() - 0.5) * 20
    posArray[i + 2] = (Math.random() - 0.5) * 20

    // Color - gradient from blue to purple
    const t = Math.random()
    colorArray[i] = 0.2 + t * 0.6     // R
    colorArray[i + 1] = 0.1 + t * 0.4 // G
    colorArray[i + 2] = 0.8 + t * 0.2 // B
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)
}

function createFloatingShapes() {
  // Create various geometric shapes
  const shapes = [
    new THREE.BoxGeometry(0.2, 0.2, 0.2),
    new THREE.SphereGeometry(0.1, 8, 6),
    new THREE.ConeGeometry(0.1, 0.3, 6),
    new THREE.OctahedronGeometry(0.15)
  ]

  const materials = [
    new THREE.MeshBasicMaterial({ 
      color: 0x4f46e5, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true 
    }),
    new THREE.MeshBasicMaterial({ 
      color: 0x7c3aed, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true 
    }),
    new THREE.MeshBasicMaterial({ 
      color: 0x06b6d4, 
      transparent: true, 
      opacity: 0.3,
      wireframe: true 
    })
  ]

  for (let i = 0; i < 15; i++) {
    const geometry = shapes[Math.floor(Math.random() * shapes.length)]
    const material = materials[Math.floor(Math.random() * materials.length)]
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 10
    )

    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )

    scene.add(mesh)

    // Animate the shapes
    gsap.to(mesh.rotation, {
      x: mesh.rotation.x + Math.PI * 2,
      y: mesh.rotation.y + Math.PI * 2,
      duration: 10 + Math.random() * 20,
      repeat: -1,
      ease: 'none'
    })

    gsap.to(mesh.position, {
      y: mesh.position.y + (Math.random() - 0.5) * 4,
      duration: 5 + Math.random() * 10,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    })
  }
}

function animate() {
  animationId = requestAnimationFrame(animate)

  // Rotate particles
  if (particles) {
    particles.rotation.y += 0.001
    particles.rotation.x += 0.0005
  }

  // Mouse interaction
  const mouse = { x: 0, y: 0 }
  document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    
    if (camera) {
      camera.position.x = mouse.x * 0.5
      camera.position.y = mouse.y * 0.5
    }
  })

  renderer.render(scene, camera)
}

function onWindowResize() {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
</script>

<template>
  <div class="three-background">
    <canvas ref="canvasRef" class="three-canvas"></canvas>
  </div>
</template>

<style scoped>
.three-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>