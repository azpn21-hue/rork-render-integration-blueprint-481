# 🔌 R3AL Connection - API Reference

Complete API documentation for the RORK REAR microservice architecture.

---

## 🌐 Base URLs

### Production
```
Gateway:    https://rork-gateway.onrender.com
Auth:       https://auth-service.onrender.com
Hive:       https://hive-core.onrender.com
Vault:      https://vault-service.onrender.com
Comms:      https://comms-gateway.onrender.com
Payments:   https://monetization-engine.onrender.com
Telemetry:  https://telemetry-daemon.onrender.com
```

---

## 🔐 Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### Get Token

**Endpoint**: `POST /auth/login`  
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 📡 API Gateway Service

Base URL: `https://rork-gateway.onrender.com`

### Health Check

**GET** `/health`

Check if gateway is operational.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "services": {
    "auth": "online",
    "hive": "online",
    "vault": "online",
    "comms": "online",
    "payments": "online"
  }
}
```

### Proxy Request

**ANY** `/api/*`

Routes requests to appropriate microservices.

---

## 🔑 Auth Service

Base URL: `https://auth-service.onrender.com`

### Register User

**POST** `/auth/register`

**Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

**POST** `/auth/login`

**Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Refresh Token

**POST** `/auth/refresh`

**Headers**:
```
Authorization: Bearer <refresh_token>
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

### Logout

**POST** `/auth/logout`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🧠 Hive Core Service

Base URL: `https://hive-core.onrender.com`

AI reasoning, sentiment analysis, and user matching.

### Analyze Sentiment

**POST** `/hive/analyze`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "text": "I'm really enjoying this app!",
  "context": "user_feedback"
}
```

**Response**:
```json
{
  "sentiment": "positive",
  "score": 0.92,
  "emotions": ["joy", "satisfaction"],
  "keywords": ["enjoying", "app"]
}
```

### Get Matches

**GET** `/hive/matches`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Params**:
- `limit` (optional): Number of matches (default: 10)
- `minScore` (optional): Minimum match score (0-1)

**Response**:
```json
{
  "matches": [
    {
      "userId": "user_456",
      "score": 0.87,
      "commonInterests": ["tech", "music"],
      "compatibility": "high"
    }
  ]
}
```

### Update User Profile

**POST** `/hive/profile`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "interests": ["technology", "music", "travel"],
  "preferences": {
    "ageRange": [25, 35],
    "location": "San Francisco"
  }
}
```

**Response**:
```json
{
  "success": true,
  "profileUpdated": true
}
```

---

## 🔒 Vault Service

Base URL: `https://vault-service.onrender.com`

Encryption, biometrics, and secure storage.

### Health Check

**GET** `/ping`

**Response**:
```json
{
  "status": "operational",
  "encryption": "active"
}
```

### Encrypt Data

**POST** `/vault/encrypt`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "data": "sensitive information",
  "algorithm": "AES-256-GCM"
}
```

**Response**:
```json
{
  "encrypted": "U2FsdGVkX1...",
  "keyId": "key_789",
  "algorithm": "AES-256-GCM"
}
```

### Decrypt Data

**POST** `/vault/decrypt`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "encrypted": "U2FsdGVkX1...",
  "keyId": "key_789"
}
```

**Response**:
```json
{
  "data": "sensitive information"
}
```

### Store Secret

**POST** `/vault/secrets`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "key": "api_key",
  "value": "sk_live_abc123",
  "ttl": 3600
}
```

**Response**:
```json
{
  "success": true,
  "secretId": "secret_xyz"
}
```

---

## 💬 Communications Gateway

Base URL: `https://comms-gateway.onrender.com`

Chat, voice calls, and WebRTC signaling.

### Send Message

**POST** `/comms/messages`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "recipientId": "user_456",
  "content": "Hello there!",
  "type": "text"
}
```

**Response**:
```json
{
  "messageId": "msg_abc123",
  "timestamp": "2025-01-15T10:30:00Z",
  "status": "sent"
}
```

### Get Messages

**GET** `/comms/messages`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Params**:
- `conversationId`: ID of conversation
- `limit`: Number of messages (default: 50)
- `before`: Timestamp for pagination

**Response**:
```json
{
  "messages": [
    {
      "id": "msg_abc123",
      "senderId": "user_123",
      "content": "Hello!",
      "timestamp": "2025-01-15T10:30:00Z",
      "status": "delivered"
    }
  ],
  "hasMore": true
}
```

### WebSocket Connection

**WS** `/comms/ws`

Connect via WebSocket for real-time messaging.

**Connection**:
```javascript
const ws = new WebSocket('wss://comms-gateway.onrender.com/ws?token=<jwt_token>');

ws.on('message', (data) => {
  console.log('New message:', JSON.parse(data));
});

ws.send(JSON.stringify({
  type: 'message',
  recipientId: 'user_456',
  content: 'Hello!'
}));
```

---

## 💳 Monetization Engine

Base URL: `https://monetization-engine.onrender.com`

Stripe payments and subscriptions.

### Create Payment Intent

**POST** `/payments/intent`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "amount": 999,
  "currency": "usd",
  "description": "Premium subscription"
}
```

**Response**:
```json
{
  "clientSecret": "pi_abc123_secret_xyz",
  "paymentIntentId": "pi_abc123"
}
```

### Create Subscription

**POST** `/payments/subscriptions`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "priceId": "price_abc123",
  "paymentMethodId": "pm_xyz789"
}
```

**Response**:
```json
{
  "subscriptionId": "sub_abc123",
  "status": "active",
  "currentPeriodEnd": "2025-02-15T10:30:00Z"
}
```

### Get Subscriptions

**GET** `/payments/subscriptions`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "subscriptions": [
    {
      "id": "sub_abc123",
      "status": "active",
      "plan": "premium",
      "currentPeriodEnd": "2025-02-15T10:30:00Z"
    }
  ]
}
```

### Cancel Subscription

**DELETE** `/payments/subscriptions/:subscriptionId`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "success": true,
  "subscription": {
    "id": "sub_abc123",
    "status": "canceled",
    "cancelAt": "2025-02-15T10:30:00Z"
  }
}
```

---

## 📊 Telemetry Daemon

Base URL: `https://telemetry-daemon.onrender.com`

System monitoring and performance metrics.

### Get System Health

**GET** `/telemetry/health`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
  "overall": "healthy",
  "services": {
    "gateway": { "status": "online", "latency": 45 },
    "auth": { "status": "online", "latency": 32 },
    "hive": { "status": "online", "latency": 78 },
    "vault": { "status": "online", "latency": 41 },
    "comms": { "status": "online", "latency": 52 },
    "payments": { "status": "online", "latency": 67 }
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Get Metrics

**GET** `/telemetry/metrics`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Params**:
- `service`: Service name (optional)
- `metric`: Metric type (cpu, memory, requests)
- `period`: Time period (1h, 24h, 7d, 30d)

**Response**:
```json
{
  "service": "gateway",
  "metric": "requests",
  "period": "24h",
  "data": [
    { "timestamp": "2025-01-15T09:00:00Z", "value": 1234 },
    { "timestamp": "2025-01-15T10:00:00Z", "value": 1567 }
  ]
}
```

### Report Event

**POST** `/telemetry/events`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Body**:
```json
{
  "event": "user_action",
  "action": "login",
  "userId": "user_123",
  "metadata": {
    "platform": "ios",
    "version": "1.0.0"
  }
}
```

**Response**:
```json
{
  "success": true,
  "eventId": "evt_abc123"
}
```

---

## 🚨 Error Codes

All services use standard HTTP status codes:

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily down |

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Email is required",
    "field": "email"
  }
}
```

---

## 🔄 Rate Limits

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| Auth endpoints | 10 requests | 1 minute |
| Hive Core | 100 requests | 1 minute |
| Vault | 50 requests | 1 minute |
| Comms | 200 requests | 1 minute |
| Payments | 30 requests | 1 minute |
| Telemetry | Unlimited | - |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642252800
```

---

## 🧪 Testing APIs

### Using cURL

```bash
# Login
curl -X POST https://auth-service.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get matches
curl -X GET https://hive-core.onrender.com/hive/matches \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Import collection from API docs
2. Set environment variable `BASE_URL`
3. Configure authentication token
4. Run requests

### Using Axios (React Native)

```typescript
import { api } from '@/app/config/api';

// Login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// Set token for future requests
api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

// Get matches
const matches = await api.get('/hive/matches');
```

---

## 📚 SDK Examples

### React Native

```typescript
import { api } from '@/app/config/api';

// Authentication
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  
  logout: () => api.post('/auth/logout'),
};

// Hive Core
export const hiveAPI = {
  getMatches: (limit?: number) =>
    api.get('/hive/matches', { params: { limit } }),
  
  analyze: (text: string) =>
    api.post('/hive/analyze', { text }),
};

// Usage
const { data } = await authAPI.login('user@example.com', 'password');
const matches = await hiveAPI.getMatches(10);
```

---

## 🔐 Security Best Practices

1. **Always use HTTPS** in production
2. **Store tokens securely** using AsyncStorage or Keychain
3. **Refresh tokens** before expiration
4. **Validate input** on client and server
5. **Handle errors gracefully**
6. **Log security events**
7. **Rate limit requests**
8. **Sanitize user input**

---

**API Reference Complete! Ready to integrate? 🚀**
