// src/stores/orderStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
    currentOrder: null,
    loading: false,
    error: null
  }),

  getters: {
    // Get orders sorted by most recent first
    sortedOrders: (state) => {
      return [...state.orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    },

    // Get order by ID
    getOrderById: (state) => (id) => {
      return state.orders.find(order => 
        order.id === id || order.id === Number(id)
      );
    }
  },

  actions: {
    // Create a new order
    async createOrder(orderData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(
          `${baseURL}/api/orders`,
          orderData,
          { withCredentials: true }
        );
        
        this.currentOrder = response.data.order || response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order';
        console.error('Create order error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch user's orders
    async fetchMyOrders() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `${baseURL}/api/orders/my-orders`,
          { withCredentials: true }
        );
        
        this.orders = response.data.orders || response.data || [];
        return this.orders;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch orders';
        console.error('Fetch orders error:', error);
        this.orders = [];
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Fetch single order details
    async fetchOrderById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(
          `${baseURL}/api/orders/${id}`,
          { withCredentials: true }
        );
        
        this.currentOrder = response.data.order || response.data;
        return this.currentOrder;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch order';
        console.error('Fetch order error:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});