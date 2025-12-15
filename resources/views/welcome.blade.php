@extends('layouts.app')

@section('content')
    <div class="text-center py-20">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
            Welcome to <span class="text-indigo-600">{{ config('app.name') }}</span>
        </h1>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            A modern application stack running on Docker with Laravel and Tailwind CSS.
            Your foundation for building something amazing starts here.
        </p>
        <div class="flex justify-center gap-4">
            <a href="#" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                Get Started
            </a>
            <a href="https://laravel.com/docs" target="_blank" class="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition">
                Documentation
            </a>
        </div>
        
        <div class="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg p-6">
                <div class="text-indigo-500 mb-4">
                    <svg class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">High Performance</h3>
                <p class="mt-2 text-base text-gray-500">
                    Optimized for speed with modern caching and efficient database queries.
                </p>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg p-6">
                <div class="text-indigo-500 mb-4">
                    <svg class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">Secure</h3>
                <p class="mt-2 text-base text-gray-500">
                    Built-in protection against common web vulnerabilities.
                </p>
            </div>
            
            <div class="bg-white overflow-hidden shadow rounded-lg p-6">
                <div class="text-indigo-500 mb-4">
                    <svg class="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">Modular</h3>
                <p class="mt-2 text-base text-gray-500">
                    Component-based architecture for easy maintenance and scalability.
                </p>
            </div>
        </div>
    </div>
@endsection
