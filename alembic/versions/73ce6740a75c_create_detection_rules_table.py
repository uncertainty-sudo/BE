"""Create detection_rules table

Revision ID: 73ce6740a75c
Revises: 16a43009c50b
Create Date: 2025-10-16 22:00:48.137314

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '73ce6740a75c'
down_revision: Union[str, Sequence[str], None] = '16a43009c50b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create detection_rules table."""
    op.create_table(
        "detection_rules",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("entity_type", sa.String(length=100), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
    )
    op.create_index("ix_detection_rules_id", "detection_rules", ["id"])


def downgrade() -> None:
    """Drop detection_rules table."""
    op.drop_index("ix_detection_rules_id", table_name="detection_rules")
    op.drop_table("detection_rules")
