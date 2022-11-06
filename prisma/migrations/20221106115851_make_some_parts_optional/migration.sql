-- AlterTable
ALTER TABLE "TenantPermissions" ALTER COLUMN "assignedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TenantUsers" ALTER COLUMN "assignedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "googleId" DROP NOT NULL,
ALTER COLUMN "microsoftId" DROP NOT NULL,
ALTER COLUMN "githubId" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserGroupPermissions" ALTER COLUMN "assignedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserUserGroups" ALTER COLUMN "assignedBy" DROP NOT NULL;
