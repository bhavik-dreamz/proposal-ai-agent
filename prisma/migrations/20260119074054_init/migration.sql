-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT,
    "project_type" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "generated_proposal" TEXT,
    "cost_estimate" DECIMAL(10,2),
    "timeline_weeks" INTEGER,
    "complexity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "embedding" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "sections" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tech_stacks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "typical_features" JSONB,
    "base_cost" DECIMAL(10,2),
    "cost_per_feature" DECIMAL(10,2),
    "base_timeline_weeks" INTEGER,
    "additional_info" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tech_stacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_proposals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "full_content" TEXT NOT NULL,
    "requirements_excerpt" TEXT,
    "cost" DECIMAL(10,2),
    "timeline_weeks" INTEGER,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "embedding" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" TEXT NOT NULL,
    "feature_name" TEXT NOT NULL,
    "project_type" TEXT,
    "base_cost" DECIMAL(10,2),
    "time_hours" INTEGER,
    "complexity_multiplier" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "proposals_project_type_idx" ON "proposals"("project_type");

-- CreateIndex
CREATE INDEX "proposals_status_idx" ON "proposals"("status");

-- CreateIndex
CREATE INDEX "templates_project_type_idx" ON "templates"("project_type");

-- CreateIndex
CREATE UNIQUE INDEX "tech_stacks_name_key" ON "tech_stacks"("name");

-- CreateIndex
CREATE INDEX "sample_proposals_project_type_idx" ON "sample_proposals"("project_type");
