<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="index, follow">
    <meta name="author" content="Wahyu Adam Anandika">
    <meta name="description" content="Portofolio Wahyu Adam Anandika - Web Developer, Graphic Designer, Photography & Videography Specialist.">
    <meta name="keywords" content="Wahyu Adam Anandika, Portofolio, Web Developer, Fullstack Developer, Graphic Designer, Photographer, Videographer, Laravel, React">

    <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Portofolio - Wahyu Adam Anandika">
    <meta property="og:description" content="Portofolio Wahyu Adam Anandika - Web Developer, Graphic Designer, Photography & Videography Specialist.">
    <meta property="og:image" content="{{ asset('apple-touch-icon.png') }}">
    <meta property="og:url" content="{{ url()->current() }}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Portofolio - Wahyu Adam Anandika">
    <meta name="twitter:description" content="Portofolio Wahyu Adam Anandika - Web Developer, Graphic Designer, Photography & Videography Specialist.">
    <meta name="twitter:image" content="{{ asset('apple-touch-icon.png') }}">

    <link rel="canonical" href="{{ url()->current() }}">
    <link rel="icon" href="/favicon.ico?v=2" sizes="any">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    <script src="https://kit.fontawesome.com/746700f1ee.js" crossorigin="anonymous"></script>

    @fonts
    <!-- @routes -->

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ config('app.name', 'Wahyu Adam Anandika') }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    <x-inertia::app />
</body>

</html>