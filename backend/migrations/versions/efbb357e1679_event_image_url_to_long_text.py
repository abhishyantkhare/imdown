"""event image url to long text

Revision ID: efbb357e1679
Revises: bf59c0e724ea
Create Date: 2020-09-28 22:00:10.931353

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'efbb357e1679'
down_revision = 'bf59c0e724ea'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('event', 'image_url',
               existing_type=mysql.MEDIUMTEXT(),
               type_=mysql.LONGTEXT(),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('event', 'image_url',
               existing_type=mysql.LONGTEXT(),
               type_=mysql.MEDIUMTEXT(),
               existing_nullable=True)
    # ### end Alembic commands ###