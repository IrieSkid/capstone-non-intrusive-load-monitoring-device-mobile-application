# NILM System - API Endpoints Reference

This document outlines the recommended API endpoints for the NILM mobile application.

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-backend.railway.app/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone_number": "+639123456789",
  "role": "homeowner"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "homeowner"
  }
}
```

---

### POST `/auth/login`
Login and get JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 86400,
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "homeowner"
  }
}
```

---

### POST `/auth/logout`
Logout and invalidate session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### POST `/auth/refresh`
Refresh JWT token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "token": "new_jwt_token...",
  "expires_in": 86400
}
```

---

## Device Management Endpoints

### GET `/devices`
Get all devices for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "device_id": 1,
      "device_name": "Main Meter",
      "device_serial_number": "NILM-001",
      "location": "Living Room",
      "status": "online",
      "last_sync_at": "2024-01-15T10:30:00Z",
      "appliance_count": 5
    }
  ]
}
```

---

### POST `/devices`
Register a new device.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "device_name": "Main Meter",
  "device_serial_number": "NILM-001",
  "mac_address": "AA:BB:CC:DD:EE:FF",
  "location": "Living Room",
  "wifi_ssid": "HomeWiFi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Device registered successfully",
  "data": {
    "device_id": 1,
    "device_name": "Main Meter",
    "status": "offline"
  }
}
```

---

### GET `/devices/:deviceId`
Get device details.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "device_id": 1,
    "device_name": "Main Meter",
    "device_serial_number": "NILM-001",
    "location": "Living Room",
    "status": "online",
    "last_sync_at": "2024-01-15T10:30:00Z",
    "appliances": [
      {
        "appliance_id": 1,
        "appliance_name": "Refrigerator",
        "appliance_type": "refrigerator",
        "status": "on",
        "current_power": 150.5
      }
    ]
  }
}
```

---

### PUT `/devices/:deviceId`
Update device information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "device_name": "Updated Name",
  "location": "Kitchen"
}
```

---

### DELETE `/devices/:deviceId`
Delete a device.

**Headers:** `Authorization: Bearer <token>`

---

## Appliance Management Endpoints

### GET `/devices/:deviceId/appliances`
Get all appliances for a device.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "appliance_id": 1,
      "appliance_name": "Refrigerator",
      "appliance_type": "refrigerator",
      "port_number": 1,
      "rated_watts": 200,
      "status": "on"
    }
  ]
}
```

---

### POST `/devices/:deviceId/appliances`
Add a new appliance.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "appliance_name": "Air Conditioner",
  "appliance_type": "ac",
  "port_number": 2,
  "rated_watts": 1500
}
```

---

### PUT `/appliances/:applianceId`
Update appliance information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "appliance_name": "Updated Name",
  "rated_watts": 1800
}
```

---

### DELETE `/appliances/:applianceId`
Delete an appliance.

**Headers:** `Authorization: Bearer <token>`

---

## Real-Time Data Endpoints

### POST `/devices/:deviceId/readings`
**IoT Device Endpoint** - Submit reading data from hardware.

**Headers:** `X-Device-API-Key: <device_api_key>`

**Request Body:**
```json
{
  "appliance_id": 1,
  "voltage_rms": 220.5,
  "current_rms": 0.68,
  "power_watts": 150.0,
  "apparent_power_va": 150.0,
  "power_factor": 1.0,
  "energy_kwh": 0.00015,
  "recorded_at": "2024-01-15T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reading saved successfully",
  "reading_id": 12345
}
```

---

### GET `/devices/:deviceId/readings/realtime`
Get latest real-time readings for a device.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `appliance_id` (optional): Filter by appliance

**Response:**
```json
{
  "success": true,
  "data": {
    "device_id": 1,
    "timestamp": "2024-01-15T10:30:00Z",
    "readings": [
      {
        "appliance_id": 1,
        "appliance_name": "Refrigerator",
        "voltage_rms": 220.5,
        "current_rms": 0.68,
        "power_watts": 150.0,
        "apparent_power_va": 150.0,
        "power_factor": 1.0,
        "energy_kwh": 0.00015,
        "status": "on"
      }
    ],
    "total_power": 150.0,
    "total_energy": 0.00015
  }
}
```

---

### GET `/devices/:deviceId/readings/history`
Get historical readings.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `appliance_id` (optional): Filter by appliance
- `start_date`: Start date (ISO 8601)
- `end_date`: End date (ISO 8601)
- `limit`: Number of records (default: 100, max: 1000)
- `offset`: Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "readings": [
      {
        "reading_id": 12345,
        "appliance_id": 1,
        "appliance_name": "Refrigerator",
        "voltage_rms": 220.5,
        "current_rms": 0.68,
        "power_watts": 150.0,
        "recorded_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 1000,
      "limit": 100,
      "offset": 0,
      "has_more": true
    }
  }
}
```

---

## Consumption & Reports Endpoints

### GET `/consumption/summary`
Get consumption summary.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period_type`: `daily`, `weekly`, or `monthly`
- `start_date`: Start date (YYYY-MM-DD)
- `end_date`: End date (YYYY-MM-DD)
- `device_id` (optional): Filter by device
- `appliance_id` (optional): Filter by appliance

