# SK8 Payment Service 💳

A robust and secure Node.js microservice for handling payment processing with Stripe integration, designed specifically for the SK8 skateboarding platform.

## 🚀 Features

- **One-time Payments**: Create secure payment intents for single transactions
- **Subscription Management**: Handle recurring subscription payments
- **Stripe Integration**: Full Stripe API integration with latest best practices
- **TypeScript Support**: Fully typed codebase for better development experience
- **CORS Enabled**: Cross-origin resource sharing for frontend integration
- **Environment-based Configuration**: Secure configuration management
- **Error Handling**: Comprehensive error handling and validation

## 📋 Table of Contents

- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Stripe account with API keys
- TypeScript knowledge (recommended)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/zkerkeb-class/payment-services-aladdinbruv.git
   cd payment-services-aladdinbruv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (see [Environment Setup](#environment-setup))

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the service**
   ```bash
   npm start
   ```

   For development with hot reload:
   ```bash
   npm run dev
   ```

## ⚙️ Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3005

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PRICE_ID=price_your_stripe_price_id_here

# Optional: For production
# STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key_here
```

### Environment Variables Explained

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | 3005 |
| `STRIPE_SECRET_KEY` | Your Stripe secret key (test or live) | Yes | - |
| `STRIPE_PRICE_ID` | Stripe Price ID for subscriptions | Yes (for subscriptions) | - |

### Getting Stripe Credentials

1. **Sign up for Stripe**: Visit [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: Navigate to Developers → API keys in your Stripe dashboard
3. **Create Products/Prices**: For subscriptions, create products and prices in the Stripe dashboard
4. **Copy the Price ID**: Use this for the `STRIPE_PRICE_ID` environment variable

## 📚 API Documentation

### Base URL
```
http://localhost:3005/api/payments
```

### Endpoints

#### 1. Create Payment Intent

Creates a new payment intent for one-time payments.

**Endpoint:** `POST /create-payment-intent`

**Request Body:**
```json
{
  "amount": 2000
}
```

**Parameters:**
- `amount` (number, required): Payment amount in cents (e.g., 2000 = $20.00)

**Response:**
```json
{
  "clientSecret": "pi_1234567890_secret_abcdef"
}
```

**Error Response:**
```json
{
  "error": "A valid amount is required."
}
```

#### 2. Create Subscription

Creates a new subscription for recurring payments.

**Endpoint:** `POST /create-subscription`

**Request Body:**
```json
{
  "email": "user@example.com",
  "planType": "premium"
}
```

**Parameters:**
- `email` (string, required): User's email address
- `planType` (string, optional): Subscription plan type (for reference)

**Response:**
```json
{
  "subscriptionId": "sub_1234567890",
  "clientSecret": "pi_1234567890_secret_abcdef"
}
```

**Error Response:**
```json
{
  "error": "Email is required."
}
```

## 💡 Usage Examples

### Frontend Integration (JavaScript)

#### One-time Payment
```javascript
// Create payment intent
const response = await fetch('http://localhost:3005/api/payments/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 2000, // $20.00
  }),
});

const { clientSecret } = await response.json();

// Use with Stripe Elements
const stripe = Stripe('pk_test_your_publishable_key');
const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'Customer name',
    },
  },
});
```

#### Subscription Payment
```javascript
// Create subscription
const response = await fetch('http://localhost:3005/api/payments/create-subscription', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'customer@example.com',
    planType: 'premium',
  }),
});

const { subscriptionId, clientSecret } = await response.json();

