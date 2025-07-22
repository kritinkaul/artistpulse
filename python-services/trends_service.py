"""
Google Trends Microservice for ArtistPulse

This service provides Google Trends data for artists without disrupting
the main Next.js application. It runs as a standalone Flask API.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from pytrends.request import TrendReq
import pandas as pd
import json
from datetime import datetime, timedelta
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for Next.js frontend

# Initialize pytrends
pytrends = TrendReq(hl='en-US', tz=360)

def safe_trends_request(func, *args, **kwargs):
    """Safely execute pytrends requests with error handling and rate limiting"""
    try:
        time.sleep(1)  # Rate limiting
        return func(*args, **kwargs)
    except Exception as e:
        logger.error(f"Trends request failed: {str(e)}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "google-trends"})

@app.route('/trends/interest', methods=['GET'])
def get_artist_interest():
    """Get Google Trends interest over time for an artist"""
    try:
        artist_name = request.args.get('artist')
        if not artist_name:
            return jsonify({"error": "Artist name is required"}), 400
        
        # Set timeframe (last 12 months)
        timeframe = 'today 12-m'
        
        # Build payload
        pytrends.build_payload([artist_name], cat=0, timeframe=timeframe, geo='', gprop='')
        
        # Get interest over time
        interest_data = safe_trends_request(pytrends.interest_over_time)
        
        if interest_data is None or interest_data.empty:
            return jsonify({
                "artist": artist_name,
                "interest_over_time": [],
                "peak_interest": 0,
                "average_interest": 0,
                "status": "no_data"
            })
        
        # Convert to JSON-friendly format
        interest_data = interest_data.drop('isPartial', axis=1, errors='ignore')
        interest_list = []
        
        for date, row in interest_data.iterrows():
            interest_list.append({
                "date": date.strftime('%Y-%m-%d'),
                "interest": int(row[artist_name])
            })
        
        # Calculate metrics
        values = [item['interest'] for item in interest_list]
        peak_interest = max(values) if values else 0
        average_interest = sum(values) / len(values) if values else 0
        
        return jsonify({
            "artist": artist_name,
            "interest_over_time": interest_list,
            "peak_interest": peak_interest,
            "average_interest": round(average_interest, 1),
            "timeframe": "12 months",
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Error getting artist interest: {str(e)}")
        return jsonify({
            "error": "Failed to fetch trends data",
            "details": str(e),
            "status": "error"
        }), 500

@app.route('/trends/regional', methods=['GET'])
def get_regional_interest():
    """Get Google Trends regional interest for an artist"""
    try:
        artist_name = request.args.get('artist')
        if not artist_name:
            return jsonify({"error": "Artist name is required"}), 400
        
        # Set timeframe (last 12 months)
        timeframe = 'today 12-m'
        
        # Build payload
        pytrends.build_payload([artist_name], cat=0, timeframe=timeframe, geo='', gprop='')
        
        # Get regional interest
        regional_data = safe_trends_request(pytrends.interest_by_region, resolution='COUNTRY', inc_low_vol=True, inc_geo_code=False)
        
        if regional_data is None or regional_data.empty:
            return jsonify({
                "artist": artist_name,
                "regional_interest": [],
                "top_countries": [],
                "status": "no_data"
            })
        
        # Convert to JSON-friendly format
        regional_list = []
        for country, row in regional_data.iterrows():
            if row[artist_name] > 0:  # Only include countries with interest
                regional_list.append({
                    "country": country,
                    "interest": int(row[artist_name])
                })
        
        # Sort by interest and get top countries
        regional_list.sort(key=lambda x: x['interest'], reverse=True)
        top_countries = regional_list[:10]  # Top 10 countries
        
        return jsonify({
            "artist": artist_name,
            "regional_interest": regional_list,
            "top_countries": top_countries,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Error getting regional interest: {str(e)}")
        return jsonify({
            "error": "Failed to fetch regional trends data",
            "details": str(e),
            "status": "error"
        }), 500

@app.route('/trends/related', methods=['GET'])
def get_related_queries():
    """Get related queries for an artist"""
    try:
        artist_name = request.args.get('artist')
        if not artist_name:
            return jsonify({"error": "Artist name is required"}), 400
        
        # Set timeframe (last 12 months)
        timeframe = 'today 12-m'
        
        # Build payload
        pytrends.build_payload([artist_name], cat=0, timeframe=timeframe, geo='', gprop='')
        
        # Get related queries
        related_data = safe_trends_request(pytrends.related_queries)
        
        if related_data is None or not related_data.get(artist_name):
            return jsonify({
                "artist": artist_name,
                "rising_queries": [],
                "top_queries": [],
                "status": "no_data"
            })
        
        artist_data = related_data[artist_name]
        
        # Process rising queries
        rising_queries = []
        if artist_data.get('rising') is not None and not artist_data['rising'].empty:
            for _, row in artist_data['rising'].head(10).iterrows():
                rising_queries.append({
                    "query": row['query'],
                    "value": row['value']
                })
        
        # Process top queries
        top_queries = []
        if artist_data.get('top') is not None and not artist_data['top'].empty:
            for _, row in artist_data['top'].head(10).iterrows():
                top_queries.append({
                    "query": row['query'],
                    "value": int(row['value']) if str(row['value']).isdigit() else row['value']
                })
        
        return jsonify({
            "artist": artist_name,
            "rising_queries": rising_queries,
            "top_queries": top_queries,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Error getting related queries: {str(e)}")
        return jsonify({
            "error": "Failed to fetch related queries",
            "details": str(e),
            "status": "error"
        }), 500

@app.route('/trends/trending', methods=['GET'])
def get_trending_searches():
    """Get trending searches (daily trends)"""
    try:
        country = request.args.get('country', 'US')
        
        # Get trending searches
        trending_data = safe_trends_request(pytrends.trending_searches, pn=country)
        
        if trending_data is None or trending_data.empty:
            return jsonify({
                "country": country,
                "trending_searches": [],
                "status": "no_data"
            })
        
        # Convert to list
        trending_list = trending_data[0].head(20).tolist()  # Top 20 trending
        
        return jsonify({
            "country": country,
            "trending_searches": trending_list,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Error getting trending searches: {str(e)}")
        return jsonify({
            "error": "Failed to fetch trending searches",
            "details": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    print("Starting Google Trends Microservice...")
    print("Available endpoints:")
    print("  GET /health - Health check")
    print("  GET /trends/interest?artist=<name> - Interest over time")
    print("  GET /trends/regional?artist=<name> - Regional interest")
    print("  GET /trends/related?artist=<name> - Related queries")
    print("  GET /trends/trending?country=<code> - Trending searches")
    
    app.run(host='0.0.0.0', port=5001, debug=False)
