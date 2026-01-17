'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

type AccountType = 'new' | 'convert';

interface BusinessFormData {
  accountType: AccountType;
  
  // Business Identity
  legalBusinessName: string;
  tradeName: string;
  businessType: string;
  natureOfBusiness: string;
  yearOfEstablishment: string;
  
  // Owner Details
  ownerFullName: string;
  ownerDesignation: string;
  ownerMobile: string;
  ownerEmail: string;
  ownerDOB: string;
  ownerGender: string;
  govIdType: string;
  govIdNumber: string;
  
  // Registered Address
  regAddressLine1: string;
  regAddressLine2: string;
  regCity: string;
  regDistrict: string;
  regState: string;
  regCountry: string;
  regPincode: string;
  
  // Operational Address
  opSameAsReg: boolean;
  opAddressLine1: string;
  opAddressLine2: string;
  opCity: string;
  opDistrict: string;
  opState: string;
  opCountry: string;
  opPincode: string;
  
  // Tax & Legal
  gstinNumber: string;
  gstRegistrationType: string;
  panNumber: string;
  cinLlpin: string;
  msmeUdyamNumber: string;
  
  // Bank Details
  bankAccountHolder: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankAccountType: string;
  settlementCycle: string;
  
  // Store Profile
  storeDescription: string;
  brandOwnership: string;
  websiteUrl: string;
  categories: string[];
  
  // Logistics
  pickupAddress: string;
  pickupTimeSlot: string;
  packagingType: string;
  courierPreference: string;
  returnAddress: string;
  returnPolicyAccepted: boolean;
  
  // Compliance
  sellerAgreementAccepted: boolean;
  platformPoliciesAccepted: boolean;
  taxResponsibilityAccepted: boolean;
  
  // Optional Advanced
  multipleWarehouses: boolean;
  apiAccessRequested: boolean;
  erpIntegration: string;
  dedicatedAccountManager: boolean;
}

