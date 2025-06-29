<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { contactsAPI, type Contact } from '@/services/api'

const contacts = ref<Contact[]>([])
const isLoading = ref(true)
const selectedStatus = ref('all')
const currentPage = ref(1)
const totalPages = ref(1)
const selectedContact = ref<Contact | null>(null)
const showContactModal = ref(false)

const statusOptions = [
  { value: 'all', label: 'All Messages' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' }
]

const filteredContacts = computed(() => {
  if (selectedStatus.value === 'all') {
    return contacts.value
  }
  return contacts.value.filter(contact => contact.status === selectedStatus.value)
})

onMounted(() => {
  loadContacts()
})

async function loadContacts() {
  try {
    const params = {
      page: currentPage.value,
      limit: 10,
      ...(selectedStatus.value !== 'all' && { status: selectedStatus.value })
    }
    
    const response = await contactsAPI.getAll(params)
    contacts.value = response.data.contacts
    totalPages.value = response.data.pagination.pages
  } catch (error) {
    console.error('Failed to load contacts:', error)
  } finally {
    isLoading.value = false
  }
}

function onStatusChange() {
  currentPage.value = 1
  loadContacts()
}

function onPageChange(page: number) {
  currentPage.value = page
  loadContacts()
}

function openContactModal(contact: Contact) {
  selectedContact.value = contact
  showContactModal.value = true
  
  // Mark as read if unread
  if (contact.status === 'unread') {
    updateContactStatus(contact.id, 'read')
  }
}

async function updateContactStatus(contactId: string, status: Contact['status']) {
  try {
    await contactsAPI.updateStatus(contactId, status)
    await loadContacts()
    
    // Update selected contact if it's the same one
    if (selectedContact.value?.id === contactId) {
      selectedContact.value.status = status
    }
  } catch (error) {
    console.error('Failed to update contact status:', error)
    alert('Failed to update status')
  }
}

async function deleteContact(contact: Contact) {
  if (confirm(`Are you sure you want to delete the message from ${contact.name}?`)) {
    try {
      await contactsAPI.delete(contact.id)
      await loadContacts()
      
      // Close modal if this contact was selected
      if (selectedContact.value?.id === contact.id) {
        showContactModal.value = false
      }
    } catch (error) {
      console.error('Failed to delete contact:', error)
      alert('Failed to delete contact')
    }
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'unread': return '#ffc107'
    case 'read': return '#007bff'
    case 'replied': return '#28a745'
    default: return '#6c757d'
  }
}
</script>

<template>
  <div class="admin-contacts">
    <div class="page-header">
      <div class="header-content">
        <h1>Contact Messages</h1>
        <div class="header-filters">
          <select v-model="selectedStatus" @change="onStatusChange" class="status-filter">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="page-content">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>

      <div v-else class="contacts-list">
        <div v-if="filteredContacts.length === 0" class="empty-state">
          <p>No messages found.</p>
        </div>

        <div v-for="contact in filteredContacts" :key="contact.id" class="contact-item" @click="openContactModal(contact)">
          <div class="contact-info">
            <div class="contact-header">
              <h3>{{ contact.name }}</h3>
              <span class="contact-date">{{ formatDate(contact.createdAt) }}</span>
            </div>
            <p class="contact-email">{{ contact.email }}</p>
            <p class="contact-subject">{{ contact.subject }}</p>
            <p class="contact-preview">{{ contact.message.substring(0, 100) }}...</p>
          </div>
          <div class="contact-status">
            <span class="status-badge" :style="{ backgroundColor: getStatusColor(contact.status) }">
              {{ contact.status }}
            </span>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="onPageChange(page)"
            :class="{ active: page === currentPage }"
            class="page-btn"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- Contact Modal -->
    <div v-if="showContactModal && selectedContact" class="modal-overlay" @click="showContactModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Message from {{ selectedContact.name }}</h2>
          <button @click="showContactModal = false" class="close-btn">&times;</button>
        </div>

        <div class="contact-details">
          <div class="detail-row">
            <strong>From:</strong> {{ selectedContact.name }} ({{ selectedContact.email }})
          </div>
          <div class="detail-row">
            <strong>Subject:</strong> {{ selectedContact.subject }}
          </div>
          <div class="detail-row">
            <strong>Date:</strong> {{ formatDate(selectedContact.createdAt) }}
          </div>
          <div class="detail-row">
            <strong>Status:</strong>
            <span class="status-badge" :style="{ backgroundColor: getStatusColor(selectedContact.status) }">
              {{ selectedContact.status }}
            </span>
          </div>
        </div>

        <div class="message-content">
          <h4>Message:</h4>
          <div class="message-text">{{ selectedContact.message }}</div>
        </div>

        <div class="modal-actions">
          <div class="status-actions">
            <button 
              v-if="selectedContact.status !== 'read'"
              @click="updateContactStatus(selectedContact.id, 'read')"
              class="action-btn read-btn"
            >
              Mark as Read
            </button>
            <button 
              v-if="selectedContact.status !== 'replied'"
              @click="updateContactStatus(selectedContact.id, 'replied')"
              class="action-btn replied-btn"
            >
              Mark as Replied
            </button>
          </div>
          <div class="danger-actions">
            <button @click="deleteContact(selectedContact)" class="action-btn delete-btn">
              Delete Message
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-contacts {
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

.status-filter {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
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

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.contact-info {
  flex: 1;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.contact-header h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.contact-date {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.contact-email {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.contact-subject {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  margin: 0 0 0.5rem 0;
}

.contact-preview {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.contact-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #ffffff;
  text-transform: capitalize;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover,
.page-btn.active {
  background: rgba(255, 255, 255, 0.2);
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
  max-width: 700px;
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

.contact-details {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row strong {
  color: #ffffff;
  min-width: 80px;
}

.message-content {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.message-content h4 {
  margin: 0 0 1rem 0;
  color: #ffffff;
  font-size: 1.1rem;
}

.message-text {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  white-space: pre-wrap;
}

.modal-actions {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-actions,
.danger-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.read-btn {
  background: rgba(0, 123, 255, 0.2);
  color: #007bff;
  border: 1px solid rgba(0, 123, 255, 0.3);
}

.read-btn:hover {
  background: rgba(0, 123, 255, 0.3);
}

.replied-btn {
  background: rgba(40, 167, 69, 0.2);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.3);
}

.replied-btn:hover {
  background: rgba(40, 167, 69, 0.3);
}

.delete-btn {
  background: rgba(220, 53, 69, 0.2);
  color: #dc3545;
  border: 1px solid rgba(220, 53, 69, 0.3);
}

.delete-btn:hover {
  background: rgba(220, 53, 69, 0.3);
}

@media (max-width: 768px) {
  .contact-item {
    flex-direction: column;
    gap: 1rem;
  }
  
  .contact-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .status-actions,
  .danger-actions {
    justify-content: center;
  }
}
</style>