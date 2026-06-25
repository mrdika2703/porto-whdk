import React, { ReactNode } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import FloatingNavButton from '@/components/floating-nav-button';
import { Footers } from '../pages/Home';

export default function Layout({
    children,
    footers = [],
}: {
    children: React.ReactNode;
    footers: Footers[];
}) {
    return (
        <div className="flex min-h-screen flex-col bg-main font-inter transition-colors duration-200 ease-in">
            <Header />

            {/* Main content area */}
            <main className="flex-grow">{children}</main>

            <Footer footers={footers} />
            <FloatingNavButton />
        </div>
    );
}
