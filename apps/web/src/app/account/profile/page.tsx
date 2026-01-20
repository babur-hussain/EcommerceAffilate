'use client';

import Link from 'next/link';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-[#f6f8f8] text-[#0f181a] font-sans pb-20">
            <main className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-10">
                {/* Sidebar Navigation - Reused from Orders Page for consistency */}
                <aside className="w-full lg:w-72 flex flex-col gap-8 shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8f0f2]">
                        <div className="flex items-center gap-4 mb-8">
                            <div
                                className="size-12 rounded-full bg-cover bg-center border border-neutral-200"
                                style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=User&background=random')" }}
                            ></div>
                            <div>
                                <h3 className="font-bold text-lg text-neutral-900">My Account</h3>
                                <p className="text-xs text-[#22a8c3] font-bold uppercase tracking-wider">Member</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">package_2</span>
                                <span>Orders</span>
                            </Link>
                            <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#22a8c3] text-white font-medium transition-all shadow-md shadow-[#22a8c3]/20">
                                <span className="material-symbols-outlined filled">person</span>
                                <span>Profile</span>
                            </Link>
                            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">location_on</span>
                                <span>Addresses</span>
                            </Link>
                            <Link href="/account/payments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">credit_card</span>
                                <span>Payments</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Promotion Card */}
                    <div className="bg-[#22a8c3]/10 rounded-xl p-6 border border-[#22a8c3]/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[#22a8c3] font-bold text-sm mb-1">Upgrade to Gold</p>
                            <p className="text-sm mb-4 text-neutral-600">Get unlimited free deliveries on all orders above ₹200.</p>
                            <button className="bg-[#22a8c3] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1b8fa6] transition-colors">
                                Learn More
                            </button>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[#22a8c3]/10 text-8xl rotate-12 select-none">loyalty</span>
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1 flex flex-col gap-8 min-w-0">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-2">
                        <Link href="/account" className="text-[#538893] text-sm font-medium hover:text-[#22a8c3]">Account</Link>
                        <span className="text-[#538893] text-sm">/</span>
                        <span className="text-[#22a8c3] text-sm font-semibold">Personal Information</span>
                    </div>

                    {/* PageHeading */}
                    <div className="mb-4">
                        <h1 className="text-4xl font-black tracking-tight mb-2 text-[#0f181a]">Personal Information</h1>
                        <p className="text-[#538893] text-base">Manage your profile details, secure your identity, and link social accounts.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left Column: Profile & Security */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* ProfileHeader */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e8f0f2]">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative group cursor-pointer">
                                        <div
                                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 ring-4 ring-[#22a8c3]/10"
                                            style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=User&background=random')" }}
                                        ></div>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-white">photo_camera</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h3 className="text-xl font-bold text-[#0f181a]">User Name</h3>
                                        <p className="text-[#538893] text-sm">Member since July 2023</p>
                                    </div>
                                    <button className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#f0f4f5] hover:bg-[#22a8c3]/10 hover:text-[#22a8c3] transition-all rounded-lg font-bold text-sm text-[#0f181a]">
                                        <span className="material-symbols-outlined text-lg">upload</span>
                                        Update Photo
                                    </button>
                                </div>
                            </div>

                            {/* ProgressBar (Security Strength) */}
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-[#e8f0f2]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[#22a8c3]">verified_user</span>
                                        <p className="text-sm font-bold uppercase tracking-wider text-[#0f181a]">Security</p>
                                    </div>
                                    <p className="text-[#22a8c3] text-sm font-bold">85%</p>
                                </div>
                                <div className="rounded-full bg-[#e8f0f2] h-2 w-full overflow-hidden">
                                    <div className="h-full bg-[#22a8c3]" style={{ width: '85%' }}></div>
                                </div>
                                <p className="text-[#538893] text-xs mt-4 leading-relaxed italic">Your account is highly secure. Enable 2FA to reach 100%.</p>
                            </div>
                        </div>

                        {/* Right Column: Personal Details & Social */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Form Fields Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-[#e8f0f2] overflow-hidden">
                                <div className="px-8 py-6 border-b border-[#e8f0f2] bg-[#f8fbfb]/50">
                                    <h3 className="font-bold text-lg text-[#0f181a]">Personal Details</h3>
                                </div>
                                <div className="divide-y divide-[#e8f0f2]">
                                    {/* Full Name */}
                                    <div className="group px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#f6f8f8]/50">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-[#538893] uppercase tracking-wider">Full Name</label>
                                            <p className="text-base font-medium text-[#0f181a]">User Name</p>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[#22a8c3] text-sm font-bold hover:underline">
                                            Change <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    </div>
                                    {/* Email */}
                                    <div className="group px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#f6f8f8]/50">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-[#538893] uppercase tracking-wider">Email Address</label>
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-medium text-[#0f181a]">user@example.com</p>
                                                <span className="flex items-center gap-1 bg-[#dcfce7] text-[#166534] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border border-[#bbf7d0]">
                                                    <span className="material-symbols-outlined text-[12px] fill-1">check_circle</span>
                                                    Verified
                                                </span>
                                            </div>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[#22a8c3] text-sm font-bold hover:underline">
                                            Change <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    </div>
                                    {/* Phone */}
                                    <div className="group px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-[#f6f8f8]/50">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs font-bold text-[#538893] uppercase tracking-wider">Phone Number</label>
                                            <p className="text-base font-medium text-[#0f181a]">+1 (555) 012-3456</p>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[#22a8c3] text-sm font-bold hover:underline">
                                            Change <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Connected Accounts Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-[#e8f0f2] overflow-hidden">
                                <div className="px-8 py-6 border-b border-[#e8f0f2]">
                                    <h3 className="font-bold text-lg text-[#0f181a]">Connected Accounts</h3>
                                </div>
                                <div className="px-8 py-6 space-y-6">
                                    {/* Google */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 flex items-center justify-center rounded-lg border border-[#e8f0f2]">
                                                <svg className="size-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0f181a]">Google</p>
                                                <p className="text-xs text-[#538893]">Connected as alex.j@gmail.com</p>
                                            </div>
                                        </div>
                                        <button className="text-red-500 hover:text-red-600 text-sm font-bold transition-colors">Disconnect</button>
                                    </div>
                                    {/* Apple */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 flex items-center justify-center rounded-lg border border-[#e8f0f2]">
                                                <svg className="size-5 fill-[#000000]" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-83.6-20.8C62.3 140.3 0 195.3 0 311c0 63.7 16.2 125 48.5 171.4 18.8 26.9 44.9 57.1 76.5 56 32.7-1.1 46.1-21 86.8-21 40.5 0 53 21 86.8 20.2 32.7-.8 55.4-27.1 74.3-54.4 21.8-31.4 30.7-61.9 31-63.5-.7-.3-59.7-22.9-60.1-90.2l.2-.8zM232.2 65.6c18.5-22.3 31.1-53.3 27.7-84.3-26.6 1.1-58.8 17.7-77.8 39.9-17 19.8-31.9 51.5-28.5 81.3 29.5 2.3 59.8-14.7 78.6-36.9z"></path>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#0f181a]">Apple ID</p>
                                                <p className="text-xs text-[#538893]">Not connected</p>
                                            </div>
                                        </div>
                                        <button className="text-[#22a8c3] hover:text-[#22a8c3]/80 text-sm font-bold transition-colors">Connect</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer-style Help Area */}
                    <div className="mt-8 p-8 rounded-xl bg-[#22a8c3]/5 border border-[#22a8c3]/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="size-12 bg-[#22a8c3]/20 rounded-full flex items-center justify-center text-[#22a8c3]">
                                <span className="material-symbols-outlined">help_outline</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0f181a]">Need help with your data?</h4>
                                <p className="text-sm text-[#538893]">Read our privacy policy or contact support for data requests.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-6 py-2.5 rounded-lg text-sm font-bold border border-[#22a8c3] text-[#22a8c3] hover:bg-[#22a8c3]/5 transition-colors">Privacy Policy</button>
                            <button className="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#22a8c3] text-white hover:bg-[#1b8fa6] transition-colors shadow-lg shadow-[#22a8c3]/20">Contact Support</button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
