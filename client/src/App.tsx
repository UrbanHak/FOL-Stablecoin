import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ProtectedRoute } from '@/components/protected-route/protected-route';
import { Header } from '@/components/header/header';
import { Hero } from '@/components/hero/hero';
import { About } from '@/components/about/about';
import { Features } from '@/components/features/features';
import { HowItWorks } from '@/components/how-it-works/how-it-works';
import { Footer } from '@/components/footer/footer';
import { LoginPage } from '@/pages/login/login-page';
import { RegisterPage } from '@/pages/register/register-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { VerifyUnemploymentPage } from '@/pages/verify-unemployment/verify-unemployment-page';

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/verify-unemployment" 
        element={
          <ProtectedRoute>
            <VerifyUnemploymentPage />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;