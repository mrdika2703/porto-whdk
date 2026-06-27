import type { Footers } from '../pages/Home';

export default function Footer({ footers }: { footers: Footers[] }) {
    const footer = footers[0];
    return (
        <footer
            id="contact-footer"
            // Radius, padding atas/bawah, dan padding samping diperkecil di HP, dikembalikan di md/lg
            className="relative z-10 mt-10 flex w-full flex-col items-center gap-10 overflow-hidden rounded-t-[50px] bg-sectiondark px-6 pt-12 pb-8 font-poppins md:mt-20 md:gap-16 md:rounded-t-[80px] md:px-16 md:pt-20 md:pb-10 lg:rounded-t-[120px] lg:px-28"
        >
            {/* --- TOMBOL KONTAK UTAMA (GLOWING) --- */}
            <div className="z-10 flex w-full flex-wrap items-center justify-center gap-4 md:gap-6">
                {/* Tombol WhatsApp (Contact Me) */}
                <a
                    href={`https://wa.me/62${footer.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    // Lebar tombol diperbesar sedikit di HP (w-full sm:w-auto) dan padding diperkecil
                    className="flex w-[80%] items-center justify-center rounded-full bg-white px-6 py-3.5 transition-transform hover:scale-102 hover:shadow-xl/50 hover:shadow-white/30 sm:w-auto md:rounded-3xl md:px-8 md:py-4"
                >
                    <span className="text-lg font-semibold text-[#050015] md:text-xl">
                        Contact me
                        <i className="fa-brands fa-whatsapp ml-2"></i>
                    </span>
                </a>

                {/* Wrapper untuk icon sosial media agar rapi di HP jika turun baris */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    {/* Email Icon */}
                    <a
                        href={`mailto:${footer.email}`}
                        className="flex items-center justify-center rounded-full border border-white/50 bg-white/10 p-3.5 transition-transform hover:scale-102 hover:bg-white/20 hover:shadow-xl/50 hover:shadow-white/30 md:p-4"
                    >
                        <span className="flex h-5 w-5 items-center justify-center text-lg text-white/80 hover:text-white md:h-6 md:w-6 md:text-xl">
                            <i className="fa-regular fa-envelope"></i>
                        </span>
                    </a>

                    {/* LinkedIn Icon */}
                    <a
                        href={footer.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center rounded-full border border-white/50 bg-white/10 p-3.5 transition-transform hover:scale-102 hover:bg-white/20 hover:shadow-xl/50 hover:shadow-white/30 md:p-4"
                    >
                        <span className="flex h-5 w-5 items-center justify-center text-lg text-white/80 hover:text-white md:h-6 md:w-6 md:text-xl">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </span>
                    </a>

                    {/* Instagram Icon */}
                    <a
                        href={`https://instagram.com/${footer.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center rounded-full border border-white/50 bg-white/10 p-3.5 transition-transform hover:scale-102 hover:bg-white/20 hover:shadow-xl/50 hover:shadow-white/30 md:p-4"
                    >
                        <span className="flex h-5 w-5 items-center justify-center text-lg text-white/80 hover:text-white md:h-6 md:w-6 md:text-xl">
                            <i className="fa-brands fa-instagram"></i>
                        </span>
                    </a>
                </div>
            </div>

            {/* --- INFORMASI & LINK NAVIGASI --- */}
            {/* Di HP layout flex-col (atas-bawah), di md flex-row (kiri-kanan) */}
            <div className="z-10 flex w-full max-w-6xl flex-col items-start justify-between gap-10 md:flex-row md:gap-5">
                {/* Kiri: Daftar Kontak */}
                <div className="flex w-full flex-col gap-3 md:w-auto md:gap-2">
                    <div className="mb-2 items-center text-white md:mb-4">
                        <span className="border-b border-white/20 pb-1 text-base font-semibold tracking-wide md:border-none md:pb-0 md:text-sm">
                            Contacts
                        </span>
                    </div>

                    {/* Perbaikan ikon: menggunakan flex agar tidak bertabrakan dengan teks jika teks panjang dan turun baris */}
                    <div className="flex items-center text-white transition-colors">
                        <span className="mr-3 w-5 text-center text-base tracking-wide md:mt-0 md:mr-4 md:text-lg">
                            <i className="fa-brands fa-whatsapp"></i>
                        </span>
                        <span className="text-xs font-light tracking-wide break-all sm:text-sm">
                            0{footer.whatsapp}
                        </span>
                    </div>

                    <div className="flex items-center text-white transition-colors">
                        <span className="mr-3 w-5 text-center text-base tracking-wide md:mt-0 md:mr-4 md:text-lg">
                            {/* Icon Instagram yang benar */}
                            <i className="fa-brands fa-instagram"></i>
                        </span>
                        <span className="text-xs font-light tracking-wide break-all sm:text-sm">
                            {footer.instagram}
                        </span>
                    </div>

                    <div className="flex items-center text-white transition-colors">
                        <span className="mr-3 w-5 text-center text-base tracking-wide md:mt-0 md:mr-4 md:text-lg">
                            <i className="fa-regular fa-envelope"></i>
                        </span>
                        <span className="text-xs font-light tracking-wide break-all sm:text-sm">
                            {footer.email}
                        </span>
                    </div>

                    <div className="flex items-center text-white transition-colors">
                        <span className="mr-3 w-5 text-center text-base tracking-wide md:mt-0 md:mr-4 md:text-lg">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </span>
                        <span className="text-xs font-light tracking-wide sm:text-sm">
                            {footer.linkedin_name}
                        </span>
                    </div>
                </div>

                {/* Kanan: Navigasi Menu */}
                <div className="flex w-full flex-col gap-2.5 md:w-auto md:gap-3">
                    <div className="mb-2 text-white md:mb-3">
                        <span className="block w-fit border-b border-white/20 pb-1 text-base font-semibold tracking-wide md:border-none md:pb-0 md:text-sm">
                            Quick Page
                        </span>
                    </div>
                    <a
                        href="#home"
                        className="w-fit text-xs font-light tracking-wide text-white transition-colors hover:text-bshine sm:text-sm"
                    >
                        Home
                    </a>
                    <a
                        href="#design"
                        className="w-fit text-xs font-light tracking-wide text-white transition-colors hover:text-bshine sm:text-sm"
                    >
                        Design Graphic
                    </a>
                    <a
                        href="#photo"
                        className="w-fit text-xs font-light tracking-wide text-white transition-colors hover:text-bshine sm:text-sm"
                    >
                        Photography & Videography
                    </a>
                    <a
                        href="#website"
                        className="w-fit text-xs font-light tracking-wide text-white transition-colors hover:text-bshine sm:text-sm"
                    >
                        Websites
                    </a>
                </div>
            </div>

            {/* --- COPYRIGHT --- */}
            <div className="z-10 mt-6 flex w-full max-w-6xl flex-col items-center gap-6 md:mt-4 md:gap-8">
                <div className="h-[1px] w-full bg-white/20"></div>
                <p className="text-center text-[10px] font-light tracking-wider text-white sm:text-xs md:text-sm">
                    {footer.name} © {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    );
}
