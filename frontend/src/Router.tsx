import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/shared/ProtectedRoute.js";
import { CategoriesPage } from "./pages/CategoriesPage.js";
import { CategoryPage } from "./pages/CategoryPage.js";
import { HomePage } from "./pages/HomePage.js";
import IngredientsPage from "./pages/IngredientsPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { RecipeAddPage } from "./pages/RecipeAddPage.js";
import { RecipeDetailsPage } from "./pages/RecipeDetailsPage.js";
import { RecipeUpdatePage } from "./pages/RecipeUpdatePage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { SearchPage } from "./pages/SearchPage.js";
import { ShoppingPage } from "./pages/ShoppingPage.js";
import { UserPage } from "./pages/UserPage";
import { UsersPage } from "./pages/UsersPage.js";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/recipe-add"
          element={
            <ProtectedRoute>
              <RecipeAddPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe-edit/:id"
          element={
            <ProtectedRoute>
              <RecipeUpdatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shopping-list"
          element={
            <ProtectedRoute>
              <ShoppingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/recipe/:slug" element={<RecipeDetailsPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/chef/:slug" element={<UserPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/chefs" element={<UsersPage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
