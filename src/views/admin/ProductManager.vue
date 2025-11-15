<template>
  <div class="product-manager">
    <h2>Product Manager</h2>

    <p v-if="productStore.loading">Loading products...</p>
    <p v-if="productStore.error" class="error">{{ productStore.error }}</p>

    <form class="product-form" @submit.prevent="handleSubmit">
      <input v-model="form.name" type="text" placeholder="Product Name" required />
      <input v-model="form.category" type="text" placeholder="Category" required />
      <input v-model="form.brand" type="text" placeholder="Brand" required />
      <input v-model.number="form.price" type="number" placeholder="Price (GHS)" required />
      <input v-model.number="form.stock" type="number" placeholder="Stock Quantity" required />
      <textarea v-model="form.description" placeholder="Description" required></textarea>
      <input v-model="form.specsText" type="text" placeholder="Specs (comma-separated)" />

      <label>
        Upload Image:
        <input type="file" accept="image/*" @change="handleImageUpload" />
      </label>

      <img v-if="form.imageUrl" :src="form.imageUrl" alt="Preview" width="150" />

      <button type="submit" class="btn btn-primary">
        {{ form._id ? 'Update Product' : 'Add Product' }}
      </button>
      <button v-if="form._id" type="button" class="btn btn-secondary" @click="resetForm">
        Cancel
      </button>
    </form>

    <div class="products-list" v-if="productStore.products.length">
      <h3>All Products</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Specs</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products" :key="product._id">
            <td>{{ product.name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.brand }}</td>
            <td>GHS {{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.specs.join(', ') }}</td>
            <td>
              <img v-if="product.imageUrl" :src="product.imageUrl" alt="product image" width="80" />
            </td>
            <td>
              <button @click="editProduct(product)">Edit</button>
              <button @click="deleteProduct(product._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductStore } from '../../stores/productStore'

const productStore = useProductStore()

const form = ref({
  _id: '',
  name: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
  description: '',
  specsText: '',
  specs: [],
  image: null,
  imageUrl: ''
})

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.image = file
    form.value.imageUrl = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  form.value.specs = form.value.specsText.split(',').map(s => s.trim())
  try {
    if (form.value._id) {
      await productStore.updateProduct(form.value)
    } else {
      await productStore.addProduct(form.value)
    }
    resetForm()
    await productStore.fetchProducts()
  } catch (err) {
    console.error('Failed to save product:', err)
  }
}

const editProduct = (product) => {
  form.value = { ...product, specsText: product.specs.join(','), image: null }
}

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await productStore.deleteProduct(id)
    await productStore.fetchProducts()
  }
}

const resetForm = () => {
  form.value = {
    _id: '',
    name: '',
    category: '',
    brand: '',
    price: 0,
    stock: 0,
    description: '',
    specsText: '',
    specs: [],
    image: null,
    imageUrl: ''
  }
}

// Fetch products when component mounts
onMounted(() => {
  productStore.fetchProducts()
})
</script>



<style scoped>
.product-manager {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.product-form input,
.product-form select,
.product-form textarea {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  width: 100%;
}

.product-form button {
  width: fit-content;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.products-list table {
  width: 100%;
  border-collapse: collapse;
}

.products-list th,
.products-list td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.products-list th {
  background: #f3f4f6;
}

.products-list button {
  margin-right: 0.5rem;
  cursor: pointer;
}
</style>
