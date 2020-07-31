"""merging heads to fix conflicts

Revision ID: 9582aaad230e
Revises: 025d7d620502, aec812048cfe
Create Date: 2020-07-31 20:38:23.474434

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9582aaad230e'
down_revision = ('025d7d620502', 'aec812048cfe')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
