/*
  Warnings:

  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroupPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserUserGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserGroupPermissions" DROP CONSTRAINT "UserGroupPermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroupPermissions" DROP CONSTRAINT "UserGroupPermissions_userGroupId_fkey";

-- DropForeignKey
ALTER TABLE "UserUserGroups" DROP CONSTRAINT "UserUserGroups_userGroupId_fkey";

-- DropForeignKey
ALTER TABLE "UserUserGroups" DROP CONSTRAINT "UserUserGroups_userId_fkey";

-- DropTable
DROP TABLE "UserGroup";

-- DropTable
DROP TABLE "UserGroupPermissions";

-- DropTable
DROP TABLE "UserUserGroups";

-- CreateTable
CREATE TABLE "Group" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupPermissions" (
    "groupId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "GroupPermissions_pkey" PRIMARY KEY ("groupId","permissionId")
);

-- CreateTable
CREATE TABLE "UsersInGroups" (
    "userId" UUID NOT NULL,
    "groupId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "UsersInGroups_pkey" PRIMARY KEY ("userId","groupId")
);

-- AddForeignKey
ALTER TABLE "GroupPermissions" ADD CONSTRAINT "GroupPermissions_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupPermissions" ADD CONSTRAINT "GroupPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInGroups" ADD CONSTRAINT "UsersInGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInGroups" ADD CONSTRAINT "UsersInGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
