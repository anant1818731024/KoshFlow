-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "purchasePrice" INTEGER NOT NULL,
    "sellingPrice" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL,
    "soldUnits30d" INTEGER NOT NULL DEFAULT 0,
    "imageHue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "customerHandle" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "imageHue" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "reviewCount" INTEGER NOT NULL,
    "productsAvailable" INTEGER NOT NULL,
    "responseTime" TEXT NOT NULL,
    "memberSince" TEXT NOT NULL,
    "specialties" TEXT[],
    "bio" TEXT NOT NULL,
    "fulfillmentRate" INTEGER NOT NULL,
    "avatarHue" INTEGER NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierReview" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "SupplierReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketplaceListing" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierName" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "condition" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "imageHue" INTEGER NOT NULL,

    CONSTRAINT "MarketplaceListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourcingListing" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "party" TEXT NOT NULL,
    "partyVerified" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "SourcingListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyMetric" (
    "idx" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "revenue" INTEGER NOT NULL,
    "profit" INTEGER NOT NULL,
    "orders" INTEGER NOT NULL,

    CONSTRAINT "MonthlyMetric_pkey" PRIMARY KEY ("idx")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_brand_idx" ON "Order"("brand");

-- CreateIndex
CREATE INDEX "SupplierReview_supplierId_idx" ON "SupplierReview"("supplierId");

-- CreateIndex
CREATE INDEX "MarketplaceListing_brand_idx" ON "MarketplaceListing"("brand");

-- CreateIndex
CREATE INDEX "MarketplaceListing_supplierId_idx" ON "MarketplaceListing"("supplierId");

-- CreateIndex
CREATE INDEX "SourcingListing_type_idx" ON "SourcingListing"("type");

-- CreateIndex
CREATE INDEX "SourcingListing_status_idx" ON "SourcingListing"("status");

-- AddForeignKey
ALTER TABLE "SupplierReview" ADD CONSTRAINT "SupplierReview_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketplaceListing" ADD CONSTRAINT "MarketplaceListing_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
