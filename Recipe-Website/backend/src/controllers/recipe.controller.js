import { generateRecipeFromIngredients } from "../service/ai.service.js";
import { Recipe } from "./../model/recipe.model.js";

export const generateRecipeController = async (req, res) => {
  try {
    const { ingredients, preferences } = req.body;

    // Validate request
    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ message: "Ingredients are required" });
    }

    // Generate recipe using AI
    const recipeData = await generateRecipeFromIngredients(
      ingredients,
      preferences
    );

    // Create recipe document
    const recipe = new Recipe({
      title: recipeData.title || "Untitled Recipe",
      ingredients: recipeData.ingredients || ingredients,
      instructions: Array.isArray(recipeData.steps)
        ? recipeData.steps.join("\n")
        : recipeData.steps || "No instructions available.",
    });

    await recipe.save();

    // Return full saved recipe
    res.status(201).json({
      message: "Recipe generated successfully",
      recipe,
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    res.status(500).json({ message: "Failed to generate recipe" });
  }
};

export const saveRecipeController = async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  const recipe = new Recipe({
    title,
    ingredients,
    instructions,
    user: req.user._id,
  });
  await recipe.save();
  res.status(201).json({ message: "Recipe saved successfully", recipe });
};

export const getMyRecipesController = async (req, res) => {
  const recipes = await Recipe.find({ user: req.user._id });
  res.status(200).json(recipes);
};
