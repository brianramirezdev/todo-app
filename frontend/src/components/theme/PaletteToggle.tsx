import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/theme/ThemeProvider';
import { cn } from '@/lib/utils';

export function PaletteToggle() {
    const { palette, setPalette } = useTheme();

    const palettes = [
        { id: 'indigo', name: 'Indigo', color: 'bg-[#27187E]' },
        { id: 'moss', name: 'Moss', color: 'bg-[#70a184]' },
    ] as const;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="group">
                    <Palette className="h-[1.2rem] w-[1.2rem] transition-transform group-hover:rotate-12" />
                    <span className="sr-only">Cambiar tema de color</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-xs font-semibold opacity-60">Temas de Color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-1">

                {palettes.map((p) => (
                    <DropdownMenuItem
                        key={p.id}
                        onClick={() => setPalette(p.id)}
                        className={cn(
                            "flex items-center gap-2 cursor-pointer",
                            palette === p.id && "bg-accent text-accent-foreground font-medium"
                        )}
                    >
                        <div className={cn("h-3 w-3 rounded-full border border-black/10", p.color)} />
                        <span>{p.name}</span>
                        {palette === p.id && (
                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                        )}
                    </DropdownMenuItem>
                ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
