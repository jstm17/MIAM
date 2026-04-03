import { useEffect, useState } from "react";
import { recipeService } from "../../services/recipeService";

export const useGetAllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [totalRecipes, setTotalRecipes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recipeService
      .getAllByUser()
      .then((res) => {
        setRecipes(res.data.data);
        setTotalRecipes(res.data.data.length);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { recipes, totalRecipes, loading, error };
};
