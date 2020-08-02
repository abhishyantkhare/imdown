"""Fix migration state by merging previous heads

Revision ID: 303eab28861c
Revises: aec812048cfe, bd3858beccdd
Create Date: 2020-07-31 23:34:10.471132

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '303eab28861c'
down_revision = ('aec812048cfe', 'bd3858beccdd')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
