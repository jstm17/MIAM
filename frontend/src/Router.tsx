import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AdminRoute } from "./AdminRoute.js";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.js";
import { AdminCookingTimesPage } from "./pages/AdminCookingTimesPage.js";
import { AdminIngredientsPage } from "./pages/AdminIngredientsPage.js";
import { AdminPage } from "./pages/AdminPage.js";
import { AdminRecipesPage } from "./pages/AdminRecipesPage.js";
import { AdminUsersPage } from "./pages/AdminUsersPage.js";
import { CategoriesPage } from "./pages/CategoriesPage.js";
import { CategoryPage } from "./pages/CategoryPage.js";
import { CookingTimeDetailsPage } from "./pages/CookingTimeDetailsPage.js";
import { CookingTimeUpdatePage } from "./pages/CookingTimeUpdatePage.js";
import { HomePage } from "./pages/HomePage.js";
import IngredientsPage from "./pages/IngredientsPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { ProfileUpdatePage } from "./pages/ProfileUpdatePage.js";
import { RecipeAddPage } from "./pages/RecipeAddPage.js";
import { RecipeDetailsPage } from "./pages/RecipeDetailsPage.js";
import { RecipeUpdatePage } from "./pages/RecipeUpdatePage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { ResetPasswordPage } from "./pages/ResetPasswordPage.js";
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
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-edit"
          element={
            <ProtectedRoute>
              <ProfileUpdatePage />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <RecipeAddPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe-edit/:slug"
          element={
            <ProtectedRoute>
              <RecipeUpdatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cooking-time-edit/:slug"
          element={
            <ProtectedRoute>
              <CookingTimeUpdatePage />
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
        <Route
          path="/cooking-time/:slug"
          element={<CookingTimeDetailsPage />}
        />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/chef/:slug" element={<UserPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/chefs" element={<UsersPage />} />
        <Route path="/ingredients" element={<IngredientsPage />} />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/recipes"
          element={
            <AdminRoute>
              <AdminRecipesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cooking-times"
          element={
            <AdminRoute>
              <AdminCookingTimesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/ingredients"
          element={
            <AdminRoute>
              <AdminIngredientsPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
