/*
  Warnings:

  - You are about to drop the `UserPermissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UserGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPermissions" DROP CONSTRAINT "UserPermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "UserPermissions" DROP CONSTRAINT "UserPermissions_userId_fkey";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserGroup" ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserPermissions";

-- CreateTable
CREATE TABLE "Tenant" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TenantPermissions" (
    "tenantId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "TenantPermissions_pkey" PRIMARY KEY ("tenantId","permissionId")
);

-- CreateTable
CREATE TABLE "TenantUsers" (
    "userId" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "TenantUsers_pkey" PRIMARY KEY ("userId","tenantId")
);

-- AddForeignKey
ALTER TABLE "TenantPermissions" ADD CONSTRAINT "TenantPermissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantPermissions" ADD CONSTRAINT "TenantPermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUsers" ADD CONSTRAINT "TenantUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TenantUsers" ADD CONSTRAINT "TenantUsers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
