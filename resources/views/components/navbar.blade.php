<nav class="bg-white shadow">
    <div class="container mx-auto px-4">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="shrink-0 flex items-center">
                    <a href="{{ url('/') }}" class="text-xl font-bold text-indigo-600">
                        {{ config('app.name', 'Laravel') }}
                    </a>
                </div>
            </div>
            <div class="flex items-center space-x-4">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/home') }}" class="text-gray-700 hover:text-indigo-600 font-medium transition">Home</a>
                    @else
                        <a href="{{ route('login') }}" class="text-gray-700 hover:text-indigo-600 font-medium transition">Log in</a>
                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="text-gray-700 hover:text-indigo-600 font-medium transition">Register</a>
                        @endif
                    @endauth
                @endif
            </div>
        </div>
    </div>
</nav>
