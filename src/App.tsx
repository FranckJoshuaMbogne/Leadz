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

export default function App() {
  return (
    <div className="min-h-screen bg-base bg-gradient-radial-glow">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceLanding />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <StickyCTA />
      <FloatingWhatsApp />
    </div>
  );
}
