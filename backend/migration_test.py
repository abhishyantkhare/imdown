import pytest
import os

SKIP_FILENAMES = ["bd3858beccdd_update_event_fields.py",
                  "29a95de4aea6_add_squad_code_column.py",
                  "__pycache__"
                  ]


def test_migrations():
    migrations_dir = "backend/migrations/versions/"
    revisions = {}
    for filename in os.listdir(migrations_dir):
        full_file = os.path.join(migrations_dir, filename)
        if filename in SKIP_FILENAMES:
            continue
        with open(full_file, 'r') as migration_file:
            for line in migration_file:
                line_split = line.split(" ")
                if line_split[0] == "Revises:":  # revises line
                    revision_hash = line_split[1]
                    assert revision_hash not in revisions, "{} and {} revise the same migration!".format(
                        filename, revisions[revision_hash])
                    revisions[revision_hash] = filename
                    break
