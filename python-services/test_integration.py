#!/usr/bin/env python3
"""
Test script for Google Trends service
"""

import sys
import subprocess
import time
import requests

def test_python_environment():
    """Test if the Python environment is properly configured"""
    try:
        import pytrends
        import flask
        import pandas
        print("✅ Python environment: All required packages installed")
        return True
    except ImportError as e:
        print(f"❌ Python environment: Missing package - {e}")
        return False

def test_trends_service():
    """Test if the trends service can start and respond"""
    print("\n🧪 Testing Google Trends Service...")
    
    # Test health endpoint
    try:
        response = requests.get('http://localhost:5001/health', timeout=5)
        if response.status_code == 200:
            print("✅ Trends service is running and healthy")
            return True
        else:
            print(f"❌ Trends service returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Trends service is not running")
        print("💡 Start it with: ./python-services/start_trends_service.sh")
        return False
    except Exception as e:
        print(f"❌ Error testing trends service: {e}")
        return False

def test_trends_api():
    """Test the trends API with a simple query"""
    try:
        print("\n🎵 Testing trends API with 'Drake'...")
        response = requests.get('http://localhost:5001/trends/interest?artist=Drake', timeout=15)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                print("✅ Trends API working - real data received")
                print(f"   Peak interest: {data.get('peak_interest', 'N/A')}")
                print(f"   Data points: {len(data.get('interest_over_time', []))}")
            else:
                print(f"⚠️  Trends API responded but no data: {data.get('status')}")
            return True
        else:
            print(f"❌ Trends API returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error testing trends API: {e}")
        return False

def test_next_js_proxy():
    """Test the Next.js proxy endpoint"""
    try:
        print("\n🌐 Testing Next.js proxy endpoint...")
        # Try both ports since Next.js might run on 3001 if 3000 is busy
        for port in [3001, 3000]:
            try:
                response = requests.get(f'http://localhost:{port}/api/google-trends?artist=Drake&type=interest', timeout=15)
                if response.status_code == 200:
                    data = response.json()
                    print(f"✅ Next.js proxy working (port {port})")
                    if data.get('fallback'):
                        print("⚠️  Using fallback data (service unavailable)")
                    else:
                        print("✅ Real Google Trends data available")
                    return True
                else:
                    print(f"❌ Next.js proxy returned status {response.status_code} (port {port})")
            except requests.exceptions.ConnectionError:
                continue
        
        print("❌ Next.js development server is not running on ports 3000 or 3001")
        print("💡 Start it with: npm run dev")
        return False
    except Exception as e:
        print(f"❌ Error testing Next.js proxy: {e}")
        return False

def main():
    print("🔍 ArtistPulse Google Trends Integration Test")
    print("=" * 50)
    
    # Test Python environment
    env_ok = test_python_environment()
    
    # Test trends service
    service_ok = test_trends_service()
    
    # Test trends API if service is running
    api_ok = False
    if service_ok:
        api_ok = test_trends_api()
    
    # Test Next.js proxy
    proxy_ok = test_next_js_proxy()
    
    print("\n📊 Test Results:")
    print("=" * 20)
    print(f"Python Environment: {'✅' if env_ok else '❌'}")
    print(f"Trends Service:     {'✅' if service_ok else '❌'}")
    print(f"Trends API:         {'✅' if api_ok else '❌'}")
    print(f"Next.js Proxy:      {'✅' if proxy_ok else '❌'}")
    
    if all([env_ok, proxy_ok]):
        print("\n🎉 Google Trends integration is working!")
        if not service_ok:
            print("💡 Start the trends service for real data: ./python-services/start_trends_service.sh")
        else:
            print("🚀 All systems operational!")
    else:
        print("\n⚠️  Some issues found. Check the messages above.")
    
    return 0 if all([env_ok, proxy_ok]) else 1

if __name__ == "__main__":
    sys.exit(main())
