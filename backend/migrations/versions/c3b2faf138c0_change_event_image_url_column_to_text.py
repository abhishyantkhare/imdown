"""change event image url column to text

Revision ID: c3b2faf138c0
Revises: 5ea8f3a52849
Create Date: 2020-09-11 12:09:38.552836

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c3b2faf138c0'
down_revision = '5ea8f3a52849'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass

