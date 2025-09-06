# Test script for user login flow
import requests
import json

BASE_URL = "http://localhost:8001"

def test_user_login():
    """Test regular user login"""
    print("Testing User Login Flow")
    print("=" * 40)
    
    # Test login with correct credentials
    login_data = {
        "username": "john_doe",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Login Status: {response.status_code}")
    
    if response.status_code == 200:
        token_data = response.json()
        token = token_data["access_token"]
        print(f"✅ Login successful!")
        print(f"Token: {token[:50]}...")
        
        # Get user info
        headers = {"Authorization": f"Bearer {token}"}
        user_response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        
        if user_response.status_code == 200:
            user_data = user_response.json()
            print(f"✅ User info retrieved:")
            print(f"   Username: {user_data['username']}")
            print(f"   Full Name: {user_data['full_name']}")
            print(f"   Role: {user_data['role']}")
            print(f"   Department: {user_data['department']}")
            
            # Test admin endpoint (should fail)
            admin_response = requests.get(f"{BASE_URL}/api/admin/stats", headers=headers)
            print(f"Admin endpoint test: {admin_response.status_code}")
            if admin_response.status_code == 403:
                print("✅ Correctly blocked from admin endpoint")
            else:
                print("❌ Should be blocked from admin endpoint")
        else:
            print("❌ Failed to get user info")
    else:
        print("❌ Login failed")
        print(f"Response: {response.text}")

def test_wrong_credentials():
    """Test login with wrong credentials"""
    print("\nTesting Wrong Credentials")
    print("=" * 40)
    
    # Test with wrong username
    login_data = {
        "username": "jondoe",  # Wrong username (missing underscore)
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Wrong username test: {response.status_code}")
    if response.status_code == 401:
        print("✅ Correctly rejected wrong username")
    else:
        print("❌ Should reject wrong username")
    
    # Test with wrong password
    login_data = {
        "username": "john_doe",
        "password": "wrongpassword"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print(f"Wrong password test: {response.status_code}")
    if response.status_code == 401:
        print("✅ Correctly rejected wrong password")
    else:
        print("❌ Should reject wrong password")

if __name__ == "__main__":
    test_user_login()
    test_wrong_credentials()
    
    print("\n" + "=" * 40)
    print("CORRECT CREDENTIALS:")
    print("Admin: username='admin', password='admin123'")
    print("User:  username='john_doe', password='password123'")
    print("Note: Use 'john_doe' with underscore, not 'jondoe'")
