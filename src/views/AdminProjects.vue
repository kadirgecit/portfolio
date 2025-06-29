<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { projectsAPI, type Project } from '@/services/api'

const projects = ref<Project[]>([])
const isLoading = ref(true)
const showForm = ref(false)
const editingProject = ref<Project | null>(null)

const form = ref({
  title: '',
  description: '',
  category: '',
  status: 'Under NDA',
  features: [] as string[],
  technologies: [] as string[],
  imageUrl: '',
  projectUrl: '',
  isPublic: true,
  order: 0
})

const newFeature = ref('')
const newTechnology = ref('')

onMounted(() => {
  loadProjects()
})

async function loadProjects() {
  try {
    const response = await projectsAPI.getAll()
    projects.value = response.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  } finally {
    isLoading.value = false
  }
}

function openCreateForm() {
  editingProject.value = null
  resetForm()
  showForm.value = true
}

function openEditForm(project: Project) {
  editingProject.value = project
  form.value = {
    title: project.title,
    description: project.description,
    category: project.category,
    status: project.status,
    features: [...project.features],
    technologies: [...project.technologies],
    imageUrl: project.imageUrl || '',
    projectUrl: project.projectUrl || '',
    isPublic: project.isPublic,
    order: project.order
  }
  showForm.value = true
}

function resetForm() {
  form.value = {
    title: '',
    description: '',
    category: '',
    status: 'Under NDA',
    features: [],
    technologies: [],
    imageUrl: '',
    projectUrl: '',
    isPublic: true,
    order: 0
  }
  newFeature.value = ''
  newTechnology.value = ''
}

function addFeature() {
  if (newFeature.value.trim()) {
    form.value.features.push(newFeature.value.trim())
    newFeature.value = ''
  }
}

function removeFeature(index: number) {
  form.value.features.splice(index, 1)
}

function addTechnology() {
  if (newTechnology.value.trim()) {
    form.value.technologies.push(newTechnology.value.trim())
    newTechnology.value = ''
  }
}

function removeTechnology(index: number) {
  form.value.technologies.splice(index, 1)
}

async function saveProject() {
  try {
    if (editingProject.value) {
      await projectsAPI.update(editingProject.value.id, form.value)
    } else {
      await projectsAPI.create(form.value)
    }
    
    showForm.value = false
    await loadProjects()
  } catch (error) {
    console.error('Failed to save project:', error)
    alert('Failed to save project')
  }
}

async function deleteProject(project: Project) {
  if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
    try {
      await projectsAPI.delete(project.id)
      await loadProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
      alert('Failed to delete project')
    }
  }
}
</script>

<template>
  <div class="admin-projects">
    <div class="page-header">
      <div class="header-content">
        <h1>Manage Projects</h1>
        <button @click="openCreateForm" class="create-btn">
          + Add New Project
        </button>
      </div>
    </div>

    <div class="page-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading projects...</p>
      </div>

      <div v-else class="projects-list">
        <div v-if="projects.length === 0" class="empty-state">
          <p>No projects found. Create your first project!</p>
        </div>

        <div v-for="project in projects" :key="project.id" class="project-item">
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <p class="project-category">{{ project.category }}</p>
            <p class="project-description">{{ project.description }}</p>
            <div class="project-meta">
              <span class="status" :class="project.status.toLowerCase().replace(' ', '-')">
                {{ project.status }}
              </span>
              <span class="visibility" :class="{ public: project.isPublic, private: !project.isPublic }">
                {{ project.isPublic ? 'Public' : 'Private' }}
              </span>
            </div>
          </div>
          <div class="project-actions">
            <button @click="openEditForm(project)" class="edit-btn">Edit</button>
            <button @click="deleteProject(project)" class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Project Form Modal -->
    <div v-if="showForm" class="modal-overlay" @click="showForm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ editingProject ? 'Edit Project' : 'Create New Project' }}</h2>
          <button @click="showForm = false" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="saveProject" class="project-form">
          <div class="form-row">
            <div class="form-group">
              <label>Title</label>
              <input v-model="form.title" type="text" required />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input v-model="form.category" type="text" required />
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" rows="3" required></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Status</label>
              <select v-model="form.status">
                <option>Under NDA</option>
                <option>Confidential</option>
                <option>Public</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div class="form-group">
              <label>Order</label>
              <input v-model.number="form.order" type="number" min="0" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Image URL (optional)</label>
              <input v-model="form.imageUrl" type="url" />
            </div>
            <div class="form-group">
              <label>Project URL (optional)</label>
              <input v-model="form.projectUrl" type="url" />
            </div>
          </div>

          <div class="form-group">
            <label>
              <input v-model="form.isPublic" type="checkbox" />
              Show on public portfolio
            </label>
          </div>

          <!-- Features -->
          <div class="form-group">
            <label>Features</label>
            <div class="tags-input">
              <div class="tags-list">
                <span v-for="(feature, index) in form.features" :key="index" class="tag">
                  {{ feature }}
                  <button type="button" @click="removeFeature(index)" class="tag-remove">&times;</button>
                </span>
              </div>
              <div class="add-tag">
                <input
                  v-model="newFeature"
                  type="text"
                  placeholder="Add a feature"
                  @keyup.enter="addFeature"
                />
                <button type="button" @click="addFeature" class="add-btn">Add</button>
              </div>
            </div>
          </div>

          <!-- Technologies -->
          <div class="form-group">
            <label>Technologies</label>
            <div class="tags-input">
              <div class="tags-list">
                <span v-for="(tech, index) in form.technologies" :key="index" class="tag">
                  {{ tech }}
                  <button type="button" @click="removeTechnology(index)" class="tag-remove">&times;</button>
                </span>
              </div>
              <div class="add-tag">
                <input
                  v-model="newTechnology"
                  type="text"
                  placeholder="Add a technology"
                  @keyup.enter="addTechnology"
                />
                <button type="button" @click="addTechnology" class="add-btn">Add</button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="showForm = false" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">
              {{ editingProject ? 'Update' : 'Create' }} Project
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-projects {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #ffffff;
}

.page-header {
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

.create-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.page-content {
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

.empty-state {
  text-align: center;
  padding: 4rem;
  color: rgba(255, 255, 255, 0.8);
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.project-info h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.project-category {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.project-description {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.project-meta {
  display: flex;
  gap: 1rem;
}

.status, .visibility {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.under-nda { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
.status.confidential { background: rgba(220, 53, 69, 0.2); color: #dc3545; }
.status.public { background: rgba(40, 167, 69, 0.2); color: #28a745; }

.visibility.public { background: rgba(40, 167, 69, 0.2); color: #28a745; }
.visibility.private { background: rgba(108, 117, 125, 0.2); color: #6c757d; }

.project-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.edit-btn, .delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background: rgba(0, 123, 255, 0.2);
  color: #007bff;
  border: 1px solid rgba(0, 123, 255, 0.3);
}

.edit-btn:hover {
  background: rgba(0, 123, 255, 0.3);
}

.delete-btn {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1rem;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.tags-input {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag-remove {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
}

.add-tag {
  display: flex;
  gap: 0.5rem;
}

.add-tag input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 0.9rem;
}

.add-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn, .save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.save-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .project-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .project-actions {
    align-self: stretch;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
}
</style>