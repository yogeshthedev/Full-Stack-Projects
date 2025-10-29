import { Router } from "express";
import {
  generateRecipeController,
  getMyRecipesController,
  saveRecipeController,
} from "./../controllers/recipe.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/generateRecipe", generateRecipeController); // public
router.post("/saveRecipe", authMiddleware, saveRecipeController); // protected
router.get("/myRecipes", authMiddleware, getMyRecipesController); // protected

export default router;
