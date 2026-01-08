<template>
  <div class="page">
    <header class="page-header">
      <h2>{{ isEdit ? 'Edit Product' : 'Create Product' }}</h2>
    </header>

    <form class="form" @submit.prevent="handleSubmit">
      <div class="field">
        <label>Product Name</label>
        <input v-model="form.name" type="text" required />
      </div>

      <div class="field">
        <label>SKU</label>
        <input v-model="form.sku" type="text" placeholder="IPH-14-PRO-MAX-128" />
      </div>

      <div class="field two-cols">
        <div>
          <label>Price (GHS)</label>
          <input v-model.number="form.price" type="number" min="0" step="0.01" />
        </div>
        <div>
          <label>Stock</label>
          <input v-model.number="form.stock" type="number" min="0" />
        </div>
      </div>

      <div class="field">
        <label>Brand</label>
        <input v-model="form.brand" type="text" placeholder="Apple" />
      </div>

      <div class="field">
        <label>Category</label>
        <input v-model="form.category" type="text" placeholder="Phones" />
      </div>

      <div class="field">
        <label>Short Description</label>
        <textarea v-model="form.shortDescription" rows="3" />
      </div>

      <div class="field">
        <label>Full Description</label>
        <textarea v-model="form.description" rows="5" />
      </div>

      <div class="field">
        <label>Key Specs (comma-separated)</label>
        <input
          v-model="form.specs"
          type="text"
          placeholder="6.7-inch Super Retina display, A16 Bionic chip, 48MP camera, 128GB storage"
        />
      </div>

      <div class="field">
        <label>Product Image</label>
        <input type="file" accept="image/*" @change="onFileChange" />
        <p class="hint">Recommended: 800x800px JPG/PNG.</p>
        <div v-if="previewUrl" class="preview">
          <img :src="previewUrl" alt="Preview" />
        </div>
      </div>

      <div class="field inline">
        <label>
          <input v-model="form.isActive" type="checkbox" />
          <span>Active (visible in shop)</span>
        </label>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <div class="actions">
        <button type="submit" class="btn primary">
          {{ isEdit ? 'Update Product' : 'Create Product' }}
        </button>
        <RouterLink class="btn ghost" :to="{ name: 'AdminProducts' }">
          Cancel
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const baseURL = import.meta.env.VITE_API_BASE_URL

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  brand: '',
  category: '',
  shortDescription: '',
  description: '',
  specs: '',
  isActive: true,  // matches DB field name
  image: '',       // holds existing image URL if any
})

const imageFile = ref(null)
const previewUrl = ref('')
const error = ref('')

const onFileChange = e => {
  const file = e.target.files?.[0]
  if (!file) return
  imageFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

onMounted(async () => {
  if (!isEdit.value) return
  try {
    const res = await axios.get(`${baseURL}/api/admin/products/${route.params.id}`)
    const p = res.data
    form.value = {
      name: p.name,
      sku: p.sku,
      price: p.price,
      stock: p.stock,
      brand: p.brand,
      category: p.category,
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      specs: Array.isArray(p.specs) ? p.specs.join(', ') : p.specs || '',
      isActive: p.isActive,          // read isActive from API
      image: p.image || '',
    }
    if (p.image) previewUrl.value = p.image
  } catch (err) {
    console.error('Failed to load product', err)
    error.value = 'Failed to load product for editing.'
  }
})

const handleSubmit = async () => {
  error.value = ''
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('sku', form.value.sku)
    fd.append('price', String(form.value.price))
    fd.append('stock', String(form.value.stock))
    fd.append('brand', form.value.brand)
    fd.append('category', form.value.category)
    fd.append('shortDescription', form.value.shortDescription)
    fd.append('description', form.value.description)
    fd.append('specs', form.value.specs)
    // backend expects "active" and converts to isActive
    fd.append('active', form.value.isActive ? 'true' : 'false')
    if (imageFile.value) {
      // must match backend multer field name
      fd.append('image', imageFile.value)
    }

    let res
    if (isEdit.value) {
      res = await axios.put(
        `${baseURL}/api/admin/products/${route.params.id}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    } else {
      res = await axios.post(
        `${baseURL}/api/admin/products`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
    }

    console.log('PRODUCT SAVED', res.data)
    router.push({ name: 'AdminProducts' })
  } catch (err) {
    console.error('Failed to save product', err.response?.data || err)
    error.value =
      err.response?.data?.message ||
      err.response?.data?.error ||
      'Failed to save product. Check console/network for details.'
  }
}
</script>

<style scoped>
.form {
  max-width: 700px;
}
.field {
  margin-bottom: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.field label {
  font-size: 0.85rem;
  color: #e5e7eb;
}
.field input,
.field textarea {
  background: #020617;
  border-radius: 0.5rem;
  border: 1px solid #1f2937;
  padding: 0.55rem 0.6rem;
  color: #e5e7eb;
  font-size: 0.85rem;
}
.field textarea {
  resize: vertical;
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: #f97316;
}
.field.inline label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.two-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}
.hint {
  font-size: 0.75rem;
  color: #9ca3af;
}
.preview {
  margin-top: 0.5rem;
}
.preview img {
  max-width: 220px;
  border-radius: 0.6rem;
  border: 1px solid #1f2937;
}
.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
.btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.82rem;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
}
.primary {
  background: #f97316;
  color: #020617;
  border-color: #f97316;
}
.ghost {
  background: transparent;
  color: #e5e7eb;
  border-color: #4b5563;
}
.error-msg {
  color: #fecaca;
  background: #450a0a;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}
</style>
