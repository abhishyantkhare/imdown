from tests.conftest import testapp
from imdown_backend.models.user import User
import json

def test_sign_in(testapp):
    sign_in_data = {
        'email': 'test_email@test.com',
        'name': 'Test Testman',
        'photo': '',
        'googleServerCode': '',
        'deviceToken': ''
    }
    testapp.post('/sign_in', data=json.dumps(sign_in_data), content_type='application/json')
    
    test_user = User.query.filter_by(email='test_email@test.com').first()
    assert test_user is not None
    assert test_user.name == 'Test Testman'
