import React, { ReactNode } from 'react';
import Footer from '@/components/footer';
import Header from '@/components/header';
import type { Footers } from '../pages/Home';

export default function Layout({
    children,
    footers = [],
}: {
    children: React.ReactNode;
    footers: Footers[];
}) {
    return (
        <div className="flex min-h-screen flex-col bg-main font-poppins transition-colors duration-200 ease-in">
            <Header />

            {/* Main content area */}
            <main className="flex-grow">{children}</main>

            <Footer footers={footers} />
        </div>
    );
}
