// src/routes.ts
import { Router } from "express";
import { isAuthenticated } from "@/middlewares/isAuthenticated";
import { validateSchema } from "@/middlewares/validateSchema";
import { upload } from "@/config/multer";

// Company Controllers
import { CreateCompanyController } from "@/controllers/company/CreateCompanyController";
import { AuthCompanyController } from "@/controllers/company/AuthCompanyController";
import { DetailCompanyController } from "@/controllers/company/DetailCompanyController";

// Product Controllers
import { CreateProductController } from "@/controllers/product/CreateProductController";
import { ListProductsController } from "@/controllers/product/ListProductsController";
import { UpdateProductController } from "@/controllers/product/UpdateProductController";
import { DeleteProductController } from "@/controllers/product/DeleteProductController";

// Catalog Controller
import { GetCatalogController } from "@/controllers/catalog/GetCatalogController";
import { CheckoutController } from "@/controllers/catalog/CheckoutController";

// Admin Controllers
import { UpdateCompanyPhoneController } from "@/controllers/company/UpdateCompanyPhoneController";
import { ListCompaniesController } from "@/controllers/admin/ListCompaniesController";
import { UpdateCompanyPremiumController } from "@/controllers/admin/UpdateCompanyPremiumController";
import { AdminStatsController } from "@/controllers/admin/AdminStatsController";
import { isAdmin } from "@/middlewares/adminAuth";

// Schemas
import { createCompanySchema, authSchema } from "@/schemas/companySchema";
import {
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
  listProductsSchema,
} from "@/schemas/productSchema";

const router = Router();

// ==================== COMPANY ====================

router.post("/company", validateSchema(createCompanySchema), async (req, res, next) => {
  try {
    const controller = new CreateCompanyController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/session", validateSchema(authSchema), async (req, res, next) => {
  try {
    const controller = new AuthCompanyController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const controller = new DetailCompanyController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/company/phone", isAuthenticated, async (req, res, next) => {
  try {
    const controller = new UpdateCompanyPhoneController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

// ==================== PRODUCT ====================

router.post(
  "/product",
  isAuthenticated,
  upload.single("image"),
  validateSchema(createProductSchema),
  async (req, res, next) => {
    try {
      const controller = new CreateProductController();
      await controller.handle(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/products", isAuthenticated, validateSchema(listProductsSchema), async (req, res, next) => {
  try {
    const controller = new ListProductsController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

router.put(
  "/product/:id",
  isAuthenticated,
  upload.single("image"),
  validateSchema(updateProductSchema),
  async (req, res, next) => {
    try {
      const controller = new UpdateProductController();
      await controller.handle(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/product/:id", isAuthenticated, validateSchema(deleteProductSchema), async (req, res, next) => {
  try {
    const controller = new DeleteProductController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

// ==================== PUBLIC CATALOG ====================

router.get("/catalog/:slug", async (req, res, next) => {
  try {
    const controller = new GetCatalogController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/checkout", async (req, res, next) => {
  try {
    const controller = new CheckoutController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

// ==================== ADMIN ====================

router.get("/admin/companies", isAdmin, async (req, res, next) => {
  try {
    const controller = new ListCompaniesController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

router.get("/admin/stats", isAdmin, async (req, res, next) => {
  try {
    const controller = new AdminStatsController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

router.put("/admin/company/:id/premium", isAdmin, async (req, res, next) => {
  try {
    req.body.companyId = req.params.id;
    const controller = new UpdateCompanyPremiumController();
    await controller.handle(req, res);
  } catch (error) {
    next(error);
  }
});

export { router };