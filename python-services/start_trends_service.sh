#!/bin/bash

# Google Trends Microservice Startup Script
# This script starts the Google Trends service on port 5001

echo "Starting Google Trends Microservice..."
echo "Service will be available at http://localhost:5001"
echo "Health check: http://localhost:5001/health"
echo ""
echo "Available endpoints:"
echo "  GET /health - Health check"
echo "  GET /trends/interest?artist=<name> - Interest over time"
echo "  GET /trends/regional?artist=<name> - Regional interest"
echo "  GET /trends/related?artist=<name> - Related queries"
echo "  GET /trends/trending?country=<code> - Trending searches"
echo ""

# Activate virtual environment and run the service
cd "$(dirname "$0")/.."
.venv/bin/python python-services/trends_service.py