// Confirm the subscription payment
const stripe = Stripe('pk_test_your_publishable_key');
const result = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: {
      name: 'Customer name',
      email: 'customer@example.com',
    },
  },
});
```

### cURL Examples

#### Create Payment Intent
```bash
curl -X POST http://localhost:3005/api/payments/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000}'
```

#### Create Subscription
```bash
curl -X POST http://localhost:3005/api/payments/create-subscription \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com", "planType": "premium"}'
```

## 🔧 Development

### Project Structure

```
src/
├── app.ts              # Express application setup
├── server.ts           # Server entry point
├── config/
│   └── index.ts        # Environment configuration
├── controllers/
│   └── payment.controller.ts  # Request handlers
├── routes/
│   └── payment.routes.ts      # Route definitions
└── services/
    └── payment.service.ts     # Business logic & Stripe integration
```

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Run tests (when implemented)
npm test

# Lint code (when configured)
npm run lint
```

### Code Quality

This project follows TypeScript best practices:

- **Type Safety**: Full TypeScript integration with strict mode
- **Error Handling**: Comprehensive try-catch blocks and validation
- **Separation of Concerns**: Clear separation between routes, controllers, and services
- **Environment Configuration**: Secure configuration management

## 🧪 Testing

### Unit Tests (Coming Soon)

We recommend implementing tests for:

- Payment intent creation
- Subscription creation
- Error handling scenarios
- Input validation

Example test structure:
```typescript
describe('Payment Service', () => {
  test('should create payment intent with valid amount', async () => {
    // Test implementation
  });

  test('should reject invalid amount', async () => {
    // Test implementation
  });
});
```

### Integration Testing

Test the service with actual Stripe test keys:

1. Use Stripe test card numbers
2. Verify webhook handling (when implemented)
3. Test error scenarios

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t sk8-payment-service .
   ```

2. **Run container**
   ```bash
   docker run -p 3005:3005 \
     -e STRIPE_SECRET_KEY=your_key \
     -e STRIPE_PRICE_ID=your_price_id \
     sk8-payment-service
   ```

### Cloud Deployment

#### Heroku
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Set environment variables
heroku config:set STRIPE_SECRET_KEY=your_key
heroku config:set STRIPE_PRICE_ID=your_price_id

# Deploy
git push heroku main
```

#### AWS/GCP/Azure
- Use environment variable configuration
- Ensure HTTPS in production
- Configure proper security groups/firewall rules
- Set up health checks on the root endpoint

### Production Considerations

- **HTTPS Only**: Always use HTTPS in production
- **Environment Variables**: Never commit secrets to version control
- **Rate Limiting**: Implement rate limiting to prevent abuse
- **Monitoring**: Set up logging and monitoring
- **Webhooks**: Implement Stripe webhooks for payment confirmations

## 🔒 Security

### Best Practices Implemented

- Environment-based secret management
- CORS configuration
- Input validation
- Error message sanitization
- Stripe API best practices

### Additional Recommendations

- Implement rate limiting
- Add request logging
- Use HTTPS in production
- Validate webhook signatures
- Implement proper authentication

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Add JSDoc comments for functions
- Use meaningful variable names
- Handle errors appropriately

### Reporting Issues

When reporting issues, please include:

- Node.js version
- npm version
- Error messages
- Steps to reproduce
- Expected vs actual behavior

## 📝 API Reference Summary

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/create-payment-intent` | POST | Create one-time payment | `{amount: number}` | `{clientSecret: string}` |
| `/create-subscription` | POST | Create subscription | `{email: string, planType?: string}` | `{subscriptionId: string, clientSecret: string}` |

## 🔗 Related Services

This payment service is part of the SK8 microservices ecosystem:

- **Auth Service**: User authentication and authorization
- **Spot Service**: Skateboarding spot management
- **Notification Service**: Push notifications and alerts

## 📞 Support

For support and questions:

- Create an issue in this repository
- Check the [Stripe documentation](https://stripe.com/docs)
- Review the code examples above

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stripe](https://stripe.com) for excellent payment processing APIs
- [Express.js](https://expressjs.com) for the web framework
- [TypeScript](https://www.typescriptlang.org) for type safety

---

**Happy Skating! 🛹**

Built with ❤️ for the skateboarding community. 