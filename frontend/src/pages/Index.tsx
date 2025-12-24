import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import HowItWorks from '../components/HowItWorksSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';
import { AuthModal } from './Auth';
import { Toaster } from '../components/ui/toaster';

const Index = () => {
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
    role?: 'CITIZEN' | 'DEPARTMENT' | 'ADMIN';
  }>({
    isOpen: false,
    mode: 'login',
    role: undefined,
  });

  // Pass role when opening login
  const openLogin = (role?: 'CITIZEN' | 'DEPARTMENT' | 'ADMIN') =>
    setAuthModal({ isOpen: true, mode: 'login', role });

  const openRegister = () => setAuthModal({ isOpen: true, mode: 'register' });
  const closeModal = () => setAuthModal({ ...authModal, isOpen: false });
  const switchMode = () =>
    setAuthModal({
      ...authModal,
      mode: authModal.mode === 'login' ? 'register' : 'login',
    });

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
      <HeroSection onRegisterClick={openRegister} />
      <HowItWorks />
      <FeaturesSection />
      <Footer />

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeModal}
        mode={authModal.mode}
        onSwitchMode={switchMode}
        initialRole={authModal.role} // Pass role here
      />

      <Toaster />
    </div>
  );
};

export default Index;
