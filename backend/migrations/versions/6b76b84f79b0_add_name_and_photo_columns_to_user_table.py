"""Add name and photo columns to User table

Revision ID: 6b76b84f79b0
Revises: 303eab28861c
Create Date: 2020-08-02 11:02:58.080786

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '6b76b84f79b0'
down_revision = '303eab28861c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('name', sa.String(length=64), nullable=False))
    op.add_column('user', sa.Column('photo', sa.String(length=256), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'photo')
    op.drop_column('user', 'name')
    # ### end Alembic commands ###
