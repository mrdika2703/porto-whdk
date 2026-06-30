import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    description_coding?: string | null;
    description_multimedia?: string | null;
    passion_coding?: string | null;
    passion_multimedia?: string | null;
}

export interface DescriptionSection {
    id: number;
    design_section: string | null;
    photovideo_section: string | null;
    website_section: string | null;
    other_section: string | null;
}

export interface Skill {
    id: number;
    name_skills: string;
    category: string;
    level: string | null;
    icon: string | null;
    viewmode?: 'All' | 'Multimedia' | 'Programming' | null;
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
    viewmode?: 'All' | 'Multimedia' | 'Programming' | null;
}

export interface Experience {
    id: number;
    title: string;
    origin: string;
    description: string;
    status: string;
    start_date: string;
    end_date: string | null;
    viewmode?: 'All' | 'Multimedia' | 'Programming' | null;
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
    type: string;
    link: string | null;
    url_1: string;
    url_2: string | null;
    url_3: string | null;
}

export interface PhotoVideo {
    id: number;
    title: string;
    category: string;
    description: string;
    type: string;
    link: string | null;
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
    description_sections: DescriptionSection | null;
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
    description_sections = null,
    certificates = [],
    experiences = [],
    educations = [],
    designs = [],
    photovideos = [],
    websites = [],
    others = [],
    footers = [],
}: HomeProps) {
    const [viewMode, setViewMode] = useState<
        'All' | 'Multimedia' | 'Programming'
    >('All');
    const [isChangingMode, setIsChangingMode] = useState(false);
    const [transitionMode, setTransitionMode] = useState<
        'All' | 'Multimedia' | 'Programming'
    >('All');

    // Lazy load section berat — hanya render saat mendekati viewport (200px sebelum terlihat)
    const designSection = useLazySection('300px');
    const photoSection = useLazySection('300px');
    const websiteSection = useLazySection('300px');
    const otherSection = useLazySection('300px');

    const handleViewModeChange = (
        newMode: 'All' | 'Multimedia' | 'Programming',
    ) => {
        if (newMode === viewMode) return;
        setTransitionMode(newMode);
        setIsChangingMode(true);
        setTimeout(() => {
            setViewMode(newMode);
            setIsChangingMode(false);
            window.dispatchEvent(
                new CustomEvent('viewmode-changed', { detail: newMode }),
            );
        }, 400); // Durasi loading yang pas (400ms) untuk transisi yang mulus
    };

    useEffect(() => {
        const handleRequest = (e: Event) => {
            const customEvent = e as CustomEvent<
                'All' | 'Multimedia' | 'Programming'
            >;
            handleViewModeChange(customEvent.detail);
        };
        window.addEventListener('change-viewmode', handleRequest);

        // Dispatch current viewMode to any listening component on mount/update
        window.dispatchEvent(
            new CustomEvent('viewmode-changed', { detail: viewMode }),
        );

        return () => {
            window.removeEventListener('change-viewmode', handleRequest);
        };
    }, [viewMode]);

    return (
        <>
            <Head title="Portofolio - Wahyu Adam Anandika" />
            <Layout footers={footers}>
                <div className="relative w-full overflow-x-hidden">
                    <div className="relative z-0">
                        <Hero
                            viewMode={viewMode}
                            setViewMode={handleViewModeChange}
                        />
                    </div>
                    <div className="relative z-20">
                        <About profiles={profiles} viewMode={viewMode} />
                        <div className="bg-sectiondark">
                            <Skills skills={skills} viewMode={viewMode} />
                            <Experience
                                experiences={experiences}
                                educations={educations}
                                viewMode={viewMode}
                            />
                        </div>
                        <CertificateSection
                            certificates={certificates}
                            viewMode={viewMode}
                        />
                        <DirectSection viewMode={viewMode} />

                        {/* Lazy-loaded sections — conditional berdasarkan viewMode */}
                        <AnimatePresence mode="wait">
                            {(viewMode === 'All' ||
                                viewMode === 'Multimedia') && (
                                <motion.div
                                    key="design"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    id="design"
                                    ref={designSection.ref}
                                >
                                    {designSection.shouldRender ? (
                                        <DesignGraphicSection
                                            designs={designs}
                                            description_sections={
                                                description_sections
                                            }
                                        />
                                    ) : (
                                        <div className="min-h-[500px]" />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {(viewMode === 'All' ||
                                viewMode === 'Multimedia') && (
                                <motion.div
                                    key="photo"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    id="photo"
                                    className="bg-bphotograph"
                                    ref={photoSection.ref}
                                >
                                    {photoSection.shouldRender ? (
                                        <PhotoVideoSection
                                            photovideos={photovideos}
                                            description_sections={
                                                description_sections
                                            }
                                        />
                                    ) : (
                                        <div className="min-h-[500px]" />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {(viewMode === 'All' ||
                                viewMode === 'Programming') && (
                                <motion.div
                                    key="website"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    id="website"
                                    ref={websiteSection.ref}
                                >
                                    {websiteSection.shouldRender ? (
                                        <WebsiteSection
                                            websites={websites}
                                            description_sections={
                                                description_sections
                                            }
                                        />
                                    ) : (
                                        <div className="min-h-[650px]" />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div id="other" ref={otherSection.ref}>
                            {otherSection.shouldRender ? (
                                <OtherSection
                                    others={others}
                                    description_sections={description_sections}
                                />
                            ) : (
                                <div className="min-h-[200px]" />
                            )}
                        </div>
                    </div>
                </div>
            </Layout>

            {/* Animasi Loading Overlay Premium */}
            <AnimatePresence>
                {isChangingMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-main/80 backdrop-blur-md"
                    >
                        <div className="flex flex-col items-center gap-5">
                            {/* Spinner Gradient Minimalis */}
                            <div className="relative flex h-16 w-16 items-center justify-center">
                                <div className="absolute h-full w-full animate-spin rounded-full border-4 border-bshine/20 border-t-bshine"></div>
                                <div className="absolute h-10 w-10 animate-ping rounded-full bg-bshine/10"></div>
                            </div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="font-montserrat text-sm font-semibold tracking-widest text-tmain uppercase"
                            >
                                Mode: {transitionMode}
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
