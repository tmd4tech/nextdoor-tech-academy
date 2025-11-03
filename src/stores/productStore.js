import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref([
    {
      id: 1,
      name: 'iPhone 14 Pro Max',
      category: 'Phones',
      brand: 'Apple',
      price: 8500,
      stock: 15,
      image: 'phone-iphone14.jpg',
      description: 'Latest iPhone with A16 Bionic chip, 48MP camera, and Dynamic Island',
      specs: ['6.7-inch Super Retina XDR display', 'A16 Bionic chip', '48MP Main camera', '128GB storage']
    },
    {
      id: 2,
      name: 'Samsung Galaxy S23 Ultra',
      category: 'Phones',
      brand: 'Samsung',
      price: 7200,
      stock: 20,
      image: 'phone-samsung-s23.jpg',
      description: 'Premium Samsung flagship with S Pen and 200MP camera',
      specs: ['6.8-inch Dynamic AMOLED display', 'Snapdragon 8 Gen 2', '200MP camera', '256GB storage']
    },
    {
      id: 3,
      name: 'MacBook Pro 16-inch M3',
      category: 'Laptops',
      brand: 'Apple',
      price: 15000,
      stock: 8,
      image: 'laptop-macbook-m3.jpg',
      description: 'Powerful MacBook Pro with M3 chip for professionals',
      specs: ['16-inch Liquid Retina XDR display', 'Apple M3 Pro chip', '18GB unified memory', '512GB SSD']
    },
    {
      id: 4,
      name: 'HP Pavilion 15',
      category: 'Laptops',
      brand: 'HP',
      price: 4500,
      stock: 12,
      image: 'laptop-hp-pavilion.jpg',
      description: 'Versatile laptop for work and entertainment',
      specs: ['15.6-inch FHD display', 'Intel Core i5 12th Gen', '8GB RAM', '512GB SSD']
    },
    {
      id: 5,
      name: 'Lenovo ThinkPad X1',
      category: 'Laptops',
      brand: 'Lenovo',
      price: 6800,
      stock: 10,
      image: 'laptop-lenovo-thinkpad.jpg',
      description: 'Business-class laptop with exceptional durability',
      specs: ['14-inch FHD display', 'Intel Core i7 13th Gen', '16GB RAM', '1TB SSD']
    },
    {
      id: 6,
      name: 'AirPods Pro (2nd Gen)',
      category: 'Accessories',
      brand: 'Apple',
      price: 1200,
      stock: 30,
      image: 'accessory-airpods.jpg',
      description: 'Active noise cancellation wireless earbuds',
      specs: ['Active Noise Cancellation', 'Adaptive Audio', 'USB-C charging', '6 hours battery life']
    },
    {
      id: 7,
      name: 'Professional Repair Toolkit',
      category: 'Repair Tools',
      brand: 'Generic',
      price: 250,
      stock: 45,
      image: 'tool-repair-kit.jpg',
      description: 'Complete toolkit for phone and laptop repairs',
      specs: ['120+ pieces', 'Precision screwdrivers', 'Prying tools', 'Carrying case included']
    },
    {
      id: 8,
      name: 'iPhone 13 Screen Replacement',
      category: 'Parts',
      brand: 'Apple',
      price: 450,
      stock: 25,
      image: 'part-iphone13-screen.jpg',
      description: 'Original quality replacement screen for iPhone 13',
      specs: ['OLED display', 'Touch-sensitive', 'Easy installation', '1-year warranty']
    }
  ])

  const getProductById = (id) => {
    return products.value.find(p => p.id === parseInt(id))
  }

  const getProductsByCategory = (category) => {
    if (category === 'All') return products.value
    return products.value.filter(p => p.category === category)
  }

  const filterProducts = (filters) => {
    let filtered = products.value

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(p => p.category === filters.category)
    }

    if (filters.brand && filters.brand.length > 0) {
      filtered = filtered.filter(p => filters.brand.includes(p.brand))
    }

    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice)
    }

    return filtered
  }

  return {
    products,
    getProductById,
    getProductsByCategory,
    filterProducts
  }
})