export default function BusinessRegisterForm({ onClose }: { onClose: () => void }) {
  const { firebaseUser, idToken, refreshToken } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BusinessFormData>({
    accountType: 'new',
    legalBusinessName: '',
    tradeName: '',
    businessType: 'Proprietorship',
    natureOfBusiness: 'Retailer',
    yearOfEstablishment: '',
    ownerFullName: firebaseUser?.displayName || '',
    ownerDesignation: 'Owner',
    ownerMobile: firebaseUser?.phoneNumber || '',
    ownerEmail: firebaseUser?.email || '',
    ownerDOB: '',
    ownerGender: '',
    govIdType: 'PAN',
    govIdNumber: '',
    regAddressLine1: '',
    regAddressLine2: '',
    regCity: '',
    regDistrict: '',
    regState: '',
    regCountry: 'India',
    regPincode: '',
    opSameAsReg: true,
    opAddressLine1: '',
    opAddressLine2: '',
    opCity: '',
    opDistrict: '',
    opState: '',
    opCountry: '',
    opPincode: '',
    gstinNumber: '',
    gstRegistrationType: 'Regular',
    panNumber: '',
    cinLlpin: '',
    msmeUdyamNumber: '',
    bankAccountHolder: '',
    bankName: '',
    bankAccountNumber: '',
    bankIfscCode: '',
    bankAccountType: 'Current',
    settlementCycle: 'Weekly',
    storeDescription: '',
    brandOwnership: 'Reseller',
    websiteUrl: '',
    categories: [],
    pickupAddress: '',
    pickupTimeSlot: '10 AM - 6 PM',
    packagingType: 'Seller Packed',
    courierPreference: '',
    returnAddress: '',
    returnPolicyAccepted: false,
    sellerAgreementAccepted: false,
    platformPoliciesAccepted: false,
    taxResponsibilityAccepted: false,
    multipleWarehouses: false,
    apiAccessRequested: false,
    erpIntegration: '',
    dedicatedAccountManager: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!firebaseUser) {
      setError('Please login first');
      return;
    }

    // Minimal required field validation to avoid backend 400/500
    const requiredFields: Array<[string, string]> = [
      [formData.legalBusinessName, 'Legal business name is required'],
      [formData.tradeName, 'Trade name is required'],
      [formData.yearOfEstablishment, 'Year of establishment is required'],
      [formData.govIdType, 'Government ID type is required'],
      [formData.govIdNumber, 'Government ID number is required'],
      [formData.regAddressLine1, 'Registered address line 1 is required'],
      [formData.regCity, 'Registered city is required'],
      [formData.regState, 'Registered state is required'],
      [formData.regPincode, 'Registered pincode is required'],
      [formData.gstinNumber, 'GSTIN is required'],
      [formData.panNumber, 'PAN number is required'],
      [formData.bankAccountHolder, 'Bank account holder is required'],
      [formData.bankName, 'Bank name is required'],
      [formData.bankAccountNumber, 'Bank account number is required'],
      [formData.bankIfscCode, 'Bank IFSC is required'],
    ];

    const missing = requiredFields.find(([value]) => !value || !String(value).trim());
    if (missing) {
      setError(missing[1]);
      return;
    }

    const parsedYear = Number(formData.yearOfEstablishment);
    if (!Number.isFinite(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear()) {
      setError('Enter a valid year of establishment');
      return;
    }

    // Validate compliance checkboxes
    if (!formData.sellerAgreementAccepted || !formData.platformPoliciesAccepted || !formData.taxResponsibilityAccepted) {
      setError('Please accept all compliance agreements');
      return;
    }

    if (!formData.returnPolicyAccepted) {
      setError('Please accept the return policy');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Always get a fresh token to avoid expiration issues
      console.log('Getting fresh token...');
      const token = await firebaseUser.getIdToken(true);
      console.log('Token obtained:', token ? 'Yes' : 'No');
      
      if (!token) {
        throw new Error('Unable to get authentication token');
      }

      const resolvedReturnAddress = formData.returnAddress || formData.regAddressLine1;
      const resolvedPickupAddress = formData.pickupAddress || formData.regAddressLine1;

      const payload = {
        accountType: formData.accountType,
        businessIdentity: {
          legalBusinessName: formData.legalBusinessName,
          tradeName: formData.tradeName,
          businessType: formData.businessType,
          natureOfBusiness: formData.natureOfBusiness,
          yearOfEstablishment: parsedYear
        },
        ownerDetails: {
          fullName: formData.ownerFullName,
          designation: formData.ownerDesignation,
          mobileNumber: formData.ownerMobile,
          email: formData.ownerEmail,
          dateOfBirth: formData.ownerDOB || undefined,
          gender: formData.ownerGender || undefined,
          governmentIdType: formData.govIdType,
          governmentIdNumber: formData.govIdNumber
        },
        addresses: {
          registered: {
            addressLine1: formData.regAddressLine1,
            addressLine2: formData.regAddressLine2,
            city: formData.regCity,
            district: formData.regDistrict,
            state: formData.regState,
            country: formData.regCountry,
            pincode: formData.regPincode
          },
          operational: {
            sameAsRegistered: formData.opSameAsReg,
            addressLine1: formData.opSameAsReg ? formData.regAddressLine1 : formData.opAddressLine1,
            addressLine2: formData.opSameAsReg ? formData.regAddressLine2 : formData.opAddressLine2,
            city: formData.opSameAsReg ? formData.regCity : formData.opCity,
            district: formData.opSameAsReg ? formData.regDistrict : formData.opDistrict,
            state: formData.opSameAsReg ? formData.regState : formData.opState,
            country: formData.opSameAsReg ? formData.regCountry : formData.opCountry,
            pincode: formData.opSameAsReg ? formData.regPincode : formData.opPincode
          }
        },
        taxLegal: {
          gstinNumber: formData.gstinNumber,
          gstRegistrationType: formData.gstRegistrationType,
          panNumber: formData.panNumber,
          cinLlpin: formData.cinLlpin || undefined,
          msmeUdyamNumber: formData.msmeUdyamNumber || undefined
        },
        bankDetails: {
          accountHolderName: formData.bankAccountHolder,
          bankName: formData.bankName,
          accountNumber: formData.bankAccountNumber,
          ifscCode: formData.bankIfscCode,
          accountType: formData.bankAccountType,
          settlementCycle: formData.settlementCycle
        },
        storeProfile: {
          description: formData.storeDescription,
          categories: formData.categories,
          brandOwnership: formData.brandOwnership,
          websiteUrl: formData.websiteUrl || undefined
        },
        logistics: {
          pickupAddress: resolvedPickupAddress,
          pickupTimeSlot: formData.pickupTimeSlot,
          packagingType: formData.packagingType,
          courierPreference: formData.courierPreference || undefined,
          returnAddress: resolvedReturnAddress,
          returnPolicyAccepted: formData.returnPolicyAccepted
        },
        compliance: {
          sellerAgreementAccepted: formData.sellerAgreementAccepted,
          platformPoliciesAccepted: formData.platformPoliciesAccepted,
          taxResponsibilityAccepted: formData.taxResponsibilityAccepted
        },
        advanced: {
          multipleWarehouses: formData.multipleWarehouses,
          apiAccessRequested: formData.apiAccessRequested,
          erpIntegration: formData.erpIntegration || undefined,
          dedicatedAccountManager: formData.dedicatedAccountManager
        }
      };

      console.log('Sending registration request...');
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000/api';
      const response = await fetch(`${backendUrl}/business/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Registration error response:', error);
        throw new Error(error.error || error.details || 'Registration failed');
      }

      const result = await response.json();
      console.log('✅ Business registered:', result);
      
      alert('Business registered successfully! Please wait for verification.');
      onClose();
      window.location.reload(); // Refresh to update user role
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 8));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderAccountType();
      case 2:
        return renderBusinessIdentity();
      case 3:
        return renderOwnerDetails();
      case 4:
        return renderAddressDetails();
      case 5:
        return renderTaxLegal();
      case 6:
        return renderBankDetails();
      case 7:
        return renderStoreProfile();
      case 8:
        return renderLogisticsCompliance();
      default:
        return null;
    }
  };

  const renderAccountType = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Account Type</h3>
      <div className="space-y-3">
        <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
          formData.accountType === 'new' 
            ? 'border-blue-600 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
        }`}>
          <input
            type="radio"
            name="accountType"
            value="new"
            checked={formData.accountType === 'new'}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600"
          />
          <div>
            <div className="font-semibold text-gray-900">New Business Account</div>
            <div className="text-sm text-gray-700">Create a fresh business account</div>
          </div>
        </label>
        <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
          formData.accountType === 'convert' 
            ? 'border-blue-600 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
        }`}>
          <input
            type="radio"
            name="accountType"
            value="convert"
            checked={formData.accountType === 'convert'}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600"
          />
          <div>
            <div className="font-semibold text-gray-900">Convert Existing Account</div>
            <div className="text-sm text-gray-700">Upgrade your customer account to business</div>
          </div>
        </label>
      </div>
    </div>
  );

  const renderBusinessIdentity = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Business Identity</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Legal Business Name *</label>
        <input
          type="text"
          name="legalBusinessName"
          value={formData.legalBusinessName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Trade Name / Store Name *</label>
        <input
          type="text"
          name="tradeName"
          value={formData.tradeName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
        <select
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Proprietorship">Proprietorship</option>
          <option value="Partnership">Partnership</option>
          <option value="LLP">LLP</option>
          <option value="Private Limited">Private Limited</option>
          <option value="Public Limited">Public Limited</option>
          <option value="Trust / NGO">Trust / NGO</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nature of Business *</label>
        <select
          name="natureOfBusiness"
          value={formData.natureOfBusiness}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Manufacturer">Manufacturer</option>
          <option value="Wholesaler">Wholesaler</option>
          <option value="Distributor">Distributor</option>
          <option value="Retailer">Retailer</option>
          <option value="Service Provider">Service Provider</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Establishment *</label>
        <input
          type="number"
          name="yearOfEstablishment"
          value={formData.yearOfEstablishment}
          onChange={handleChange}
          required
          min="1900"
          max={new Date().getFullYear()}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>
    </div>
  );

  const renderOwnerDetails = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Owner / Authorized Person Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
        <input
          type="text"
          name="ownerFullName"
          value={formData.ownerFullName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
        <input
          type="text"
          name="ownerDesignation"
          value={formData.ownerDesignation}
          onChange={handleChange}
          required
          placeholder="Owner / Director / Partner"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
        <input
          type="tel"
          name="ownerMobile"
          value={formData.ownerMobile}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
        <input
          type="email"
          name="ownerEmail"
          value={formData.ownerEmail}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Government ID Type *</label>
        <select
          name="govIdType"
          value={formData.govIdType}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Aadhaar">Aadhaar</option>
          <option value="PAN">PAN</option>
          <option value="Passport">Passport</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Government ID Number *</label>
        <input
          type="text"
          name="govIdNumber"
          value={formData.govIdNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>
    </div>
  );

  const renderAddressDetails = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Business Address Details</h3>
      
      <div className="font-semibold text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">Registered Address</div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1 *</label>
        <input
          type="text"
          name="regAddressLine1"
          value={formData.regAddressLine1}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
        <input
          type="text"
          name="regAddressLine2"
          value={formData.regAddressLine2}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            name="regCity"
            value={formData.regCity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <input
            type="text"
            name="regState"
            value={formData.regState}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <input
            type="text"
            name="regCountry"
            value={formData.regCountry}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
          <input
            type="text"
            name="regPincode"
            value={formData.regPincode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="opSameAsReg"
          checked={formData.opSameAsReg}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <span className="text-sm text-gray-700">Operational address is same as registered</span>
      </label>
    </div>
  );

  const renderTaxLegal = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Tax & Legal Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN Number *</label>
        <input
          type="text"
          name="gstinNumber"
          value={formData.gstinNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">GST Registration Type *</label>
        <select
          name="gstRegistrationType"
          value={formData.gstRegistrationType}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Regular">Regular</option>
          <option value="Composition">Composition</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card Number *</label>
        <input
          type="text"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">CIN / LLPIN (if applicable)</label>
        <input
          type="text"
          name="cinLlpin"
          value={formData.cinLlpin}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MSME / UDYAM Number (optional)</label>
        <input
          type="text"
          name="msmeUdyamNumber"
          value={formData.msmeUdyamNumber}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>
    </div>
  );

  const renderBankDetails = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Bank & Payment Details</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
        <input
          type="text"
          name="bankAccountHolder"
          value={formData.bankAccountHolder}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
        <input
          type="text"
          name="bankAccountNumber"
          value={formData.bankAccountNumber}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
        <input
          type="text"
          name="bankIfscCode"
          value={formData.bankIfscCode}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
        <select
          name="bankAccountType"
          value={formData.bankAccountType}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Savings">Savings</option>
          <option value="Current">Current</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Settlement Cycle *</label>
        <select
          name="settlementCycle"
          value={formData.settlementCycle}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Bi-Weekly">Bi-Weekly</option>
        </select>
      </div>
    </div>
  );

  const renderStoreProfile = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Store / Seller Profile</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Store Description *</label>
        <textarea
          name="storeDescription"
          value={formData.storeDescription}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Ownership *</label>
        <select
          name="brandOwnership"
          value={formData.brandOwnership}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Own Brand">Own Brand</option>
          <option value="Authorized Seller">Authorized Seller</option>
          <option value="Reseller">Reseller</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (optional)</label>
        <input
          type="url"
          name="websiteUrl"
          value={formData.websiteUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>
    </div>
  );

  const renderLogisticsCompliance = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Logistics & Compliance</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Type *</label>
        <select
          name="packagingType"
          value={formData.packagingType}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
        >
          <option value="Seller Packed">Seller Packed</option>
          <option value="Platform Packed">Platform Packed</option>
        </select>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="font-semibold text-sm text-gray-900">Compliance & Agreements *</div>
        
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="sellerAgreementAccepted"
            checked={formData.sellerAgreementAccepted}
            onChange={handleChange}
            required
            className="w-4 h-4 text-blue-600 rounded mt-0.5"
          />
          <span className="text-sm text-gray-700">I accept the Seller Agreement</span>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="platformPoliciesAccepted"
            checked={formData.platformPoliciesAccepted}
            onChange={handleChange}
            required
            className="w-4 h-4 text-blue-600 rounded mt-0.5"
          />
          <span className="text-sm text-gray-700">I accept the Platform Policies</span>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="taxResponsibilityAccepted"
            checked={formData.taxResponsibilityAccepted}
            onChange={handleChange}
            required
            className="w-4 h-4 text-blue-600 rounded mt-0.5"
          />
          <span className="text-sm text-gray-700">I accept Tax & Legal Responsibility</span>
        </label>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="returnPolicyAccepted"
            checked={formData.returnPolicyAccepted}
            onChange={handleChange}
            required
            className="w-4 h-4 text-blue-600 rounded mt-0.5"
          />
          <span className="text-sm text-gray-700">I accept the Return Policy</span>
        </label>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="font-semibold text-sm text-gray-900">Optional Advanced Features</div>
        
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="apiAccessRequested"
            checked={formData.apiAccessRequested}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Request API Access</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="dedicatedAccountManager"
            checked={formData.dedicatedAccountManager}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Request Dedicated Account Manager</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Business Registration</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none w-8 h-8 flex items-center justify-center">×</button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">Step {step} of 8</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(step / 8) * 100}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {renderStep()}

          <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium transition-colors"
            >
              Previous
            </button>
            
            {step < 8 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
