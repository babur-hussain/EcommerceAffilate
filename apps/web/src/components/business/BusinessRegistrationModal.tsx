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
}

export default function BusinessRegistrationModal({ open, onClose }: Props) {
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

      console.log('📝 Starting business registration...');
      console.log('🔐 Firebase UID:', firebaseUser.uid);
      console.log('🔑 ID Token present:', !!idToken);
      console.log('🔑 Token length:', idToken?.length);

      // Prepare JSON data in the format backend expects
      const submitData = {
        accountType: 'new', // Always 'new' since we removed conversion option
        businessIdentity: {
          legalBusinessName: formData.legalBusinessName,
          tradeName: formData.tradeName,
          businessType: formData.businessType,
          natureOfBusiness: formData.natureOfBusiness,
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
          storeDescription: formData.natureOfBusiness,
          brandOwnership: 'Own Brand', // Default to own brand
        },
        compliance: {
          sellerAgreementAccepted: true,
          platformPoliciesAccepted: true,
          taxResponsibilityAccepted: true,
          acceptedAt: new Date().toISOString(),
        },
      };

      // Call backend API with Firebase auth token
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE || '/api';
      console.log('📤 Sending POST to:', `${backendUrl}/business/register`);
      console.log('📦 Authorization header:', `Bearer ${idToken?.substring(0, 50)}...`);

      const response = await fetch(`${backendUrl}/business/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Array.from(response.headers.entries()));

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Backend error:', error);
        throw new Error(error.message || error.error || 'Failed to create business account');
      }

      const result = await response.json();
      console.log('✅ Business registration submitted:', result);

      // Show success modal instead of alert
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
            <h3 className="font-semibold text-lg text-gray-900">Business Information</h3>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Legal Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="legalBusinessName"
                value={formData.legalBusinessName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Trade Name / Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              >
                <option>Select Business Type</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="PrivateLimited">Private Limited</option>
                <option value="PublicLimited">Public Limited</option>
                <option value="Trust">Trust / NGO</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Nature of Business <span className="text-red-500">*</span>
              </label>
              <select
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              >
                <option>Select Nature</option>
                <option value="Manufacturer">Manufacturer</option>
                <option value="Wholesaler">Wholesaler</option>
                <option value="Distributor">Distributor</option>
                <option value="Retailer">Retailer</option>
                <option value="ServiceProvider">Service Provider</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Year of Establishment</label>
              <input
                type="number"
                name="yearEstablished"
                value={formData.yearEstablished}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Owner / Authorized Person Details</h3>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ownerFullName"
                value={formData.ownerFullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
              >
                <option value="Owner">Owner</option>
                <option value="Director">Director</option>
                <option value="Partner">Partner</option>
                <option value="Manager">Manager</option>
              </select>
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
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
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
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                >
                  <option>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              >
                <option>Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
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
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">ID Proof Upload (PDF/JPG)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'idProofFile')}
                key={formData.idProofFile?.name || 'id-proof'}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 transition-all duration-200"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Business Address Details</h3>

            <div className="p-3 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-3 text-gray-800">Registered Address</h4>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                  required
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium mb-1 text-gray-800">Address Line 2</label>
                <input
                  type="text"
                  name="registeredAddressLine2"
                  value={formData.registeredAddressLine2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Pincode / ZIP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="checkbox"
                  name="sameAsRegistered"
                  checked={formData.sameAsRegistered}
                  onChange={handleInputChange}
                />
                <span>Operational address same as registered</span>
              </label>
            </div>

            {!formData.sameAsRegistered && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Operational Address</label>
                <textarea
                  name="operationalAddress"
                  value={formData.operationalAddress || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                  rows={3}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Tax & Legal Information</h3>

            {/* GST Registration Question */}
            <div className="p-4 bg-sky-50 border-2 border-sky-200 rounded-xl">
              <label className="block text-sm font-medium mb-3 text-gray-900">
                Do you have GST Registration? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasGST"
                    value="true"
                    checked={formData.hasGST === true}
                    onChange={(e) => setFormData({ ...formData, hasGST: true, gstin: '', gstType: 'Regular' })}
                    className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-gray-900 font-medium">Yes, I have GST</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasGST"
                    value="false"
                    checked={formData.hasGST === false}
                    onChange={(e) => setFormData({ ...formData, hasGST: false, gstin: '', gstType: 'Regular' })}
                    className="w-4 h-4 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-gray-900 font-medium">No, I don't have GST</span>
                </label>
              </div>
            </div>

            {/* GST Fields - Show only if hasGST is true */}
            {formData.hasGST && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">
                    GSTIN Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                    placeholder="15 digit GSTIN"
                    required={formData.hasGST}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">GST Registration Type</label>
                  <select
                    name="gstType"
                    value={formData.gstType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Composition">Composition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-800">GST Certificate Upload</label>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    onChange={(e) => handleFileChange(e, 'gstCertFile')}
                    key={formData.gstCertFile?.name || 'gst-cert'}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 transition-all duration-200"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                PAN Card Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                placeholder="10 digit PAN"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">PAN Card Upload</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'panFile')}
                key={formData.panFile?.name || 'pan-file'}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">CIN / LLPIN (if applicable)</label>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">UDYAM Number (optional)</label>
              <input
                type="text"
                name="udyamNumber"
                value={formData.udyamNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Bank & Payment Settlement Details</h3>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Bank Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
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
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
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
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
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
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Account Type</label>
              <select
                name="bankAccountType"
                value={formData.bankAccountType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
              >
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Cancelled Cheque / Bank Proof</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'chequeFile')}
                key={formData.chequeFile?.name || 'cheque-file'}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Preferred Settlement Cycle</label>
              <select
                name="settlementCycle"
                value={formData.settlementCycle}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/20 outline-none text-slate-900 placeholder:text-slate-400 transition-all duration-200"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
              </select>
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
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-all z-10"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-sky-500 to-blue-600 text-white px-8 py-6 border-b border-sky-400/30 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="material-symbols-outlined text-3xl">storefront</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Business Registration</h2>
              <p className="text-sky-100 text-sm">Step {step - 1} of 5</p>
            </div>
          </div>
          {/* Modern Progress Bar */}
          <div className="mt-4 w-full bg-white/20 rounded-full h-2 overflow-hidden">
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
                className="px-8 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
                Previous
              </button>

              {step === 6 ? (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 hover:shadow-xl hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  Next
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Beautiful Animated Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
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

          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" style={{ animation: 'slideUp 0.4s ease-out' }}>
            {/* Animated Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center"
                  style={{ animation: 'scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' }}
                >
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ strokeDasharray: 100, strokeDashoffset: 0, animation: 'checkmark 0.6s ease-in 0.3s backwards' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div
                  className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-20"
                  style={{ animation: 'scaleIn 1s infinite' }}
                ></div>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
              Registration Submitted Successfully!
            </h3>

            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Your business registration has been submitted and is now pending review by our admin team.
            </p>

            {/* Status Badge */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full" style={{ animation: 'scaleIn 1s infinite' }}></div>
                <span className="text-amber-800 font-semibold">Status: Pending Approval</span>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-sky-50 border-2 border-sky-200 rounded-xl p-4 mb-6">
              <p className="text-sky-800 text-sm text-center">
                📧 You will receive an email notification once your registration is approved.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