**Response:**
```json
{
  "success": true,
  "data": {
    "period_type": "daily",
    "period_start": "2024-01-01",
    "period_end": "2024-01-31",
    "total_kwh": 150.5,
    "total_cost_php": 1881.25,
    "breakdown": [
      {
        "appliance_id": 1,
        "appliance_name": "Refrigerator",
        "total_kwh": 50.2,
        "total_cost_php": 627.5,
        "percentage": 33.3
      }
    ]
  }
}
```

---

### GET `/consumption/chart`
Get chart data for consumption visualization.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `period_type`: `daily`, `weekly`, or `monthly`
- `start_date`: Start date
- `end_date`: End date
- `device_id` (optional)
- `appliance_id` (optional)
- `group_by`: `hour`, `day`, `week`, or `month`

**Response:**
```json
{
  "success": true,
  "data": {
    "labels": ["2024-01-01", "2024-01-02", "2024-01-03"],
    "datasets": [
      {
        "label": "Energy Consumption (kWh)",
        "data": [5.2, 5.5, 5.8]
      },
      {
        "label": "Cost (PHP)",
        "data": [65.0, 68.75, 72.5]
      }
    ]
  }
}
```

---

## Notification Endpoints

### GET `/notifications`
Get user notifications.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `is_read` (optional): Filter by read status (`true`/`false`)
- `type` (optional): Filter by type
- `limit`: Number of records (default: 20)
- `offset`: Pagination offset

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notification_id": 1,
        "title": "High Power Consumption",
        "message": "Refrigerator is consuming more than threshold",
        "type": "alert",
        "priority": "high",
        "is_read": false,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "unread_count": 5,
    "pagination": {
      "total": 20,
      "limit": 20,
      "offset": 0
    }
  }
}
```

---

### PUT `/notifications/:notificationId/read`
Mark notification as read.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

### PUT `/notifications/read-all`
Mark all notifications as read.

**Headers:** `Authorization: Bearer <token>`

---

### DELETE `/notifications/:notificationId`
Delete a notification.

**Headers:** `Authorization: Bearer <token>`

---

## Alert Rules Endpoints

### GET `/alert-rules`
Get all alert rules for user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rule_id": 1,
      "appliance_id": 1,
      "appliance_name": "Refrigerator",
      "alert_type": "power_threshold",
      "threshold_value": 200,
      "condition": ">",
      "severity": "high",
      "is_active": true
    }
  ]
}
```

---

### POST `/alert-rules`
Create a new alert rule.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "appliance_id": 1,
  "alert_type": "power_threshold",
  "threshold_value": 200,
  "condition": ">",
  "severity": "high"
}
```

---

### PUT `/alert-rules/:ruleId`
Update an alert rule.

**Headers:** `Authorization: Bearer <token>`

---

### DELETE `/alert-rules/:ruleId`
Delete an alert rule.

**Headers:** `Authorization: Bearer <token>`

---

## Settings Endpoints

### GET `/settings`
Get system settings.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `category` (optional): Filter by category

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "setting_key": "app_name",
      "setting_value": "NILM Monitoring System",
      "category": "general",
      "is_public": true
    }
  ]
}
```

---

### GET `/settings/:key`
Get a specific setting.

**Headers:** `Authorization: Bearer <token>`

---

## User Profile Endpoints

### GET `/users/me`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone_number": "+639123456789",
    "role": "homeowner",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### PUT `/users/me`
Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "full_name": "John Updated",
  "phone_number": "+639123456789"
}
```

---

### PUT `/users/me/password`
Change password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `SERVER_ERROR` (500): Internal server error

---

## Rate Limiting

- **General endpoints**: 100 requests per minute per user
- **Reading submission**: 60 requests per minute per device
- **Authentication endpoints**: 5 requests per minute per IP

---

## WebSocket (Optional - for Real-Time Updates)

### Connection
```
ws://your-backend.railway.app/ws?token=<jwt_token>
```

### Events

**Subscribe to device updates:**
```json
{
  "event": "subscribe",
  "device_id": 1
}
```

**Receive real-time reading:**
```json
{
  "event": "reading",
  "data": {
    "device_id": 1,
    "appliance_id": 1,
    "power_watts": 150.0,
    "recorded_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## Notes for Implementation

1. **Pagination**: Use `limit` and `offset` for large datasets
2. **Filtering**: Support filtering by date ranges, device, appliance
3. **Sorting**: Allow sorting by timestamp, power, etc.
4. **Caching**: Cache consumption summaries for better performance
5. **Validation**: Validate all input data on backend
6. **Security**: Use HTTPS in production, validate JWT tokens
7. **Error Handling**: Return consistent error format
8. **Documentation**: Use Swagger/OpenAPI for API documentation

