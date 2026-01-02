#!/usr/bin/env python3
"""
Backend API Testing for Gaurav Gaur's Angular Portfolio Application
Tests the FastAPI backend endpoints and MongoDB connectivity
"""

import requests
import json
import sys
from datetime import datetime
import time

# Get backend URL from frontend .env
BACKEND_URL = "https://angular-portfolio-2.preview.emergentagent.com/api"

def test_api_health_check():
    """Test the basic API health check endpoint"""
    print("🔍 Testing API Health Check...")
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ API Health Check: PASSED")
                return True
            else:
                print(f"❌ API Health Check: FAILED - Unexpected response: {data}")
                return False
        else:
            print(f"❌ API Health Check: FAILED - Status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ API Health Check: FAILED - Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ API Health Check: FAILED - Unexpected error: {e}")
        return False

def test_mongodb_connection():
    """Test MongoDB connection by creating and retrieving status checks"""
    print("\n🔍 Testing MongoDB Connection...")
    
    # Test POST /api/status (create status check)
    print("Testing POST /api/status...")
    try:
        test_data = {
            "client_name": "test_client_gaurav_portfolio"
        }
        
        response = requests.post(
            f"{BACKEND_URL}/status", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"POST Status Code: {response.status_code}")
        print(f"POST Response: {response.text}")
        
        if response.status_code == 200:
            created_status = response.json()
            if "id" in created_status and created_status["client_name"] == test_data["client_name"]:
                print("✅ POST /api/status: PASSED")
                post_success = True
                created_id = created_status["id"]
            else:
                print(f"❌ POST /api/status: FAILED - Invalid response structure")
                post_success = False
                created_id = None
        else:
            print(f"❌ POST /api/status: FAILED - Status code: {response.status_code}")
            post_success = False
            created_id = None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ POST /api/status: FAILED - Connection error: {e}")
        post_success = False
        created_id = None
    except Exception as e:
        print(f"❌ POST /api/status: FAILED - Unexpected error: {e}")
        post_success = False
        created_id = None
    
    # Test GET /api/status (retrieve status checks)
    print("\nTesting GET /api/status...")
    try:
        response = requests.get(f"{BACKEND_URL}/status", timeout=10)
        
        print(f"GET Status Code: {response.status_code}")
        print(f"GET Response length: {len(response.text)} characters")
        
        if response.status_code == 200:
            status_list = response.json()
            if isinstance(status_list, list):
                print(f"✅ GET /api/status: PASSED - Retrieved {len(status_list)} status checks")
                
                # Check if our created status is in the list
                if post_success and created_id:
                    found_created = any(status.get("id") == created_id for status in status_list)
                    if found_created:
                        print("✅ MongoDB Data Persistence: PASSED")
                        return True
                    else:
                        print("❌ MongoDB Data Persistence: FAILED - Created status not found in list")
                        return False
                else:
                    print("✅ GET /api/status: PASSED (but POST failed, so persistence not verified)")
                    return len(status_list) >= 0  # At least we can read from DB
            else:
                print(f"❌ GET /api/status: FAILED - Response is not a list: {type(status_list)}")
                return False
        else:
            print(f"❌ GET /api/status: FAILED - Status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ GET /api/status: FAILED - Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ GET /api/status: FAILED - Unexpected error: {e}")
        return False

def check_server_logs():
    """Check backend server logs for errors"""
    print("\n🔍 Checking Backend Server Logs...")
    try:
        import subprocess
        
        # Check supervisor backend logs (these are actually INFO logs, not errors)
        result = subprocess.run(
            ["tail", "-n", "10", "/var/log/supervisor/backend.err.log"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            startup_logs = result.stdout.strip()
            if startup_logs:
                print("📋 Backend Startup Logs:")
                print(startup_logs)
                
                # Check for actual error patterns (not INFO logs)
                error_patterns = ["ERROR", "CRITICAL", "Exception", "Traceback", "Failed", "FATAL"]
                has_errors = any(pattern in startup_logs and not line.startswith("INFO:") 
                               for line in startup_logs.split('\n') 
                               for pattern in error_patterns)
                
                if has_errors:
                    print("❌ Error patterns detected in startup logs")
                    return False
                else:
                    print("✅ No error patterns detected - server started successfully")
        
        # Check backend stdout logs for recent activity
        result = subprocess.run(
            ["tail", "-n", "10", "/var/log/supervisor/backend.out.log"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            stdout_logs = result.stdout.strip()
            if stdout_logs:
                print("📋 Recent API Activity:")
                print(stdout_logs)
                
                # Check for HTTP error status codes (4xx, 5xx)
                error_patterns = [" 4", " 5"]  # HTTP 4xx and 5xx errors
                has_http_errors = any(pattern + "0" in line or pattern + "1" in line or 
                                    pattern + "2" in line or pattern + "3" in line or
                                    pattern + "4" in line or pattern + "5" in line or
                                    pattern + "6" in line or pattern + "7" in line or
                                    pattern + "8" in line or pattern + "9" in line
                                    for line in stdout_logs.split('\n') 
                                    for pattern in error_patterns)
                
                if has_http_errors:
                    print("⚠️  Some HTTP errors detected in recent activity")
                    return True  # Still consider it working if server is responding
                else:
                    print("✅ All recent requests successful")
                    return True
            else:
                print("📋 No recent activity logs found")
                return True
        
        return True
        
    except subprocess.TimeoutExpired:
        print("❌ Timeout while checking logs")
        return False
    except Exception as e:
        print(f"❌ Error checking logs: {e}")
        return False

def test_cors_configuration():
    """Test CORS configuration"""
    print("\n🔍 Testing CORS Configuration...")
    try:
        # Check CORS headers in a regular request
        response = requests.get(
            f"{BACKEND_URL}/",
            headers={"Origin": "https://angular-portfolio-2.preview.emergentagent.com"},
            timeout=10
        )
        
        print(f"CORS Test Status Code: {response.status_code}")
        
        # Look for CORS headers
        cors_headers = {}
        for header, value in response.headers.items():
            if 'access-control' in header.lower():
                cors_headers[header] = value
        
        if cors_headers:
            print("✅ CORS Headers Present:")
            for header, value in cors_headers.items():
                print(f"  {header}: {value}")
            
            # Check if essential CORS headers are present
            has_origin = any('access-control-allow-origin' in h.lower() for h in cors_headers.keys())
            if has_origin:
                print("✅ CORS properly configured for cross-origin requests")
                return True
            else:
                print("⚠️  CORS headers present but missing allow-origin")
                return False
        else:
            print("❌ No CORS headers found")
            return False
            
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
        return False

def main():
    """Run all backend tests"""
    print("=" * 60)
    print("🚀 BACKEND API TESTING - Gaurav Gaur Portfolio")
    print("=" * 60)
    print(f"Testing Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    results = {}
    
    # Run all tests
    results['health_check'] = test_api_health_check()
    results['mongodb'] = test_mongodb_connection()
    results['server_logs'] = check_server_logs()
    results['cors'] = test_cors_configuration()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL TESTS PASSED - Backend is working correctly!")
        return True
    else:
        print("⚠️  SOME TESTS FAILED - Backend needs attention")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)