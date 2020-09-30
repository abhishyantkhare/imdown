from unittest.mock import Mock


class MockUserInfoGet:
    
    def execute(self):
        return {
            'email': 'test_email@test.com',
            'name': 'Test Testman',
            'picture': ''
        }

class MockUserInfo:

    def get(self):
        return MockUserInfoGet()

class MockUserInfoService:

    def userinfo(self):
        return MockUserInfo()
    



