import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <div className="page-container">{children}</div>
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
