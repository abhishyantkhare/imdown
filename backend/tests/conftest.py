import os
import pytest
from imdown_backend import application as _app, db as _db
    


@pytest.yield_fixture(scope='session')
def app():
    ctx = _app.app_context()
    ctx.push()

    yield _app

    ctx.pop()


@pytest.fixture(scope='session')
def testapp(app):
    return app.test_client()


@pytest.yield_fixture(scope='session')
def db(app):
    _db.app = app
    _db.create_all()
    yield _db


@pytest.fixture(scope='function', autouse=True)
def session(db):
    connection = db.engine.connect()
    transaction = connection.begin()

    options = dict(bind=connection, binds={})
    session_ = db.create_scoped_session(options=options)

    db.session = session_

    yield session_

    transaction.rollback()
    connection.close()
    session_.remove()
