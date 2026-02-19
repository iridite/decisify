# Decisify API Documentation

## Base URL

**Local Development:** `http://localhost:8000`

**Live Demo Backend:** (Not deployed - frontend only on GitHub Pages)

## Authentication

Currently no authentication required (MVP stage).

## Endpoints

### 1. Health Check

**Endpoint:** `GET /`

**Description:** Simple health check to verify the API is running.

**Response:**
```json
{
  "message": "Decisify Agent is running",
  "status": "healthy"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

**Example:**
```bash
curl http://localhost:8000/
```

---

### 2. Get System Status

**Endpoint:** `GET /status`

**Description:** Returns the complete system state including latest decision, signals, and metadata.

**Response:**
```json
{
  "decision": {
    "action": "BUY",
    "confidence": 0.742,
    "reasoning": "Weighted signal: 0.612 | Dominant source: twitter_sentiment (42.3% weight) | Signal value: 0.742 | Context: Market looking bullish! 🚀",
    "attention_weights": {
      "twitter_sentiment": 0.423,
      "price_volatility": 0.351,
      "news_feed": 0.226
    },
    "timestamp": "2026-02-19T12:30:15.123456",
    "cycle_number": 42,
    "safety_status": "SAFE",
    "override_reason": null
  },
  "signals": [
    {
      "source": "twitter_sentiment",
      "value": 0.742,
      "confidence": 0.85,
      "timestamp": "2026-02-19T12:30:14.500000",
      "context": "Market looking bullish! 🚀"
    },
    {
      "source": "price_volatility",
      "value": 0.034,
      "confidence": 0.95,
      "timestamp": "2026-02-19T12:30:14.600000",
      "context": "Volatility: 3.40%"
    },
    {
      "source": "news_feed",
      "value": 0.521,
      "confidence": 0.78,
      "timestamp": "2026-02-19T12:30:14.700000",
      "context": "Tech sector shows strong growth"
    }
  ],
  "cycle_count": 42,
  "last_update": "2026-02-19T12:30:15.123456"
}
```

**Status Codes:**
- `200 OK` - System state retrieved successfully

**Example:**
```bash
curl http://localhost:8000/status | jq
```

---

### 3. Get Latest Decision

**Endpoint:** `GET /decision`

**Description:** Returns only the latest decision (without signals).

**Response:**
```json
{
  "action": "BUY",
  "confidence": 0.742,
  "reasoning": "Weighted signal: 0.612 | Dominant source: twitter_sentiment (42.3% weight) | Signal value: 0.742 | Context: Market looking bullish! 🚀",
  "attention_weights": {
    "twitter_sentiment": 0.423,
    "price_volatility": 0.351,
    "news_feed": 0.226
  },
  "timestamp": "2026-02-19T12:30:15.123456",
  "cycle_number": 42,
  "safety_status": "SAFE",
  "override_reason": null
}
```

**Status Codes:**
- `200 OK` - Decision retrieved successfully

**Example:**
```bash
curl http://localhost:8000/decision | jq
```

---

### 4. Get Latest Signals

**Endpoint:** `GET /signals`

**Description:** Returns only the latest raw signals (without decision).

**Response:**
```json
[
  {
    "source": "twitter_sentiment",
    "value": 0.742,
    "confidence": 0.85,
    "timestamp": "2026-02-19T12:30:14.500000",
    "context": "Market looking bullish! 🚀"
  },
  {
    "source": "price_volatility",
    "value": 0.034,
    "confidence": 0.95,
    "timestamp": "2026-02-19T12:30:14.600000",
    "context": "Volatility: 3.40%"
  },
  {
    "source": "news_feed",
    "value": 0.521,
    "confidence": 0.78,
    "timestamp": "2026-02-19T12:30:14.700000",
    "context": "Tech sector shows strong growth"
  }
]
```

**Status Codes:**
- `200 OK` - Signals retrieved successfully

**Example:**
```bash
curl http://localhost:8000/signals | jq
```

---

## Data Models

### Signal

Represents a single data point from a perception source.

**Fields:**
- `source` (string) - Identifier for the signal source (e.g., "twitter_sentiment")
- `value` (float) - Normalized signal value [-1.0, 1.0]
  - Positive: Bullish/positive sentiment
  - Negative: Bearish/negative sentiment
  - Zero: Neutral
- `confidence` (float) - Confidence score [0.0, 1.0]
- `timestamp` (datetime) - When the signal was generated
- `context` (string) - Human-readable context or explanation

**Example:**
```json
{
  "source": "twitter_sentiment",
  "value": 0.742,
  "confidence": 0.85,
  "timestamp": "2026-02-19T12:30:14.500000",
  "context": "Market looking bullish! 🚀"
}
```

---

### DecisionChain

Represents a complete decision with full transparency.

**Fields:**
- `action` (string) - Decision action: "BUY", "SELL", or "HOLD"
- `confidence` (float) - Overall confidence [0.0, 1.0]
- `reasoning` (string) - Human-readable explanation of the decision
- `attention_weights` (object) - Attention weights for each signal source
- `timestamp` (datetime) - When the decision was made
- `cycle_number` (int) - Sequential cycle counter
- `safety_status` (string) - "SAFE" or "UNSAFE"
- `override_reason` (string | null) - Reason if decision was overridden by safety gate

**Example:**
```json
{
  "action": "HOLD",
  "confidence": 0.612,
  "reasoning": "SAFETY OVERRIDE: Original action BUY blocked due to high volatility (6.2% > 5.0% threshold)",
  "attention_weights": {
    "twitter_sentiment": 0.423,
    "price_volatility": 0.351,
    "news_feed": 0.226
  },
  "timestamp": "2026-02-19T12:30:15.123456",
  "cycle_number": 42,
  "safety_status": "UNSAFE",
  "override_reason": "Volatility too high for BUY action"
}
```

---

### SystemState

Represents the complete system state.

**Fields:**
- `decision` (DecisionChain) - Latest decision
- `signals` (array[Signal]) - Latest signals from all sources
- `cycle_count` (int) - Total number of decision cycles completed
- `last_update` (datetime) - Timestamp of last state update

---

## Real-time Monitoring

### Polling

Since WebSocket is not yet implemented, use polling for real-time updates:

```bash
# Poll every 2 seconds
watch -n 2 'curl -s http://localhost:8000/decision | jq'
```

### Monitoring Script

```python
import requests
import time

