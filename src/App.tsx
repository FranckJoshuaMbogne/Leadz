import { Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StickyCTA } from "@/components/StickyCTA";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { Portfolio } from "@/pages/Portfolio";
import { Contact } from "@/pages/Contact";
import { ServiceLanding } from "@/pages/ServiceLanding";
import { Pricing } from "@/pages/Pricing";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";

export default function App() {
  return (
    <div className="min-h-screen bg-base bg-gradient-radial-glow">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceLanding />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
      <StickyCTA />
      <FloatingWhatsApp />
    </div>
  );
}
