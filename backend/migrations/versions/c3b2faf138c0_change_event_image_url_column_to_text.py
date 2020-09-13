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
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('event', 'image_url',
               existing_type=mysql.MEDIUMTEXT(),
               type_=sa.Text(),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('event', 'image_url',
               existing_type=sa.Text(),
               type_=mysql.MEDIUMTEXT(),
               existing_nullable=True)
    # ### end Alembic commands ###
