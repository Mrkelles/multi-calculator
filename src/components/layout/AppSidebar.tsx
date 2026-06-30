"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { calculators } from '@/app/lib/calculators-data';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from '@/components/ui/sidebar';
import { Calculator } from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();

  const categories = [
    { id: 'finance', name: 'Finance' },
    { id: 'content', name: 'Content & Social' },
    { id: 'health', name: 'Health' },
    { id: 'education', name: 'Education' },
    { id: 'tools', name: 'Utility Tools' },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border h-16 flex items-center px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Calculator size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight group-data-[collapsible=icon]:hidden">My Apex Calc</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {categories.map((cat) => (
          <SidebarGroup key={cat.id}>
            <SidebarGroupLabel className="text-sidebar-foreground/50">{cat.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {calculators.filter(c => c.category === cat.id).map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={pathname === item.path}>
                      <Link href={item.path}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
