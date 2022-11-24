/*
  Warnings:

  - You are about to drop the `Tenant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantPermissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TenantUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TenantPermissions" DROP CONSTRAINT "TenantPermissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "TenantPermissions" DROP CONSTRAINT "TenantPermissions_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TenantUsers" DROP CONSTRAINT "TenantUsers_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "TenantUsers" DROP CONSTRAINT "TenantUsers_userId_fkey";

-- DropTable
DROP TABLE "Tenant";

-- DropTable
DROP TABLE "TenantPermissions";

-- DropTable
DROP TABLE "TenantUsers";
