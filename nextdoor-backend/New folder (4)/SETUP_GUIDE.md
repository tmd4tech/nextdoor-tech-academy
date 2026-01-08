# Complete Setup Guide - Nextdoor Tech Academy Backend

## Step-by-Step Installation

### 1. Prerequisites Installation

#### Windows
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Download Node.js from https://nodejs.org/

#### macOS
```bash
# Using Homebrew
brew install postgresql
brew install node
```

#### Linux (Ubuntu)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib nodejs npm
```

### 2. Project Setup

```bash
# Create project directory
mkdir nextdoor-tech-backend
cd nextdoor-tech-backend

# Initialize Node.js project
npm init -y

# Copy all the files from this backend structure
# Then install dependencies
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

**Windows/macOS (using psql):**
```bash
# Open PostgreSQL prompt
psql -U postgres

# In PostgreSQL shell:
CREATE DATABASE nextdoor_tech_dev;
CREATE USER nextdoor_user WITH PASSWORD 'your_secure_password';
ALTER ROLE nextdoor_user SET client_encoding TO 'utf8';
ALTER ROLE nextdoor_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE nextdoor_user SET default_transaction_deferrable TO on;
ALTER ROLE nextdoor_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE nextdoor_tech_dev TO nextdoor_user;
```

**Linux (using createdb):**
```bash
sudo -u postgres createdb nextdoor_tech_dev
sudo -u postgres psql -c "CREATE USER nextdoor_user WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nextdoor_tech_dev TO nextdoor_user;"
```

### 4. Environment Configuration

Create `.env` file in project root:

```env
# ===== DATABASE =====
DB_HOST=localhost
DB_PORT=5432
DB_USER=nextdoor_user
DB_PASSWORD=your_secure_password
DB_NAME=nextdoor_tech_dev

# ===== SERVER =====
PORT=5000
NODE_ENV=development

# ===== JWT =====
JWT_SECRET=your_very_long_secret_key_min_32_chars_recommended
JWT_EXPIRY=24h

# ===== STRIPE (Get from https://dashboard.stripe.com) =====
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# ===== CLOUDINARY (Get from https://cloudinary.com) =====
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ===== EMAIL CONFIGURATION =====
# For Gmail: Enable 2FA and use App Password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=noreply@nextdoortech.com

# ===== APP URLS =====
APP_URL=http://localhost:3000
API_URL=http://localhost:5000
```

### 5. Stripe Setup

1. Create account at https://stripe.com
2. Go to Dashboard → Developers → API keys
3. Copy Secret key and Publishable key
4. Set up Webhook:
   - Click Webhooks
   - Add endpoint: `http://localhost:5000/api/payments/webhook/stripe`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy Webhook signing secret

### 6. Cloudinary Setup

1. Create account at https://cloudinary.com
2. Go to Account Settings → API Keys
3. Copy Cloud Name, API Key, and API Secret

### 7. Email Configuration (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Go to https://myaccount.google.com/apppasswords
3. Generate app password (16 characters)
4. Use this password in EMAIL_PASSWORD

### 8. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ Database connection established successfully.
✅ Database synchronized successfully.

╔══════════════════════════════════════════════════════════════╗
║     Nextdoor Tech Academy - Backend Server                  ║
║     Server running on port 5000                             ║
║     Environment: development                                ║
║     Database: nextdoor_tech_dev                             ║
╚══════════════════════════════════════════════════════════════╝
```

## Testing the API

### Using Postman

1. Download Postman from https://www.postman.com/downloads/
2. Import the API collection (or create requests manually)

### Sample Requests

**Signup:**
```bash
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phoneNumber": "+1234567890"
}
```

**Login:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}


**Get Products:**
```bash
GET http://localhost:5000/api/products
```

## Common Issues & Solutions

### Issue: PostgreSQL Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
- Ensure PostgreSQL is running
- Windows: Start PostgreSQL service from Services
- macOS: `brew services start postgresql`
- Linux: `sudo systemctl start postgresql`

### Issue: JWT Secret Error
```
Error: JWT_SECRET is not defined
```

**Solution:**
- Ensure `.env` file exists in root directory
- Verify JWT_SECRET is set
- Restart the server

### Issue: Stripe Payment Not Working
```
Error: STRIPE_SECRET_KEY not found
```

**Solution:**
- Verify Stripe keys in `.env`
- Use test keys (start with `sk_test_`)
- Check Stripe Dashboard for correct keys

### Issue: Email Not Sending
```
Error: Invalid login: 534, 5.7.8
```

**Solution:**
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail account
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

### Issue: Cloudinary Upload Fails
```
Error: Missing required parameter
```

**Solution:**
- Verify CLOUDINARY_CLOUD_NAME is correct
- Check API keys are valid
- Ensure account is active

## Frontend Integration

### Install Axios in Vue Project

```bash
npm install axios
```

### Create API Service

Create `src/services/api.js`:

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data)
  }
)

export default api
```

### Use in Components

```vue
<script>
import api from '@/services/api'

export default {
  async mounted() {
    try {
      const response = await api.get('/products')
      console.log(response)
    } catch (error) {
      console.error('Error:', error)
    }
  }
}
</script>
```

## Database Models Overview

### User
- Authentication
- Profile information
- Multiple roles support

### Product
- E-commerce items
- Inventory management
- Categories and filtering

### Cart
- Temporary storage
- Associated with User

### Order
- Purchase history
- Payment tracking
- Shipping information

### Course
- Online training
- Instructor information
- Pricing and enrollment

### Enrollment
- Course registration
- Progress tracking
- Certificate issuance

### Payment
- Transaction records
- Stripe integration
- Refund management

### Blog
- Content articles
- SEO optimization
- View tracking

## Security Checklist

Before production deployment:

- [ ] Change JWT_SECRET to a strong random value
- [ ] Use strong database password
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set NODE_ENV to 'production'
- [ ] Configure CORS properly (specific domains only)
- [ ] Enable CSRF protection
- [ ] Rate limit authentication endpoints
- [ ] Validate all input data
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable database backups
- [ ] Set up error logging
- [ ] Monitor API usage

## Production Deployment

### Using Railway (Recommended for beginners)

1. Create account at https://railway.app
2. Connect GitHub repository
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy automatically

### Using Heroku

```bash
# Login
heroku login

# Create app
heroku create nextdoor-tech-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set env vars
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret

# Deploy
git push heroku main
```

### Using AWS EC2

1. Create EC2 instance (Ubuntu)
2. Install Node.js and PostgreSQL
3. Clone repository
4. Configure environment variables
5. Use PM2 for process management
6. Set up Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

## Monitoring & Logs

### View Server Logs

```bash
# Development
npm run dev

# Production (with PM2)
pm2 logs nextdoor-tech-backend
```

### Database Logs

```bash
# PostgreSQL logs (Linux)
sudo tail -f /var/log/postgresql/postgresql.log
```

## Next Steps

1. ✅ Backend is running
2. 🔗 Connect Vue.js frontend
3. 🧪 Test all endpoints
4. 📦 Set up payment processing
5. 📧 Configure email service
6. 🚀 Deploy to production

## Additional Resources

- Sequelize Docs: https://sequelize.org/
- Express.js: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Stripe Docs: https://stripe.com/docs
- Cloudinary: https://cloudinary.com/documentation

## Support

For issues:
1. Check error messages in console
2. Review `.env` configuration
3. Verify all services are running
4. Check database connection
5. Review API response format
