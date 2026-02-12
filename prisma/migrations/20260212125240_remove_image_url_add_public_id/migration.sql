/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ProductImage` table. All the data in the column will be lost.
  - Made the column `publicId` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProductImage" DROP COLUMN "imageUrl",
ALTER COLUMN "publicId" SET NOT NULL;
