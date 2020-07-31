"""empty message

Revision ID: 44b32661fe9b
Revises: bd3858beccdd
Create Date: 2020-07-30 23:47:38.624498

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '44b32661fe9b'
down_revision = 'bd3858beccdd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event', sa.Column('event_emoji', sa.String(length=64), nullable=True))
    op.add_column('event', sa.Column('event_url', sa.String(length=256), nullable=True))
    op.add_column('event', sa.Column('image_url', sa.String(length=256), nullable=True))
    op.alter_column('event', 'description',
               existing_type=mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=64),
               type_=sa.String(length=256),
               existing_nullable=True)
    op.alter_column('event', 'end_time',
               existing_type=mysql.INTEGER(),
               type_=sa.BigInteger(),
               existing_nullable=True)
    op.alter_column('event', 'start_time',
               existing_type=mysql.INTEGER(),
               type_=sa.BigInteger(),
               existing_nullable=True)
    op.alter_column('squad', 'squad_emoji',
               existing_type=mysql.CHAR(charset='utf8mb4', collation='utf8mb4_unicode_ci', length=64),
               type_=sa.String(length=64),
               existing_nullable=True)
    op.add_column('user', sa.Column('photo', sa.String(length=256), nullable=False))
    op.create_index(op.f('ix_user_photo'), 'user', ['photo'], unique=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_photo'), table_name='user')
    op.drop_column('user', 'photo')
    op.alter_column('squad', 'squad_emoji',
               existing_type=sa.String(length=64),
               type_=mysql.CHAR(charset='utf8mb4', collation='utf8mb4_unicode_ci', length=64),
               existing_nullable=True)
    op.alter_column('event', 'start_time',
               existing_type=sa.BigInteger(),
               type_=mysql.INTEGER(),
               existing_nullable=True)
    op.alter_column('event', 'end_time',
               existing_type=sa.BigInteger(),
               type_=mysql.INTEGER(),
               existing_nullable=True)
    op.alter_column('event', 'description',
               existing_type=sa.String(length=256),
               type_=mysql.VARCHAR(collation='utf8mb4_unicode_ci', length=64),
               existing_nullable=True)
    op.drop_column('event', 'image_url')
    op.drop_column('event', 'event_url')
    op.drop_column('event', 'event_emoji')
    # ### end Alembic commands ###
