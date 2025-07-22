# Google Trends Integration for ArtistPulse

This integration adds real Google Trends data to ArtistPulse without disrupting existing functionality. The system is designed with graceful fallbacks - if the Google Trends service is unavailable, the dashboard continues to work with all other features intact.

## Architecture

- **Python Microservice**: Standalone Flask service that handles Google Trends API calls
- **Next.js Proxy**: API route that safely proxies requests with fallbacks
- **React Component**: Displays trends data when available, hidden when not
- **Graceful Degradation**: Dashboard works perfectly without trends service

## Quick Start

### 1. Test the Integration
```bash
# Run the integration test
.venv/bin/python python-services/test_integration.py
```

### 2. Start Google Trends Service (Optional)
```bash
# Start the trends microservice
./python-services/start_trends_service.sh
```

The service will run on `http://localhost:5001` and provide:
- `/health` - Health check
- `/trends/interest?artist=<name>` - Search interest over time
- `/trends/regional?artist=<name>` - Regional interest by country
- `/trends/related?artist=<name>` - Related search queries
- `/trends/trending?country=<code>` - Trending searches

### 3. View Trends in Dashboard
- Search for an artist in ArtistPulse
- Google Trends data will appear in the "Geographic Analysis" section
- If the service is unavailable, a notice will be shown but the dashboard continues working

## Features

### Interest Over Time
- 12-month search interest trends
- Peak and average interest metrics
- Interactive line chart

### Regional Analysis
- Top countries by search interest
- Bar chart visualization
- Geographic distribution data

### Related Queries
- Rising search queries with growth percentages
- Top related search terms
- Search behavior insights

## Fallback Behavior

The integration is designed to never break existing functionality:

1. **Service Unavailable**: Shows a notice that the service is not running
2. **API Errors**: Gracefully handles timeouts and errors
3. **No Data**: Displays appropriate "no data" messages
4. **Component Hidden**: Doesn't render if no meaningful data is available

## Technical Details

### API Endpoints

#### Next.js Proxy API
- `GET /api/google-trends?artist=<name>&type=interest`
- `GET /api/google-trends?artist=<name>&type=regional`
- `GET /api/google-trends?artist=<name>&type=related`
- `GET /api/google-trends?type=trending&country=<code>`

#### Response Format
```json
{
  "artist": "Drake",
  "interest_over_time": [
    {"date": "2024-01-01", "interest": 85},
    ...
  ],
  "regional_interest": [
    {"country": "United States", "interest": 100},
    ...
  ],
  "status": "success",
  "service_available": true
}
```

### Error Handling

The system handles various error conditions:
- Network timeouts (15 second limit)
- Service unavailable (connection refused)
- API rate limits (built-in delays)
- Invalid responses (JSON parsing errors)
- No data scenarios (empty results)

### Performance

- **Non-blocking**: Trends data loads asynchronously
- **Cached**: Python service includes rate limiting
- **Timeout Protected**: 15-second maximum wait time
- **Lightweight**: Only loads when data is available

## Development

### Testing Individual Components

```bash
# Test Python environment
.venv/bin/python -c "import pytrends, flask, pandas; print('OK')"

# Test trends service directly
curl http://localhost:5001/health

# Test Next.js proxy
curl "http://localhost:3000/api/google-trends?artist=Drake&type=interest"
```

### Debugging

1. Check if trends service is running: `curl http://localhost:5001/health`
2. View service logs: Check terminal where `start_trends_service.sh` was run
3. Test individual endpoints with artist names
4. Monitor browser network tab for API calls

### Adding New Trend Types

To add new Google Trends data:

1. Add endpoint to `python-services/trends_service.py`
2. Add proxy case to `src/app/api/google-trends/route.ts`
3. Update `GoogleTrends.tsx` component to display new data
4. Add to `googleTrendsApi` in `api-services.ts`

## Troubleshooting

### "Service Unavailable" Message
- The Python microservice is not running
- Start it with: `./python-services/start_trends_service.sh`

### "No Data Available"
- Artist name might not have sufficient search volume
- Try popular artists like "Drake", "Taylor Swift", "Ed Sheeran"

### Slow Loading
- Google Trends API can be slow (up to 10-15 seconds)
- Rate limiting is built-in to prevent blocks
- Data is cached for repeated requests

### Installation Issues
```bash
# Reinstall Python packages
.venv/bin/pip install -r python-services/requirements.txt

# Test imports
.venv/bin/python python-services/test_integration.py
```

## Security Notes

- The trends service runs locally only (`localhost:5001`)
- No API keys required for Google Trends
- CORS enabled for Next.js frontend
- Rate limiting prevents abuse
- Graceful error handling prevents data leaks
