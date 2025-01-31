"""Initial migration.

Revision ID: 7659718b7406
Revises: bada5f27ecc4
Create Date: 2020-07-24 20:34:10.974061

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '7659718b7406'
down_revision = 'bada5f27ecc4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('email', sa.String(length=64), nullable=False))
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.drop_index('ix_user_auth_hash', table_name='user')
    op.drop_index('ix_user_username', table_name='user')
    op.drop_column('user', 'username')
    op.drop_column('user', 'auth_hash')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('auth_hash', mysql.VARCHAR(length=128), nullable=False))
    op.add_column('user', sa.Column('username', mysql.VARCHAR(length=64), nullable=False))
    op.create_index('ix_user_username', 'user', ['username'], unique=True)
    op.create_index('ix_user_auth_hash', 'user', ['auth_hash'], unique=True)
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_column('user', 'email')
    # ### end Alembic commands ###
