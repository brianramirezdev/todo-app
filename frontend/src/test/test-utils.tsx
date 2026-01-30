import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { SidebarProvider } from '@/components/ui/sidebar';

// Wrapper personalizado si necesitas providers (Toaster, etc.)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider>
            <SidebarProvider>
                {children}
            </SidebarProvider>
        </ThemeProvider>
    );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
