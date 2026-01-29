import { createContext, useContext, useEffect, useState } from 'react';

type Mode = 'dark' | 'light' | 'system';
type Palette = 'indigo' | 'moss' | 'charcoal' | 'punchy' | 'queater';

type ThemeProviderProps = {
    children: React.ReactNode;
    defaultMode?: Mode;
    defaultPalette?: Palette;
    storageKeyMode?: string;
    storageKeyPalette?: string;
};

type ThemeProviderState = {
    mode: Mode;
    palette: Palette;
    setMode: (mode: Mode) => void;
    setPalette: (palette: Palette) => void;
};

const initialState: ThemeProviderState = {
    mode: 'system',
    palette: 'indigo',
    setMode: () => null,
    setPalette: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultMode = 'system',
    defaultPalette = 'indigo',
    storageKeyMode = 'vite-ui-mode',
    storageKeyPalette = 'vite-ui-palette',
    ...props
}: ThemeProviderProps) {
    const [mode, setMode] = useState<Mode>(() => (localStorage.getItem(storageKeyMode) as Mode) || defaultMode);
    const [palette, setPalette] = useState<Palette>(() => (localStorage.getItem(storageKeyPalette) as Palette) || defaultPalette);

    useEffect(() => {
        const root = window.document.documentElement;

        // Manage Mode
        root.classList.remove('light', 'dark');
        if (mode === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(mode);
        }

        // Manage Palette
        // Remove all theme classes first
        root.classList.forEach((className) => {
            if (className.startsWith('theme-')) {
                root.classList.remove(className);
            }
        });
        root.classList.add(`theme-${palette}`);
    }, [mode, palette]);

    const value = {
        mode,
        palette,
        setMode: (mode: Mode) => {
            localStorage.setItem(storageKeyMode, mode);
            setMode(mode);
        },
        setPalette: (palette: Palette) => {
            localStorage.setItem(storageKeyPalette, palette);
            setPalette(palette);
        },
    };

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);
    if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
