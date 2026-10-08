import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";

const Services = lazy(() => import("@/pages/Services"));
const ServiceDetail = lazy(() => import("@/pages/ServiceDetail"));
const Work = lazy(() => import("@/pages/Work"));
const CaseStudy = lazy(() => import("@/pages/CaseStudy"));
const Industries = lazy(() => import("@/pages/Industries"));
const Industry = lazy(() => import("@/pages/Industry"));
const Insights = lazy(() => import("@/pages/Insights"));
const Article = lazy(() => import("@/pages/Article"));
const About = lazy(() => import("@/pages/About"));
const Book = lazy(() => import("@/pages/Book"));
const Contact = lazy(() => import("@/pages/Contact"));
const ThankYou = lazy(() => import("@/pages/ThankYou"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

function PageFallback() {
  return <div className="min-h-screen bg-deep" aria-busy="true" />;
}

function S({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<S><Services /></S>} />
        <Route path="services/website-crm" element={<Navigate to="/services/website-development" replace />} />
        <Route path="services/:slug" element={<S><ServiceDetail /></S>} />
        <Route path="work" element={<S><Work /></S>} />
        <Route path="work/:slug" element={<S><CaseStudy /></S>} />
        <Route path="industries" element={<S><Industries /></S>} />
        <Route path="industries/:slug" element={<S><Industry /></S>} />
        <Route path="insights" element={<S><Insights /></S>} />
        <Route path="insights/:slug" element={<S><Article /></S>} />
        <Route path="about" element={<S><About /></S>} />
        <Route path="book" element={<S><Book /></S>} />
        <Route path="contact" element={<S><Contact /></S>} />
        <Route path="thank-you" element={<S><ThankYou /></S>} />
        <Route path="privacy" element={<S><Legal page="privacy" /></S>} />
        <Route path="terms" element={<S><Legal page="terms" /></S>} />
        <Route path="portfolio" element={<Navigate to="/work" replace />} />
        <Route path="pricing" element={<Navigate to="/services" replace />} />
        <Route path="404" element={<S><NotFound /></S>} />
        <Route path="*" element={<S><NotFound /></S>} />
      </Route>
      <Route path="admin" element={<S><AdminLogin /></S>} />
      <Route path="dashboard" element={<S><AdminDashboard /></S>} />
    </Routes>
  );
}
