<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI, contactsAPI, projectsAPI, type ContactStats } from '@/services/api'

const router = useRouter()

const user = ref<User | null>(null)
const stats = ref<ContactStats>({
  total: 0,
  unread: 0,
  read: 0,
  replied: 0
})
const projectCount = ref(0)
const isLoading = ref(true)

onMounted(async () => {
  await checkAuth()
  await loadStats()
})

async function checkAuth() {
  try {
    const response = await authAPI.verify()
    user.value = response.data.user
  } catch (error) {
    router.push('/admin/login')
  }
}

async function loadStats() {
  try {
    const [contactStats, projects] = await Promise.all([
      contactsAPI.getStats(),
      projectsAPI.getAll()
    ])
    
    stats.value = contactStats.data
    projectCount.value = projects.data.length
  } catch (error) {
    console.error('Failed to load stats:', error)
  } finally {
    isLoading.value = false
  }
}

function logout() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
  router.push('/admin/login')
}
</script>

<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <div class="header-content">
        <h1>Admin Dashboard</h1>
        <div class="header-actions">
          <span class="user-info">Welcome, {{ user?.name || user?.email }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>

      <div v-else class="dashboard-grid">
        <!-- Stats Cards -->
        <div class="stats-section">
          <h2>Overview</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <h3>{{ projectCount }}</h3>
                <p>Total Projects</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📧</div>
              <div class="stat-content">
                <h3>{{ stats.total }}</h3>
                <p>Total Messages</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🔔</div>
              <div class="stat-content">
                <h3>{{ stats.unread }}</h3>
                <p>Unread Messages</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <h3>{{ stats.replied }}</h3>
                <p>Replied Messages</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="actions-section">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <router-link to="/admin/projects" class="action-card">
              <div class="action-icon">🚀</div>
              <h3>Manage Projects</h3>
              <p>Add, edit, or remove portfolio projects</p>
            </router-link>
            
            <router-link to="/admin/contacts" class="action-card">
              <div class="action-icon">💬</div>
              <h3>View Messages</h3>
              <p>Read and respond to contact messages</p>
            </router-link>
            
            <a href="/" target="_blank" class="action-card">
              <div class="action-icon">🌐</div>
              <h3>View Portfolio</h3>
              <p>See your live portfolio website</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #ffffff;
}

.dashboard-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1.5rem 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dashboard-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state {
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

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.stats-section h2,
.actions-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ffffff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content h3 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.stat-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: block;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.action-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-content {
    padding: 1rem;
  }
}
</style>