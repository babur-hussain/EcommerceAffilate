'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type Step = 2 | 3 | 4 | 5 | 6;

interface BusinessFormData {
    // Step 2: Business Info (now first step)
    legalBusinessName: string;
    tradeName: string;
    businessType: string;
    natureOfBusiness: string;
    yearEstablished: string;

    // Step 3: Owner Details
    ownerFullName: string;
    designation: string;
    ownerMobile: string;
    ownerEmail: string;
    dob: string;
    gender: string;
    govIdType: string;
    govIdNumber: string;
    idProofFile?: File;

    // Step 4: Address
    registeredAddress: string;
    registeredAddressLine2: string;
    city: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
    sameAsRegistered: boolean;
    operationalAddress?: string;

    // Step 5: Tax & Legal
    hasGST: boolean;
    gstin: string;
    gstType: string;
    gstCertFile?: File;
    panNumber: string;
    panFile?: File;
    cin?: string;
    shopCertFile?: File;
    udyamNumber?: string;

    // Step 6: Bank & Settlement
    bankAccountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    bankAccountType: string;
    chequeFile?: File;
    settlementCycle: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function InfluencerRegistrationModal({ open, onClose, onSuccess }: Props) {
    const { firebaseUser, idToken } = useAuth();
    const [step, setStep] = useState<Step>(2);
    const [formData, setFormData] = useState<BusinessFormData>({
        legalBusinessName: '',
        tradeName: '',
        businessType: '',
        natureOfBusiness: '',
        yearEstablished: new Date().getFullYear().toString(),
        ownerFullName: '',
        designation: 'Owner',
        ownerMobile: '',
        ownerEmail: firebaseUser?.email || '',
        dob: '',
        gender: '',
        govIdType: '',
        govIdNumber: '',
        registeredAddress: '',
        registeredAddressLine2: '',
        city: '',
        district: '',
        state: '',
        country: 'India',
        pincode: '',
        sameAsRegistered: true,
        operationalAddress: '',
        hasGST: false,
        gstin: '',
        gstType: 'Regular',
        panNumber: '',
        cin: '', // Initialize with empty string
        udyamNumber: '', // Initialize with empty string
        bankAccountName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        bankAccountType: 'Savings',
        settlementCycle: 'Weekly',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    if (!open) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files?.[0]) {
            setFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!firebaseUser) {
                throw new Error('Not logged in. Please log in first.');
            }

            if (!idToken) {
                throw new Error('Authentication required. Please refresh and log in again.');
            }

            // Reusing the business endpoint for now as per plan, can be switched to /influencer/register later
            const submitData = {
                accountType: 'new',
                businessIdentity: {
                    // Hardcoded to 'Influencer' to match backend Enum
                    legalBusinessName: formData.legalBusinessName,
                    tradeName: formData.tradeName,
                    businessType: 'Influencer',
                    natureOfBusiness: 'Content Creator', // or 'Influencer'
                    yearOfEstablishment: parseInt(formData.yearEstablished),
                },
                ownerDetails: {
                    fullName: formData.ownerFullName,
                    designation: formData.designation,
                    mobileNumber: formData.ownerMobile,
                    email: formData.ownerEmail,
                    dob: formData.dob,
                    gender: formData.gender,
                    governmentIdType: formData.govIdType,
                    governmentIdNumber: formData.govIdNumber,
                },
                addresses: {
                    registered: {
                        addressLine1: formData.registeredAddress,
                        addressLine2: formData.registeredAddressLine2,
                        city: formData.city,
                        district: formData.district,
                        state: formData.state,
                        country: formData.country,
                        pincode: formData.pincode,
                    },
                    operational: formData.sameAsRegistered
                        ? {
                            addressLine1: formData.registeredAddress,
                            addressLine2: formData.registeredAddressLine2,
                            city: formData.city,
                            district: formData.district,
                            state: formData.state,
                            country: formData.country,
                            pincode: formData.pincode,
                        }
                        : {
                            addressLine1: formData.operationalAddress || '',
                            city: formData.city,
                            state: formData.state,
                            country: formData.country,
                            pincode: formData.pincode,
                        },
                },
                taxLegal: {
                    hasGST: formData.hasGST,
                    gstinNumber: formData.hasGST ? formData.gstin : 'NOT_APPLICABLE',
                    gstRegistrationType: formData.hasGST ? formData.gstType : 'Regular',
                    panNumber: formData.panNumber,
                    cin: formData.cin || '',
                    udyamNumber: formData.udyamNumber || '',
                },
                bankDetails: {
                    accountHolderName: formData.bankAccountName,
                    bankName: formData.bankName,
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    accountType: formData.bankAccountType,
                },
                storeProfile: {
                    storeName: formData.tradeName,
                    storeDescription: `Platform: ${formData.businessType}, Category: ${formData.natureOfBusiness}`,
                    categories: [formData.natureOfBusiness],
                    brandOwnership: 'Influencer',
                },
                compliance: {
                    sellerAgreementAccepted: true,
                    platformPoliciesAccepted: true,
                    taxResponsibilityAccepted: true,
                    acceptedAt: new Date().toISOString(),
                },
            };

            const backendUrl = process.env.NEXT_PUBLIC_API_BASE || '/api';

            const response = await fetch(`${backendUrl}/influencer/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || error.error || 'Failed to create influencer account');
            }

            setShowSuccessModal(true);
        } catch (err: any) {
            console.error('❌ Error:', err);
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900">Influencer Information</h3>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Display Name / Handle <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="tradeName"
                                value={formData.tradeName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                                placeholder="@username or Channel Name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Legal Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="legalBusinessName"
                                value={formData.legalBusinessName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="hidden">
                            {/* Hidden fields to satisfy TS but pre-filled logic */}
                            <input type="hidden" name="businessType" value="Proprietorship" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Primary Platform <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="businessType"
                                value={formData.businessType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            >
                                <option>Select Platform</option>
                                <option value="Instagram">Instagram</option>
                                <option value="YouTube">YouTube</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Twitch">Twitch</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Content Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="natureOfBusiness"
                                value={formData.natureOfBusiness}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            >
                                <option>Select Category</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Tech">Tech</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Beauty">Beauty</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900">Personal Details</h3>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ownerFullName"
                                value={formData.ownerFullName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-800">
                                    Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="ownerMobile"
                                    value={formData.ownerMobile}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-800">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="ownerEmail"
                                    value={formData.ownerEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-800">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                >
                                    <option>Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-800">
                                    Government ID Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="govIdNumber"
                                    value={formData.govIdNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Government ID Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="govIdType"
                                value={formData.govIdType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            >
                                <option>Select ID Type</option>
                                <option value="Aadhaar">Aadhaar</option>
                                <option value="PAN">PAN</option>
                                <option value="Passport">Passport</option>
                            </select>
                        </div>
                    </div>
                );

            case 4:
                // Reusing Address form but simplified if needed, keeping same for now for robustness
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900">Address Details</h3>

                        <div className="p-3 bg-slate-50 rounded-lg">
                            <h4 className="font-medium mb-3 text-gray-800">Mailing Address</h4>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-800">
                                    Address Line 1 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="registeredAddress"
                                    value={formData.registeredAddress}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className="mt-2">
                                <label className="block text-sm font-medium mb-1 text-gray-800">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                    required
                                />
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-800">
                                        State <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-800">
                                        Pincode <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900">Tax Information</h3>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                PAN Card Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                placeholder="10 digit PAN"
                                required
                            />
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-gray-900">Payout Details</h3>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Bank Account Holder Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="bankAccountName"
                                value={formData.bankAccountName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Bank Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                Account Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-800">
                                IFSC Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="ifscCode"
                                value={formData.ifscCode}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                                required
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden relative flex flex-col">
                {/* Close Button - Pink Theme */}
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white bg-black/10 hover:bg-black/20 rounded-full transition-all z-20 backdrop-blur-sm"
                >
                    <span className="material-symbols-outlined text-2xl">close</span>
                </button>

                {/* Header - Pink Gradient */}
                <div className="relative bg-linear-to-r from-[#ec4899] to-[#f43f5e] text-white px-6 py-5 border-b border-pink-400/30 shadow-lg shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-3xl">campaign</span>
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold">Influencer Registration</h2>
                            <p className="text-pink-100 text-sm">Step {step - 1} of 5</p>
                        </div>
                    </div>
                    {/* Progress Bar - Pink */}
                    <div className="mt-4 w-full bg-black/10 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-500 ease-out shadow-glow"
                            style={{ width: `${((step - 1) / 5) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                                <span className="material-symbols-outlined text-red-500 mt-0.5">error</span>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {renderStep()}

                        {/* Navigation Buttons */}
                        <div className="mt-8 flex gap-4 justify-between border-t border-slate-200 pt-6">
                            <button
                                type="button"
                                onClick={() => setStep(Math.max(2, step - 1) as Step)}
                                disabled={step === 2}
                                className="px-8 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-pink-500 hover:text-pink-600 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-xl">arrow_back</span>
                                Previous
                            </button>

                            {step === 6 ? (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">check_circle</span>
                                            Submit Registration
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setStep(Math.min(6, step + 1) as Step)}
                                    className="px-8 py-3 bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                                >
                                    Next
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal - Pink Theme */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60">
                    <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { transform: scale(0); }
              to { transform: scale(1); }
            }
            @keyframes checkmark {
              0% { stroke-dashoffset: 100; }
              100% { stroke-dashoffset: 0; }
            }
          `}</style>
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div
                                    className="w-20 h-20 bg-linear-to-br from-pink-400 to-rose-600 rounded-full flex items-center justify-center"
                                    style={{ animation: 'scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}
                                >
                                    <span className="material-symbols-outlined text-white text-4xl">check_circle</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
                            Application Submitted!
                        </h3>

                        <p className="text-gray-600 text-center mb-6 leading-relaxed">
                            Your influencer application has been received. Our team will review your profile and contact you soon.
                        </p>

                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                onClose();
                                onSuccess?.();
                            }}
                            className="w-full bg-linear-to-r from-pink-500 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
