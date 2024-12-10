import { ReactNode } from 'react';

interface BaseLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

const BaseLayout = ({ children, header, footer }: BaseLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0">
        {header || (
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
              <img 
                src="/fb-logo.png" 
                alt="Facilitaire Bedrijven" 
                className="h-8 w-auto"
              />
            </div>
          </header>
        )}
      </div>

      {/* Main content - Takes remaining space */}
      <div className="flex-grow flex">
        {children}
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="flex-shrink-0">
        {footer || (
          <footer className="bg-white border-t border-gray-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
              © 2024 Facilitaire Bedrijven. Alle rechten voorbehouden.
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default BaseLayout; 