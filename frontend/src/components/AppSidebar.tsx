import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Search, CheckCircle2, Circle, StickyNote, Tag, Calendar, LayoutGrid } from 'lucide-react';
import { ModeToggle } from './theme/ModeToggle';
import { PaletteToggle } from './theme/PaletteToggle';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { TodoStatus } from '@/services/api';

interface AppSidebarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    filter: TodoStatus;
    onFilterChange: (filter: TodoStatus) => void;
    activeCount: number;
    completedCount: number;
    loading: boolean;
}

export function AppSidebar({ searchQuery, onSearchChange, filter, onFilterChange, activeCount, completedCount, loading }: AppSidebarProps) {
    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-2 font-bold text-xl px-2 text-foreground">
                    <span className="capitalize">Focuspan</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent className="px-2 pb-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar tareas..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-8 h-9" disabled={loading} />
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Filtros</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={filter === 'all'} onClick={() => onFilterChange('all')} tooltip="Todas las tareas">
                                    <LayoutGrid className="h-4 w-4 text-muted-foreground" />
                                    <span>Todas</span>
                                    <Badge variant="secondary" className="ml-auto">
                                        {activeCount + completedCount}
                                    </Badge>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={filter === 'active'} onClick={() => onFilterChange('active')} tooltip="Tareas pendientes">
                                    <Circle className="h-4 w-4 text-accent-foreground" />
                                    <span>Activas</span>
                                    <Badge variant="secondary" className="ml-auto">
                                        {activeCount}
                                    </Badge>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton isActive={filter === 'completed'} onClick={() => onFilterChange('completed')} tooltip="Tareas completadas">
                                    <CheckCircle2 className="h-4 w-4 text-primary" />
                                    <span>Completadas</span>
                                    <Badge variant="secondary" className="ml-auto">
                                        {completedCount}
                                    </Badge>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Próximamente</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton disabled className="opacity-50">
                                    <StickyNote className="h-4 w-4 text-muted-foreground" />
                                    <span>Notas</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton disabled className="opacity-50">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span>Etiquetas</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton disabled className="opacity-50">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Calendario</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-border">
                <div className="flex items-center justify-between px-2">
                    <span className="text-sm text-muted-foreground font-medium">Tema</span>
                    <div className="flex items-center gap-2">
                        <PaletteToggle />
                        <ModeToggle />
                    </div>
                </div>
            </SidebarFooter>

        </Sidebar>
    );
}
