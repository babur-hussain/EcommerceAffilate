'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

type AccountType = 'new' | 'convert';
type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface BusinessFormData {
  // Step 1: Account Type
  accountType: AccountType;
  existingEmail?: string;
  existingOtp?: string;
  
  // Step 2: Business Info
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
  accountType: string;
  chequeFile?: File;
  settlementCycle: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BusinessRegistrationModal({ open, onClose }: Props) {
  const { firebaseUser, idToken } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<BusinessFormData>({
    accountType: 'new',
    existingEmail: '',
    existingOtp: '',
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
    gstin: '',
    gstType: 'Regular',
    panNumber: '',
    cin: '',
    udyamNumber: '',
    bankAccountName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Savings',
    settlementCycle: 'Weekly',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

      // Prepare JSON data (no file uploads in simplified process)
      const submitData = {
        accountType: formData.accountType, // Store in Firebase custom claims
        legalBusinessName: formData.legalBusinessName,
        tradeName: formData.tradeName,
        businessType: formData.businessType,
        panNumber: formData.panNumber,
        gstin: formData.gstin,
        businessDescription: formData.businessDescription,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        businessAddress: formData.businessAddress,
        accountHolderName: formData.accountHolderName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        bankName: formData.bankName,
      };

      // Call backend API with Firebase auth token
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
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
      console.log('✅ Business account created:', result);
      
      // Close modal and refresh page to update user role
      onClose();
      window.location.reload();
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Account Type & Conversion</h3>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50" >
                <input
                  type="radio"
                  name="accountType"
                  value="new"
                  checked={formData.accountType === 'new'}
                  onChange={handleInputChange}
                />
                <span className="font-medium text-gray-800">New Business Account</span>
              </label>
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-blue-50">
                <input
                  type="radio"
                  name="accountType"
                  value="convert"
                  checked={formData.accountType === 'convert'}
                  onChange={handleInputChange}
                />
                <span className="font-medium text-gray-800">Convert Existing Customer Account to Business</span>
              </label>
            </div>

            {formData.accountType === 'convert' && (
              <div className="space-y-3 mt-4 p-4 bg-slate-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-800">Existing Account Email</label>
                <input
                  type="email"
                  name="existingEmail"
                  value={formData.existingEmail || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="your@email.com"
                />
                <button type="button" className="text-sm text-blue-600 hover:underline">Send OTP</button>
                <input
                  type="text"
                  name="existingOtp"
                  value={formData.existingOtp || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter OTP"
                  maxLength={6}
                />
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Business Information</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Legal Business Name</label>
              <input
                type="text"
                name="legalBusinessName"
                value={formData.legalBusinessName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Trade Name / Store Name</label>
              <input
                type="text"
                name="tradeName"
                value={formData.tradeName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Business Type</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
              <label className="block text-sm font-medium mb-1 text-gray-800">Nature of Business</label>
              <select
                name="natureOfBusiness"
                value={formData.natureOfBusiness}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
              <label className="block text-sm font-medium mb-1 text-gray-800">Full Name</label>
              <input
                type="text"
                name="ownerFullName"
                value={formData.ownerFullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
              >
                <option value="Owner">Owner</option>
                <option value="Director">Director</option>
                <option value="Partner">Partner</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Mobile Number</label>
                <input
                  type="tel"
                  name="ownerMobile"
                  value={formData.ownerMobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Email Address</label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                >
                  <option>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Government ID Type</label>
              <select
                name="govIdType"
                value={formData.govIdType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              >
                <option>Select ID Type</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="PAN">PAN</option>
                <option value="Passport">Passport</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Government ID Number</label>
              <input
                type="text"
                name="govIdNumber"
                value={formData.govIdNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">ID Proof Upload (PDF/JPG)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, 'idProofFile')}
                className="w-full px-3 py-2 border rounded-lg"
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
                <label className="block text-sm font-medium mb-1 text-gray-800">Address Line 1</label>
                <input
                  type="text"
                  name="registeredAddress"
                  value={formData.registeredAddress}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">Pincode / ZIP</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">GSTIN Number</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                placeholder="15 digit GSTIN"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">GST Registration Type</label>
              <select
                name="gstType"
                value={formData.gstType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">PAN Card Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">CIN / LLPIN (if applicable)</label>
              <input
                type="text"
                name="cin"
                value={formData.cin || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">UDYAM Number (optional)</label>
              <input
                type="text"
                name="udyamNumber"
                value={formData.udyamNumber || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Bank & Payment Settlement Details</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Bank Account Holder Name</label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">IFSC Code</label>
              <input
                type="text"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Account Type</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">Preferred Settlement Cycle</label>
              <select
                name="settlementCycle"
                value={formData.settlementCycle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 placeholder:text-slate-400"
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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition z-10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="sticky top-0 bg-slate-700 text-white p-6 border-b">
          <h2 className="text-2xl font-bold mb-2">Business Registration</h2>
          <p className="text-sm text-slate-100">Step {step} of 6</p>
          <div className="mt-3 w-full bg-slate-600 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: `${(step / 6) * 100}%` }} />
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 text-red-700 border border-red-200 rounded p-3 text-sm">
              {error}
            </div>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4 justify-between">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1) as Step)}
              disabled={step === 1}
              className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>

            {step === 6 ? (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep(Math.min(6, step + 1) as Step)}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
