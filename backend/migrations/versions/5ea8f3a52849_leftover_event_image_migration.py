"""leftover event image migration

Revision ID: 5ea8f3a52849
Revises: aabad5c84309
Create Date: 2020-09-10 21:24:45.602032

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '5ea8f3a52849'
down_revision = 'aabad5c84309'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
