from tests.conftest import testapp
from imdown_backend.models.user import User
import json
from unittest.mock import patch
from tests.mocks.google_mocks import MockUserInfoService



@patch("google_auth_oauthlib.flow.Flow.from_client_secrets_file")
@patch("apiclient.discovery.build", return_value=MockUserInfoService())
def test_sign_in(mock_service, mock_flow, testapp):
    sign_in_data = {
        'email': 'test_email@test.com',
        'name': 'Test Testman',
        'photo': '',
        'googleServerCode': '',
        'deviceToken': ''
    }
    testapp.post('/login', data=json.dumps(sign_in_data), content_type='application/json')
        
    test_user = User.query.filter_by(email='test_email@test.com').first()
    assert test_user is not None
    assert test_user.email == 'test_email@test.com'
    assert test_user.name == 'Test Testman'
