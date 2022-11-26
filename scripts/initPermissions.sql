BEGIN TRANSACTION;

-- ADMIN

INSERT INTO
    public."Permission"
VALUES
    ('5772e221-789b-4855-9e0b-5bce40fa3973', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.groups.write');
INSERT INTO
    public."Permission"
VALUES
    ('0e7eef44-8090-4fa1-ab7e-7fcc87cd5828', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.groups.delete');
INSERT INTO
    public."Permission"
VALUES
    ('dd4b8e9e-9629-4603-9f31-a41e73a12c8f', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.groups.read');
INSERT INTO
    public."Permission"
VALUES
    ('e1b8c469-9ec8-4dbd-bc50-daf23b1a08b8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.groups.users.write');
INSERT INTO
    public."Permission"
VALUES
    ('55af3768-fb97-4d34-82b4-84a8532c1e3f', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.groups.users.delete');
INSERT INTO
    public."Permission"
VALUES
    ('9d068aca-9d00-4c13-9e11-8bacf55c7015', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.groups.users.read');
INSERT INTO
    public."Permission"
VALUES
    ('4828fcce-a1ec-4899-9b82-bcbf69fe1593', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.users.write');
INSERT INTO
    public."Permission"
VALUES
    ('122dcb0f-53ba-4045-ac86-d042a8cf16a9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.users.delete');
INSERT INTO
    public."Permission"
VALUES
    ('89ba6384-3096-4fa7-aeb7-232de0cc4332', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.users.read');
INSERT INTO
    public."Permission"
VALUES
    ('54c02030-baa8-4fbf-bda0-0933153d7954', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.permissions.read');
INSERT INTO
    public."Permission"
VALUES
    ('53ed9be0-db68-4c15-8fa5-25efd8ac1f7b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin.permissions.write');

END TRANSACTION;

BEGIN TRANSACTION;

-- BASIC

INSERT INTO
    public."Permission"
VALUES
    ('72d71d21-f314-481c-8797-786f8e7dcbd0', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic.check-in.write');
INSERT INTO
    public."Permission"
VALUES
    ('12ec4a75-b1e7-43a0-8d1b-fb403614da4a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic.check-in.read');
INSERT INTO
    public."Permission"
VALUES
    ('38ebbcc9-40df-44f5-98f3-2e15ea5fe0ad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic.users.write');
INSERT INTO
    public."Permission"
VALUES
    ('c1979c74-8aad-4447-97d9-f0c0136dd25b', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic.users.read');
INSERT INTO
    public."Permission"
VALUES
    ('3d741498-1b98-422d-9e36-9909e5d5b8d5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic.groups.read');
INSERT INTO
    public."Permission"
VALUES
    ('17460379-cd54-4a9d-ae23-f0100822892a', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic.groups.users.read');
INSERT INTO
    public."Permission"
VALUES
    ('88dc9de0-55d5-4b37-ab72-e79392db1fbe', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'basic.permissions.read');

END TRANSACTION;