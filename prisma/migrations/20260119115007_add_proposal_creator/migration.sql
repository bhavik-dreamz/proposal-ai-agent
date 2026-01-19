-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "created_by_id" TEXT;

-- CreateIndex
CREATE INDEX "proposals_created_by_id_idx" ON "proposals"("created_by_id");

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
