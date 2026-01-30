import { useState } from 'react';
import { todoApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Database, Trash2, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface DevOverlayProps {
    onActionComplete: () => void;
}

export function DevOverlay({ onActionComplete }: DevOverlayProps) {
    const [loading, setLoading] = useState(false);

    const handleSeed = async () => {
        try {
            setLoading(true);
            await todoApi.seedTodos();
            toast.success('Base de datos sembrada con éxito');
            onActionComplete();
        } catch (error) {
            toast.error('Error al sembrar datos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = async () => {
        try {
            setLoading(true);
            await todoApi.deleteAllTodos();
            toast.success('Base de datos limpiada');
            onActionComplete();
        } catch (error) {
            toast.error('Error al limpiar base de datos');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden p-1 flex items-center gap-1 group">
                <div className="px-3 py-1 flex items-center gap-2 border-r border-zinc-800">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Dev Mode</span>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSeed}
                        disabled={loading}
                        className="h-8 px-3 text-zinc-300 hover:text-white hover:bg-zinc-900 gap-2 text-xs font-mono"
                    >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Database className="h-3 w-3 text-emerald-500" />}
                        Seed
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        disabled={loading}
                        className="h-8 px-3 text-zinc-300 hover:text-red-400 hover:bg-red-950/20 gap-2 text-xs font-mono"
                    >
                        <Trash2 className="h-3 w-3 text-red-500" />
                        Clear
                    </Button>
                </div>

                <div className="ml-1 w-6 h-8 flex items-center justify-center border-l border-zinc-800 text-zinc-600">
                    <Zap className="h-3 w-3" />
                </div>
            </div>
        </div>
    );
}