def monitor_decisions(interval=2):
    """Poll the decision endpoint every N seconds"""
    while True:
        try:
            response = requests.get("http://localhost:8000/decision")
            decision = response.json()
            print(f"[{decision['timestamp']}] {decision['action']} "
                  f"(confidence: {decision['confidence']:.2f})")
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(interval)

if __name__ == "__main__":
    monitor_decisions()
```

---

## Error Handling

### Error Response Format

```json
{
  "detail": "Error message here"
}
```

### Common Status Codes

- `200 OK` - Request successful
- `404 Not Found` - Endpoint does not exist
- `500 Internal Server Error` - Server error (check logs)

---

## Rate Limiting

Currently no rate limiting (MVP stage).

**Production Recommendations:**
- 100 requests/minute per IP
- 1000 requests/hour per IP
- Use caching for frequently accessed endpoints

---

## CORS

CORS is enabled for all origins in development mode.

**Production Recommendations:**
- Restrict to specific dashboard domain
- Use proper authentication tokens
- Implement HTTPS only

---

## Future Enhancements

### Planned Features

1. **WebSocket Streaming**
   - Real-time decision updates
   - Signal stream subscription
   - Reduced latency vs polling

2. **Historical Data**
   - `GET /history?limit=100` - Past decisions
   - `GET /signals/history?source=twitter_sentiment` - Signal history
   - Time range filtering

3. **Authentication**
   - JWT tokens
   - API keys
   - Role-based access control

4. **Feedback API**
   - `POST /feedback` - Submit human feedback
   - `GET /feedback/stats` - Feedback statistics

5. **Configuration API**
   - `GET /config` - Current system configuration
   - `PUT /config` - Update parameters (admin only)

6. **Health Metrics**
   - `GET /metrics` - Prometheus-compatible metrics
   - `GET /health` - Detailed health check

---

## Integration Examples

### Python Client

```python
import requests

class DecisifyClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    def get_status(self):
        return requests.get(f"{self.base_url}/status").json()
    
    def get_decision(self):
        return requests.get(f"{self.base_url}/decision").json()
    
    def get_signals(self):
        return requests.get(f"{self.base_url}/signals").json()

# Usage
client = DecisifyClient()
decision = client.get_decision()
print(f"Action: {decision['action']}")
```

### JavaScript Client

```javascript
class DecisifyClient {
  constructor(baseUrl = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }
  
  async getStatus() {
    const response = await fetch(`${this.baseUrl}/status`);
    return response.json();
  }
  
  async getDecision() {
    const response = await fetch(`${this.baseUrl}/decision`);
    return response.json();
  }
  
  async getSignals() {
    const response = await fetch(`${this.baseUrl}/signals`);
    return response.json();
  }
}

// Usage
const client = new DecisifyClient();
const decision = await client.getDecision();
console.log(`Action: ${decision.action}`);
```

### cURL Examples

```bash
# Get full status
curl http://localhost:8000/status | jq

# Get decision only
curl http://localhost:8000/decision | jq '.action'

# Get signals only
curl http://localhost:8000/signals | jq '.[].source'

# Monitor in real-time
watch -n 2 'curl -s http://localhost:8000/decision | jq'
```

---

**Last Updated:** 2026-02-19
