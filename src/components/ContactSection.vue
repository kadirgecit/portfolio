<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contactsAPI } from '@/services/api'

gsap.registerPlugin(ScrollTrigger)

const contactRef = ref<HTMLElement>()
const formRef = ref<HTMLFormElement>()

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const submitMessage = ref('')

onMounted(() => {
  // Animate contact section
  gsap.fromTo('.contact-content > *',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: contactRef.value,
        start: 'top 80%',
      }
    }
  )
})

async function submitForm() {
  if (isSubmitting.value) return

  isSubmitting.value = true
  submitMessage.value = ''

  try {
    // Submit form to API
    await contactsAPI.submit(form.value)
    
    submitMessage.value = 'Thank you for your message! I\'ll get back to you soon.'
    
    // Reset form
    form.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
    // Animate success message
    gsap.fromTo('.submit-message',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 }
    )
    
  } catch (error) {
    submitMessage.value = 'Sorry, there was an error sending your message. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}

const contactInfo = [
  {
    icon: '📧',
    title: 'Email',
    value: 'hello@kadirgecit.com',
    link: 'mailto:hello@kadirgecit.com'
  },
  {
    icon: '💼',
    title: 'LinkedIn',
    value: 'linkedin.com/in/kadirgecit',
    link: 'https://linkedin.com/in/kadirgecit'
  },
  {
    icon: '🐙',
    title: 'GitHub',
    value: 'github.com/kadirgecit',
    link: 'https://github.com/kadirgecit'
  },
  {
    icon: '🌍',
    title: 'Website',
    value: 'kadirgecit.com',
    link: 'https://kadirgecit.com'
  }
]
</script>

<template>
  <section id="contact" class="contact">
    <div class="container">
      <div ref="contactRef" class="contact-content">
        <div class="section-header">
          <h2 class="section-title">Let's Work Together</h2>
          <div class="section-line"></div>
          <p class="section-description">
            Ready to bring your ideas to life? Let's discuss your next project
          </p>
        </div>

        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-card">
              <h3>Get In Touch</h3>
              <p class="info-description">
                I'm always interested in new opportunities and exciting projects. 
                Whether you need a full-stack developer, technical consultant, or 
                someone to bring your vision to life, I'd love to hear from you.
              </p>

              <div class="contact-methods">
                <div 
                  v-for="info in contactInfo"
                  :key="info.title"
                  class="contact-method"
                >
                  <div class="method-icon">{{ info.icon }}</div>
                  <div class="method-info">
                    <h4>{{ info.title }}</h4>
                    <a :href="info.link" target="_blank" rel="noopener noreferrer">
                      {{ info.value }}
                    </a>
                  </div>
                </div>
              </div>

              <div class="availability">
                <div class="availability-indicator">
                  <div class="status-dot"></div>
                  <span>Available for new projects</span>
                </div>
                <p class="availability-text">
                  Currently accepting new freelance projects and consulting opportunities.
                </p>
              </div>
            </div>
          </div>

          <div class="contact-form-container">
            <form ref="formRef" @submit.prevent="submitForm" class="contact-form">
              <h3>Send a Message</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="Your name"
                  />
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <input
                  id="subject"
                  v-model="form.subject"
                  type="text"
                  required
                  placeholder="Project inquiry, consultation, etc."
                />
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  required
                  rows="6"
                  placeholder="Tell me about your project, timeline, and requirements..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                class="submit-btn"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">Send Message</span>
                <span v-else class="loading">
                  <span class="loading-spinner"></span>
                  Sending...
                </span>
              </button>

              <div v-if="submitMessage" class="submit-message">
                {{ submitMessage }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-text">
            <p>&copy; 2024 Kadir Geçit. All rights reserved.</p>
            <p>Built with Vue.js, Three.js, and GSAP</p>
          </div>
          <div class="footer-links">
            <a href="https://github.com/kadirgecit" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/kadirgecit" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<style scoped>
.contact {
  padding: 8rem 0 0;
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

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: start;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  height: fit-content;
}

.info-card h3 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.info-description {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 3rem;
  color: rgba(255, 255, 255, 0.8);
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.contact-method:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.method-icon {
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
}

.method-info h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #ffffff;
}

.method-info a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.method-info a:hover {
  color: #667eea;
}

.availability {
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.availability-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #ffffff;
}

.status-dot {
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.availability-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.contact-form {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: none;
}

.contact-form h3 {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #ffffff;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #ffffff;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.submit-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.submit-message {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  color: #10b981;
  text-align: center;
}

.footer {
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #667eea;
}

@media (max-width: 1024px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

@media (max-width: 768px) {
  .contact {
    padding: 4rem 0 0;
  }

  .contact-grid {
    gap: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .info-card,
  .contact-form {
    padding: 2rem;
  }

  .contact-form h3 {
    font-size: 1.5rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-links {
    gap: 1rem;
  }
}
</style>