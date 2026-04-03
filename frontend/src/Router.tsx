import { BrowserRouter, Routes, Route } from "react-router-dom";

import { HomePage } from "./pages/HomePage.js";
import { RegisterPage } from "./pages/RegisterPage.js";
import { LoginPage } from "./pages/LoginPage.js";
import { NotFoundPage } from "./pages/NotFoundPage.js";
import { ShoppingPage } from "./pages/ShoppingPage.js";
import { RecipeAddPage } from "./pages/RecipeAddPage.js";
import { SearchPage } from "./pages/SearchPage.js";
import { ProfilePage } from "./pages/ProfilePage.js";
import { ProtectedRoute } from "./components/shared/ProtectedRoute.js";

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
          path="/shopping-list"
          element={
            <ProtectedRoute>
              <ShoppingPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
