import { Head } from '@inertiajs/react';
import Layout from '@/layouts/layout';
import Hero from './hero';
import About from './about';
import Skills from './skills';
import Experience from './experience';
import DirectSection from './direct';
import DesignGraphicSection from './grapich';
import PhotoVideoSection from './photography';
import WebsiteSection from './website';
import CertificateSection from './certificate';
import OtherSection from './other';
import { useLazySection } from '@/hooks/useLazySection';

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
    const designSection = useLazySection('300px');
    const photoSection = useLazySection('300px');
    const websiteSection = useLazySection('300px');
    const otherSection = useLazySection('300px');

    return (
        <>
            <Head title="Portofolio - Wahyu Adam Anandika" />
            <Layout footers={footers}>
                <div className="relative w-full overflow-x-hidden">
                    <div className="relative z-0">
                        <Hero />
                    </div>
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
                        <div id="design" ref={designSection.ref}>
                            {designSection.shouldRender ? (
                                <DesignGraphicSection designs={designs} />
                            ) : (
                                <div className="min-h-[500px]" />
                            )}
                        </div>

                        <div
                            id="photo"
                            className="bg-bphotograph"
                            ref={photoSection.ref}
                        >
                            {photoSection.shouldRender ? (
                                <PhotoVideoSection photovideos={photovideos} />
                            ) : (
                                <div className="min-h-[500px]" />
                            )}
                        </div>

                        <div id="website" ref={websiteSection.ref}>
                            {websiteSection.shouldRender ? (
                                <WebsiteSection websites={websites} />
                            ) : (
                                <div className="min-h-[650px]" />
                            )}
                        </div>

                        <div id="other" ref={otherSection.ref}>
                            {otherSection.shouldRender ? (
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
