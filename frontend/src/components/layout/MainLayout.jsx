import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LayoutDashboard, PieChart, Settings, Wallet, CreditCard, Building, Plus, List, Github, Users, LogOut, User } from "lucide-react";
import { useAuth } from '../../context/AuthContext';

// Actually, I'll essentially implement a simple expand/collapse or just static grouping.
// User didn't explicitly ask for collapsible, just "under Assets".
// I will just use a visual grouping.

const Sidebar = ({ className, closeSheet }) => {
    const location = useLocation();
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
        if (closeSheet) closeSheet();
    };

    return (
        <div className={cn("pb-12 w-64 border-r bg-card h-full min-h-screen flex flex-col", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight flex items-center gap-2">
                        <Wallet className="w-6 h-6" />
                        Wealth Tracker
                    </h2>
                    <div className="space-y-1 mt-6">

                        {/* Dashboard */}
                        <Button asChild variant={location.pathname === "/" ? "secondary" : "ghost"} className="w-full justify-start" onClick={closeSheet}>
                            <Link to="/">
                                <LayoutDashboard className="w-4 h-4 mr-2" />
                                Dashboard
                            </Link>
                        </Button>

                        {/* Assets Group */}
                        <div className="pt-4">
                            <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                Assets
                            </h3>
                            <div className="space-y-1">
                                <Button asChild variant={location.pathname === "/assets" ? "secondary" : "ghost"} className="w-full justify-start pl-8" onClick={closeSheet}>
                                    <Link to="/assets">
                                        <List className="w-4 h-4 mr-2" />
                                        Manage Assets
                                    </Link>
                                </Button>
                                <Button asChild variant={location.pathname === "/add-asset" ? "secondary" : "ghost"} className="w-full justify-start pl-8" onClick={closeSheet}>
                                    <Link to="/add-asset">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Asset
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Liabilities */}
                        <Button asChild variant={location.pathname === "/liabilities" ? "secondary" : "ghost"} className="w-full justify-start mt-2" onClick={closeSheet}>
                            <Link to="/liabilities">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Liabilities
                            </Link>
                        </Button>

                        {/* Bank Accounts */}
                        <Button asChild variant={location.pathname === "/bank-accounts" ? "secondary" : "ghost"} className="w-full justify-start" onClick={closeSheet}>
                            <Link to="/bank-accounts">
                                <Building className="w-4 h-4 mr-2" />
                                Bank Accounts
                            </Link>
                        </Button>

                        {/* Graphs */}
                        <Button asChild variant={location.pathname === "/graphs" ? "secondary" : "ghost"} className="w-full justify-start" onClick={closeSheet}>
                            <Link to="/graphs">
                                <PieChart className="w-4 h-4 mr-2" />
                                Analysis
                            </Link>
                        </Button>

                        {/* Users - Admin Only */}
                        {isAdmin && (
                            <Button asChild variant={location.pathname === "/users" ? "secondary" : "ghost"} className="w-full justify-start" onClick={closeSheet}>
                                <Link to="/users">
                                    <Users className="w-4 h-4 mr-2" />
                                    Users
                                </Link>
                            </Button>
                        )}

                        {/* Settings */}
                        <Button asChild variant={location.pathname === "/settings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={closeSheet}>
                            <Link to="/settings">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* User Profile Section */}
            <div className="mt-auto border-t">
                <div className="p-4 space-y-3">
                    {/* Current User Info */}
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-muted/50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.username}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-red-500/10 hover:text-red-400"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>

                    {/* GitHub Link */}
                    <Button asChild variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={closeSheet}>
                        <a href="https://github.com/jeakob/wealth-tracker" target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub Repo
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
};

const MainLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden absolute top-4 left-4 z-50">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <Sidebar closeSheet={() => setIsOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            <main className="flex-1 p-8 pt-16 md:pt-8 w-full overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
