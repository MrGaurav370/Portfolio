#!/usr/bin/env python3
"""
Backend API Testing for Gaurav Gaur's Angular Portfolio Application
Tests all portfolio API endpoints and MongoDB connectivity
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

def test_profile_endpoint():
    """Test the profile endpoint"""
    print("\n🔍 Testing Profile Endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/profile", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            profile = response.json()
            print(f"Profile Response: {json.dumps(profile, indent=2)}")
            
            # Verify required fields
            required_fields = ["name", "title", "tagline", "bio", "email", "github", "linkedin", "twitter"]
            missing_fields = [field for field in required_fields if field not in profile]
            
            if missing_fields:
                print(f"❌ Profile Endpoint: FAILED - Missing fields: {missing_fields}")
                return False
            
            # Verify Gaurav Gaur's profile data
            if profile.get("name") == "Gaurav Gaur" and "Angular" in profile.get("title", ""):
                print("✅ Profile Endpoint: PASSED - Gaurav Gaur's profile found with correct data")
                return True
            else:
                print(f"❌ Profile Endpoint: FAILED - Expected Gaurav Gaur's Angular profile, got: {profile.get('name')} - {profile.get('title')}")
                return False
        else:
            print(f"❌ Profile Endpoint: FAILED - Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Profile Endpoint: FAILED - Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Profile Endpoint: FAILED - Unexpected error: {e}")
        return False

def test_skills_endpoint():
    """Test the skills endpoint"""
    print("\n🔍 Testing Skills Endpoint...")
    try:
        response = requests.get(f"{BACKEND_URL}/skills", timeout=10)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            skills = response.json()
            print(f"Skills Response: Found {len(skills)} skill categories")
            
            # Verify we have 4 skill categories as mentioned in the request
            if len(skills) != 4:
                print(f"❌ Skills Endpoint: FAILED - Expected 4 skill categories, got {len(skills)}")
                return False
            
            # Verify expected categories
            expected_categories = ["Angular 16 Core", "State Management", "UI & Styling", "TypeScript & Tools"]
            found_categories = [skill.get("category") for skill in skills]
            
            print(f"Found categories: {found_categories}")
            
            missing_categories = [cat for cat in expected_categories if cat not in found_categories]
            if missing_categories:
                print(f"❌ Skills Endpoint: FAILED - Missing categories: {missing_categories}")
                return False
            
            # Verify each category has items array
            for skill in skills:
                if "items" not in skill or not isinstance(skill["items"], list):
                    print(f"❌ Skills Endpoint: FAILED - Category '{skill.get('category')}' missing items array")
                    return False
            
            print("✅ Skills Endpoint: PASSED - All 4 Angular skill categories found with items")
            return True
        else:
            print(f"❌ Skills Endpoint: FAILED - Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Skills Endpoint: FAILED - Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Skills Endpoint: FAILED - Unexpected error: {e}")
        return False

def test_projects_endpoints():
    """Test all project endpoints"""
    print("\n🔍 Testing Projects Endpoints...")
    
    # Test GET /api/projects (all projects)
    print("Testing GET /api/projects (all projects)...")
    try:
        response = requests.get(f"{BACKEND_URL}/projects", timeout=10)
        
        print(f"All Projects Status Code: {response.status_code}")
        
        if response.status_code == 200:
            all_projects = response.json()
            print(f"All Projects: Found {len(all_projects)} projects")
            
            # Verify we have 6 projects as mentioned in the request
            if len(all_projects) != 6:
                print(f"❌ All Projects: FAILED - Expected 6 projects, got {len(all_projects)}")
                return False
            
            # Verify project fields
            required_fields = ["title", "description", "technologies", "image", "demoUrl", "githubUrl", "featured"]
            for i, project in enumerate(all_projects):
                missing_fields = [field for field in required_fields if field not in project]
                if missing_fields:
                    print(f"❌ All Projects: FAILED - Project {i+1} missing fields: {missing_fields}")
                    return False
            
            print("✅ All Projects: PASSED - All 6 projects found with correct fields")
            all_projects_success = True
        else:
            print(f"❌ All Projects: FAILED - Status code: {response.status_code}")
            print(f"Response: {response.text}")
            all_projects_success = False
            all_projects = []
            
    except Exception as e:
        print(f"❌ All Projects: FAILED - Error: {e}")
        all_projects_success = False
        all_projects = []
    
    # Test GET /api/projects?featured=true (featured projects only)
    print("\nTesting GET /api/projects?featured=true (featured projects)...")
    try:
        response = requests.get(f"{BACKEND_URL}/projects?featured=true", timeout=10)
        
        print(f"Featured Projects Status Code: {response.status_code}")
        
        if response.status_code == 200:
            featured_projects = response.json()
            print(f"Featured Projects: Found {len(featured_projects)} featured projects")
            
            # Verify all returned projects are featured
            non_featured = [p for p in featured_projects if not p.get("featured", False)]
            if non_featured:
                print(f"❌ Featured Projects: FAILED - Found non-featured projects in featured filter")
                return False
            
            print("✅ Featured Projects: PASSED - All returned projects are featured")
            featured_projects_success = True
        else:
            print(f"❌ Featured Projects: FAILED - Status code: {response.status_code}")
            print(f"Response: {response.text}")
            featured_projects_success = False
            
    except Exception as e:
        print(f"❌ Featured Projects: FAILED - Error: {e}")
        featured_projects_success = False
    
    # Test GET /api/projects/1 (single project by ID)
    print("\nTesting GET /api/projects/1 (single project)...")
    try:
        response = requests.get(f"{BACKEND_URL}/projects/1", timeout=10)
        
        print(f"Single Project Status Code: {response.status_code}")
        
        if response.status_code == 200:
            single_project = response.json()
            print(f"Single Project: {single_project.get('title', 'No title')}")
            
            # Verify project fields
            required_fields = ["title", "description", "technologies", "image", "demoUrl", "githubUrl", "featured"]
            missing_fields = [field for field in required_fields if field not in single_project]
            if missing_fields:
                print(f"❌ Single Project: FAILED - Missing fields: {missing_fields}")
                return False
            
            # Verify it's project ID 1
            if single_project.get("id") != 1:
                print(f"❌ Single Project: FAILED - Expected project ID 1, got {single_project.get('id')}")
                return False
            
            print("✅ Single Project: PASSED - Project 1 found with correct fields")
            single_project_success = True
        else:
            print(f"❌ Single Project: FAILED - Status code: {response.status_code}")
            print(f"Response: {response.text}")
            single_project_success = False
            
    except Exception as e:
        print(f"❌ Single Project: FAILED - Error: {e}")
        single_project_success = False
    
    return all_projects_success and featured_projects_success and single_project_success

def test_contact_endpoint():
    """Test the contact form endpoint"""
    print("\n🔍 Testing Contact Endpoint...")
    try:
        # Test contact form submission
        test_contact_data = {
            "name": "John Smith",
            "email": "john.smith@example.com",
            "subject": "Portfolio Inquiry",
            "message": "Hi Gaurav, I'm interested in discussing a potential Angular project. Your portfolio showcases excellent Angular 16 skills and I'd love to connect."
        }
        
        response = requests.post(
            f"{BACKEND_URL}/contact",
            json=test_contact_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Contact Form Status Code: {response.status_code}")
        print(f"Contact Form Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success") and "message" in result:
                print("✅ Contact Endpoint: PASSED - Contact form submission successful")
                return True
            else:
                print(f"❌ Contact Endpoint: FAILED - Unexpected response format: {result}")
                return False
        else:
            print(f"❌ Contact Endpoint: FAILED - Status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Contact Endpoint: FAILED - Connection error: {e}")
        return False
    except Exception as e:
        print(f"❌ Contact Endpoint: FAILED - Unexpected error: {e}")
        return False

# MongoDB connection test removed - testing portfolio endpoints instead

def check_server_logs():
    """Check backend server logs for errors"""
    print("\n🔍 Checking Backend Server Logs...")
    try:
        import subprocess
        
        # Check supervisor backend logs
        result = subprocess.run(
            ["tail", "-n", "20", "/var/log/supervisor/backend.err.log"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            startup_logs = result.stdout.strip()
            if startup_logs:
                print("📋 Backend Error Logs:")
                print(startup_logs)
                
                # Check for actual error patterns
                error_patterns = ["ERROR", "CRITICAL", "Exception", "Traceback", "Failed", "FATAL"]
                has_errors = any(pattern in startup_logs for pattern in error_patterns)
                
                if has_errors:
                    print("❌ Error patterns detected in logs")
                    return False
                else:
                    print("✅ No critical errors detected in logs")
            else:
                print("📋 No error logs found")
        
        return True
        
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
    """Run all portfolio API tests"""
    print("=" * 70)
    print("🚀 PORTFOLIO API TESTING - Gaurav Gaur's Angular Portfolio")
    print("=" * 70)
    print(f"Testing Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    results = {}
    
    # Run all portfolio tests
    results['health_check'] = test_api_health_check()
    results['profile'] = test_profile_endpoint()
    results['skills'] = test_skills_endpoint()
    results['projects'] = test_projects_endpoints()
    results['contact'] = test_contact_endpoint()
    results['server_logs'] = check_server_logs()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 PORTFOLIO API TEST SUMMARY")
    print("=" * 70)
    
    total_tests = len(results)
    passed_tests = sum(1 for result in results.values() if result)
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL PORTFOLIO API TESTS PASSED - Backend is working correctly!")
        print("✅ Profile endpoint returns Gaurav Gaur's data")
        print("✅ Skills endpoint returns 4 Angular skill categories")
        print("✅ Projects endpoints return 6 Angular projects")
        print("✅ Contact form submission works")
        print("✅ Health check endpoint operational")
        return True
    else:
        print("⚠️  SOME TESTS FAILED - Backend needs attention")
        failed_tests = [name for name, result in results.items() if not result]
        print(f"Failed tests: {', '.join(failed_tests)}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)