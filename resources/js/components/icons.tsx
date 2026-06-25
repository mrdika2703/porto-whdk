import React from 'react';

// Base classes applied to all icon images:
// - object-contain: prevents non-1:1 images from being cropped
// - w-full h-full: fills the container
// - select-none pointer-events-none: disables click/download/drag
const baseClass = 'w-full h-full object-contain select-none pointer-events-none';

/** Shared img props for performance & protection */
const baseProps = {
    className: baseClass,
    draggable: false,
    loading: 'lazy' as const,
    decoding: 'async' as const,
};

/** Helper to create an icon with extra classes merged in */
const withExtra = (extra: string) => ({
    ...baseProps,
    className: `${baseClass} ${extra}`,
});

// Multimedia Apps

export const PhotoshopIcon = () => (
    <img src="assets/icons/multiApps/photoshop-128px.webp" alt="Photoshop" {...baseProps} />
);

export const LightroomIcon = () => (
    <img src="assets/icons/multiApps/lightroom-128px.webp" alt="Lightroom" {...baseProps} />
);

export const AfterEffctIcon = () => (
    <img src="assets/icons/multiApps/after-effects-128px.webp" alt="AfterEffect" {...baseProps} />
);

export const IllustratorIcon = () => (
    <img src="assets/icons/multiApps/illustrator-128px.webp" alt="Illustrator" {...baseProps} />
);

export const CanvaIcon = () => (
    <img src="assets/icons/multiApps/canva-128px.webp" alt="Canva" {...baseProps} />
);

export const CorellIcon = () => (
    <img src="assets/icons/multiApps/coreldraw-128px.webp" alt="Coreldraw" {...withExtra('rounded-lg bg-white p-1')} />
);

export const PremiereIcon = () => (
    <img src="assets/icons/multiApps/premiere-128px.webp" alt="Premiere" {...baseProps} />
);

export const OfficeIcon = () => (
    <img src="assets/icons/multiApps/microsoft-office-128px.webp" alt="Office" {...baseProps} />
);

export const ExcelIcon = () => (
    <img src="assets/icons/multiApps/microsoft-excel-128px.webp" alt="Excel" {...baseProps} />
);

export const PowerpointIcon = () => (
    <img src="assets/icons/multiApps/microsoft-powerpoint-128px.webp" alt="Powerpoint" {...baseProps} />
);

export const SpreadsheetIcon = () => (
    <img src="assets/icons/multiApps/spreadsheet-128px.webp" alt="Spreadsheet" {...baseProps} />
);

// Code Apps

export const FigmaIcon = () => (
    <img src="assets/icons/codeApps/figma-128px.webp" alt="Figma" {...baseProps} />
);

export const TailwindIcon = () => (
    <img src="assets/icons/codeApps/tailwind-css-128px.webp" alt="Tailwind" {...baseProps} />
);

export const GitIcon = () => (
    <img src="assets/icons/codeApps/git-128px.webp" alt="Git" {...baseProps} />
);

export const GithubIcon = () => (
    <img src="assets/icons/codeApps/github-dark-128px.webp" alt="Github" {...baseProps} />
);

export const ReactIcon = () => (
    <img src="assets/icons/codeApps/react-128px.webp" alt="React" {...baseProps} />
);

export const PhpIcon = () => (
    <img src="assets/icons/codeApps/php-128px.webp" alt="PHP" {...baseProps} />
);

export const JsIcon = () => (
    <img src="assets/icons/codeApps/javascript-128px.webp" alt="JavaScript" {...baseProps} />
);

export const LaravelIcon = () => (
    <img src="assets/icons/codeApps/laravel-128px.webp" alt="Laravel" {...baseProps} />
);

export const HtmlIcon = () => (
    <img src="assets/icons/codeApps/html5-128px.webp" alt="HTML" {...baseProps} />
);

export const CssIcon = () => (
    <img src="assets/icons/codeApps/css-128px.webp" alt="CSS" {...baseProps} />
);

export const MysqlIcon = () => (
    <img src="assets/icons/codeApps/mysql-wordmark-light-128px.webp" alt="MySQL" {...baseProps} />
);

export const PgsqlIcon = () => (
    <img src="assets/icons/codeApps/postgresql-128px.webp" alt="PostgreSQL" {...baseProps} />
);

export const PythonIcon = () => (
    <img src="assets/icons/codeApps/python-128px.webp" alt="Python" {...baseProps} />
);

export const NodeJsIcon = () => (
    <img src="assets/icons/codeApps/nodedotjs-mono-128px.webp" alt="NodeJs" {...withExtra('rounded-lg bg-white p-1')} />
);

export const ApiIcon = () => (
    <img src="assets/icons/codeApps/gcp-api-128px.webp" alt="API" {...baseProps} />
);
