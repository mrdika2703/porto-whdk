import { useRef } from 'react';
import { useLazySection } from '@/hooks/useLazySection';
import Layout from '@/layouts/layout';
import About from './about';
import CertificateSection from './certificate';
import DirectSection from './direct';
import Experience from './experience';
import DesignGraphicSection from './grapich';
import Hero from './hero';
import OtherSection from './other';
import PhotoVideoSection from './photography';
import Skills from './skills';
import WebsiteSection from './website';

export interface Profile {
    id: number;
    name: string;
    nickname: string;
    about: string;
    passion: string;
    caption: string;
    photo: string;
    whatsapp: string;
}

export interface Skill {
    id: number;
    name_skills: string;
    category: string;
    level: string | null;
    icon: string | null;
}

export interface Certificate {
    id: number;
    category: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string | null;
    url_1: string;
    url_2: string | null;
}

export interface Experience {
    id: number;
    title: string;
    origin: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string | null;
}

export interface Education {
    id: number;
    title: string;
    origin: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string | null;
}

export interface Design {
    id: number;
    category: string;
    title: string;
    url_1: string;
}

export interface PhotoVideo {
    id: number;
    title: string;
    category: string;
    description: string;
    type: string;
    url_1: string;
    url_2: string | null;
    url_3: string | null;
    url_4: string | null;
    url_5: string | null;
}

export interface Website {
    id: number;
    category: string;
    title: string;
    origin: string;
    description: string;
    tech: string;
    link: string | null;
    images: string[];
}

export interface Other {
    id: number;
    category: string;
    title: string;
    description: string;
    url_1: string;
    url_2: string | null;
    url_3: string | null;
    url_4: string | null;
    url_5: string | null;
}

export interface Footers {
    id: number;
    name: string;
    whatsapp: string;
    email: string;
    linkedin: string;
    linkedin_name: string;
    instagram: string;
    github: string;
}

// Definisikan Props yang diterima dari Laravel Controller
interface HomeProps {
    profiles: Profile[];
    skills: Skill[];
    certificates: Certificate[];
    experiences: Experience[];
    educations: Education[];
    designs: Design[];
    photovideos: PhotoVideo[];
    websites: Website[];
    others: Other[];
    footers: Footers[];
}

export default function Home({
    profiles = [],
    skills = [],
    certificates = [],
    experiences = [],
    educations = [],
    designs = [],
    photovideos = [],
    websites = [],
    others = [],
    footers = [],
}: HomeProps) {
    // Lazy load section berat — hanya render saat mendekati viewport (200px sebelum terlihat)
    const designRef = useRef<HTMLDivElement>(null);
    const designShouldRender = useLazySection(designRef, '300px');

    const photoRef = useRef<HTMLDivElement>(null);
    const photoShouldRender = useLazySection(photoRef, '300px');

    const websiteRef = useRef<HTMLDivElement>(null);
    const websiteShouldRender = useLazySection(websiteRef, '300px');

    const otherRef = useRef<HTMLDivElement>(null);
    const otherShouldRender = useLazySection(otherRef, '300px');

    return (
        <>
            <Layout footers={footers}>
                <div className="relative w-full overflow-x-hidden">
                    <Hero />
                    <div className="relative z-20">
                        <About profiles={profiles} />
                        <div className="bg-sectiondark">
                            <Skills skills={skills} />
                            <Experience
                                experiences={experiences}
                                educations={educations}
                            />
                        </div>
                        <CertificateSection certificates={certificates} />
                        <DirectSection />

                        {/* Lazy-loaded sections — placeholder div tetap ada agar scroll position benar */}
                        <div ref={designRef}>
                            {designShouldRender ? (
                                <DesignGraphicSection designs={designs} />
                            ) : (
                                <div className="min-h-[500px]" />
                            )}
                        </div>

                        <div className="bg-bphotograph" ref={photoRef}>
                            {photoShouldRender ? (
                                <PhotoVideoSection photovideos={photovideos} />
                            ) : (
                                <div className="min-h-[500px]" />
                            )}
                        </div>

                        <div ref={websiteRef}>
                            {websiteShouldRender ? (
                                <WebsiteSection websites={websites} />
                            ) : (
                                <div className="min-h-[650px]" />
                            )}
                        </div>

                        <div ref={otherRef}>
                            {otherShouldRender ? (
                                <OtherSection others={others} />
                            ) : (
                                <div className="min-h-[200px]" />
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
