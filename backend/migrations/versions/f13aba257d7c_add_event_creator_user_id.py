"""Add event creator user id

Revision ID: f13aba257d7c
Revises: a2702db82e82
Create Date: 2020-08-11 19:05:15.297941

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'f13aba257d7c'
down_revision = 'a2702db82e82'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event', sa.Column('creator_user_id', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('event', 'creator_user_id')
    # ### end Alembic commands ###
