-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('Residential', 'Commercial', 'Agriculture');

-- AlterTable
ALTER TABLE "SolarAsset" ADD COLUMN     "assetType" "AssetType" NOT NULL DEFAULT 'Residential';
