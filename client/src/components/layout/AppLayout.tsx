import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  MenuSquare,
  UtensilsCrossed,
  Users,
  LogOut,
  Menu as MenuIcon,
  Receipt,
  Grid } from
'lucide-react';
import { useAuth } from '../../lib/store';
import { Button } from '../ui/Button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/Sheet';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { Separator } from '../ui/Separator';
export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  if (!user) return null;
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['manager', 'waiter', 'kitchen']
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: Receipt,
    roles: ['manager']
  },
  {
    title: 'Tables',
    href: '/tables',
    icon: Grid,
    roles: ['manager']
  },
  {
    title: 'Staff',
    href: '/staff',
    icon: Users,
    roles: ['manager']
  },
  {
    title: 'Menu',
    href: '/menu',
    icon: MenuSquare,
    roles: ['manager']
  }];

  const filteredNav = navItems.filter((item) => item.roles.includes(user.role));
  const NavLinks = ({ onNavigate }: {onNavigate?: () => void;}) =>
  <div className="space-y-1">
      {filteredNav.map((item) => {
      const isActive = location.pathname === item.href;
      return (
        <Link key={item.href} to={item.href} onClick={onNavigate}>
            <Button
            variant={isActive ? 'secondary' : 'ghost'}
            className={`w-full justify-start ${isActive ? 'font-semibold' : 'font-normal text-muted-foreground'}`}>
            
              <item.icon className="w-5 h-5 mr-3" />
              {item.title}
            </Button>
          </Link>);

    })}
    </div>;

  const UserInfo = () =>
  <div className="flex items-center gap-3 px-2 mb-4">
      <Avatar>
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {user.fullName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="text-sm font-medium leading-none mb-1 truncate">
          {user.fullName}
        </span>
        <span className="text-xs text-muted-foreground capitalize">
          {user.role}
        </span>
      </div>
    </div>;

  if (user.role === 'manager') {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-56 lg:w-64 border-r bg-card px-3 lg:px-4 py-6 shrink-0">
          <div className="flex items-center gap-2 lg:gap-3 px-2 mb-8">
            <div className="bg-primary p-1.5 lg:p-2 rounded-lg text-primary-foreground">
              <UtensilsCrossed className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <span className="font-heading font-bold text-lg lg:text-xl tracking-tight">
              RestoManage
            </span>
          </div>
          <div className="flex-1">
            <NavLinks />
          </div>
          <div className="mt-auto pt-4">
            <Separator className="mb-4" />
            <UserInfo />
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 text-sm"
              onClick={handleLogout}>
              
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </aside>

        {/* Mobile + Content */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <header className="md:hidden flex items-center justify-between h-14 px-3 border-b bg-card shrink-0">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              <span className="font-heading font-bold text-base">
                RestoManage
              </span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-4 sm:p-6 flex flex-col">
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary p-2 rounded-lg text-primary-foreground">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <span className="font-heading font-bold text-xl">
                    RestoManage
                  </span>
                </div>
                <div className="flex-1">
                  <NavLinks />
                </div>
                <div className="mt-auto pt-4">
                  <Separator className="mb-4" />
                  <UserInfo />
                  <Button
                    variant="outline"
                    className="w-full justify-start text-destructive"
                    onClick={handleLogout}>
                    
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </header>

          <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>);

  }
  // Waiter & Kitchen Layout
  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Top Header */}
      <header className="flex items-center justify-between h-14 px-4 border-b bg-card shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="font-heading font-bold text-base">RestoManage</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
              {user.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}>
            
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-muted/20">
        <Outlet />
      </main>
    </div>);

}