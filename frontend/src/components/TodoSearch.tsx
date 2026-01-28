import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TodoSearchProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function TodoSearch({ value, onChange, disabled }: TodoSearchProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Buscar tareas..." disabled={disabled} className="pl-9 pr-9" />
            {value && (
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => onChange('')}>
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
