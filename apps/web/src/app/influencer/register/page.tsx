import InfluencerRegistrationForm from '@/components/influencer/InfluencerRegistrationForm';

export const metadata = {
    title: 'Join as Influencer | Local For Vocal Startup',
    description: 'Become an influencer partner and earn while you share products you love.',
};

export default function InfluencerRegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        Influence & Earn
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Join thousands of creators who are monetizing their content with our premium brand partnerships.
                    </p>
                </div>

                {/* Form Container */}
                <InfluencerRegistrationForm />

                {/* Steps Section */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: 'app_registration',
                            title: '1. Register',
                            desc: 'Complete the simple application form with your social details.'
                        },
                        {
                            icon: 'verified',
                            title: '2. Get Approved',
                            desc: 'Our team reviews your profile within 48 hours.'
                        },
                        {
                            icon: 'payments',
                            title: '3. Start Earning',
                            desc: 'Share products and earn competitive commissions on every sale.'
                        }
                    ].map((step, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 mx-auto bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 text-sm">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
