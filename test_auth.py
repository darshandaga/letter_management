# Test script for authentication endpoints
import requests
import json

BASE_URL = "http://localhost:8001"

def test_register_user():
    """Test user registration"""
    user_data = {
        "username": "admin",
        "email": "admin@example.com",
        "password": "admin123",
        "full_name": "System Administrator",
        "role": "admin",
        "employee_id": "EMP001",
        "department": "IT",
        "designation": "System Admin"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
    print("Register Admin User:")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)
    
    # Register a regular user
    user_data2 = {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "password123",
        "full_name": "John Doe",
        "role": "user",
        "employee_id": "EMP002",
        "department": "HR",
        "designation": "HR Executive"
    }
    
    response2 = requests.post(f"{BASE_URL}/api/auth/register", json=user_data2)
    print("Register Regular User:")
    print(f"Status: {response2.status_code}")
    print(f"Response: {response2.json()}")
    print("-" * 50)

def test_login_user():
    """Test user login"""
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    print("Login Admin User:")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        print(f"Access Token: {token[:50]}...")
        return token
    print("-" * 50)
    return None

def test_protected_endpoint(token):
    """Test protected endpoint with token"""
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
    print("Get Current User Info:")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print("-" * 50)
    
    # Test token verification
    response2 = requests.get(f"{BASE_URL}/api/auth/verify-token", headers=headers)
    print("Verify Token:")
    print(f"Status: {response2.status_code}")
    print(f"Response: {response2.json()}")
    print("-" * 50)

if __name__ == "__main__":
    print("Testing Letter Management System Authentication")
    print("=" * 60)
    
    # Test registration
    test_register_user()
    
    # Test login
    token = test_login_user()
    
    # Test protected endpoints
    if token:
        test_protected_endpoint(token)
    
    print("Authentication testing completed!")
