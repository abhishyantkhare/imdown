"""added calendar_event_uuid field to events to give ids for events for google calendar api

Revision ID: f5d4fa1ae369
Revises: 4072bc54db71
Create Date: 2020-08-08 13:25:54.630571

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f5d4fa1ae369'
down_revision = '4072bc54db71'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event', sa.Column('calendar_event_uuid', sa.String(length=256), nullable=True))
    op.create_unique_constraint(None, 'event', ['calendar_event_uuid'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'event', type_='unique')
    op.drop_column('event', 'calendar_event_uuid')
    # ### end Alembic commands ###
