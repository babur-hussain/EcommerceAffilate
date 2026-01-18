import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
  userId: mongoose.Types.ObjectId;
  firebaseUid: string;
  accountType: 'new' | 'convert'; // Stored in Firebase custom claims too

  // Business Identity
  businessIdentity: {
    legalBusinessName: string;
    tradeName: string;
    businessType: 'Proprietorship' | 'Partnership' | 'LLP' | 'Private Limited' | 'Public Limited' | 'Trust / NGO';
    natureOfBusiness: 'Manufacturer' | 'Wholesaler' | 'Distributor' | 'Retailer' | 'Service Provider';
    yearOfEstablishment: number;
  };

  // Owner/Authorized Person
  ownerDetails: {
    fullName: string;
    designation: string;
    mobileNumber: string;
    email: string;
    dateOfBirth?: Date;
    gender?: string;
    governmentIdType: 'Aadhaar' | 'PAN' | 'Passport';
    governmentIdNumber: string;
    idProofUrl?: string;
  };

  // Business Addresses
  addresses: {
    registered: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      district?: string;
      state: string;
      country: string;
      pincode: string;
    };
    operational: {
      sameAsRegistered: boolean;
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      district?: string;
      state?: string;
      country?: string;
      pincode?: string;
    };
    warehouse?: {
      addressLine1?: string;
      addressLine2?: string;
      city?: string;
      district?: string;
      state?: string;
      country?: string;
      pincode?: string;
    };
  };

  // Tax & Legal
  taxLegal: {
    gstinNumber: string;
    gstRegistrationType: 'Regular' | 'Composition';
    gstCertificateUrl?: string;
    panNumber: string;
    panCardUrl?: string;
    cinLlpin?: string;
    shopEstablishmentUrl?: string;
    msmeUdyamNumber?: string;
  };

  // Bank & Payment
  bankDetails: {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountType: 'Savings' | 'Current';
    cancelledChequeUrl?: string;
    settlementCycle: 'Daily' | 'Weekly' | 'Bi-Weekly';
  };

  // KYC Verification
  verification: {
    businessAddressProofUrl?: string;
    selfieUrl?: string;
    signatureUrl?: string;
    authorizationLetterUrl?: string;
    isVerified: boolean;
    verifiedAt?: Date;
  };

  // Store Profile
  storeProfile: {
    logoUrl?: string;
    description?: string;
    categories: string[];
    brandOwnership: 'Own Brand' | 'Authorized Seller' | 'Reseller';
    brandAuthorizationUrl?: string;
    websiteUrl?: string;
    socialMediaLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };

  // Logistics
  logistics: {
    pickupAddress: string;
    pickupTimeSlot?: string;
    packagingType: 'Seller Packed' | 'Platform Packed';
    courierPreference?: string;
    returnAddress: string;
    returnPolicyAccepted: boolean;
  };

  // Compliance
  compliance: {
    sellerAgreementAccepted: boolean;
    platformPoliciesAccepted: boolean;
    taxResponsibilityAccepted: boolean;
    acceptedAt: Date;
  };

  // Optional Advanced
  advanced?: {
    multipleWarehouses?: boolean;
    apiAccessRequested?: boolean;
    erpIntegration?: string;
    dedicatedAccountManager?: boolean;
  };

  isActive: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  trustBadges?: string[];
  assignedAttributes?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const businessSchema = new Schema<IBusiness>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    firebaseUid: { type: String, required: true, unique: true },
    accountType: { type: String, enum: ['new', 'convert'], required: true },

    businessIdentity: {
      legalBusinessName: { type: String, required: true },
      tradeName: { type: String, required: true },
      businessType: {
        type: String,
        enum: ['Proprietorship', 'Partnership', 'LLP', 'Private Limited', 'Public Limited', 'Trust / NGO'],
        required: true
      },
      natureOfBusiness: {
        type: String,
        enum: ['Manufacturer', 'Wholesaler', 'Distributor', 'Retailer', 'Service Provider'],
        required: true
      },
      yearOfEstablishment: { type: Number, required: true }
    },

    ownerDetails: {
      fullName: { type: String, required: true },
      designation: { type: String, required: true },
      mobileNumber: { type: String, required: true },
      email: { type: String, required: true },
      dateOfBirth: { type: Date },
      gender: { type: String },
      governmentIdType: {
        type: String,
        enum: ['Aadhaar', 'PAN', 'Passport'],
        required: true
      },
      governmentIdNumber: { type: String, required: true },
      idProofUrl: { type: String }
    },

    addresses: {
      registered: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        district: { type: String },
        state: { type: String, required: true },
        country: { type: String, required: true, default: 'India' },
        pincode: { type: String, required: true }
      },
      operational: {
        sameAsRegistered: { type: Boolean, default: false },
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        district: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String }
      },
      warehouse: {
        addressLine1: { type: String },
        addressLine2: { type: String },
        city: { type: String },
        district: { type: String },
        state: { type: String },
        country: { type: String },
        pincode: { type: String }
      }
    },

    taxLegal: {
      gstinNumber: { type: String, required: true },
      gstRegistrationType: {
        type: String,
        enum: ['Regular', 'Composition'],
        required: true
      },
      gstCertificateUrl: { type: String },
      panNumber: { type: String, required: true },
      panCardUrl: { type: String },
      cinLlpin: { type: String },
      shopEstablishmentUrl: { type: String },
      msmeUdyamNumber: { type: String }
    },

    bankDetails: {
      accountHolderName: { type: String, required: true },
      bankName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      accountType: {
        type: String,
        enum: ['Savings', 'Current'],
        required: true
      },
      cancelledChequeUrl: { type: String },
      settlementCycle: {
        type: String,
        enum: ['Daily', 'Weekly', 'Bi-Weekly'],
        required: true,
        default: 'Weekly'
      }
    },

    verification: {
      businessAddressProofUrl: { type: String },
      selfieUrl: { type: String },
      signatureUrl: { type: String },
      authorizationLetterUrl: { type: String },
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date }
    },

    storeProfile: {
      logoUrl: { type: String },
      description: { type: String },
      categories: [{ type: String }],
      brandOwnership: {
        type: String,
        enum: ['Own Brand', 'Authorized Seller', 'Reseller'],
        required: true
      },
      brandAuthorizationUrl: { type: String },
      websiteUrl: { type: String },
      socialMediaLinks: {
        facebook: { type: String },
        instagram: { type: String },
        twitter: { type: String },
        linkedin: { type: String }
      }
    },

    logistics: {
      pickupAddress: { type: String, required: true },
      pickupTimeSlot: { type: String },
      packagingType: {
        type: String,
        enum: ['Seller Packed', 'Platform Packed'],
        required: true,
        default: 'Seller Packed'
      },
      courierPreference: { type: String },
      returnAddress: { type: String, required: true },
      returnPolicyAccepted: { type: Boolean, required: true, default: false }
    },

    compliance: {
      sellerAgreementAccepted: { type: Boolean, required: true },
      platformPoliciesAccepted: { type: Boolean, required: true },
      taxResponsibilityAccepted: { type: Boolean, required: true },
      acceptedAt: { type: Date, required: true, default: Date.now }
    },

    advanced: {
      multipleWarehouses: { type: Boolean, default: false },
      apiAccessRequested: { type: Boolean, default: false },
      erpIntegration: { type: String },
      dedicatedAccountManager: { type: Boolean, default: false }
    },

    isActive: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING'
    },
    trustBadges: [{ type: String }],
    assignedAttributes: [{ type: Schema.Types.ObjectId, ref: 'Attribute' }]
  },
  { timestamps: true }
);

businessSchema.index({ userId: 1 });
businessSchema.index({ firebaseUid: 1 });
businessSchema.index({ isActive: 1 });
businessSchema.index({ 'businessIdentity.tradeName': 1 });
businessSchema.index({ 'taxLegal.gstinNumber': 1 });

export const Business = mongoose.model<IBusiness>('Business', businessSchema);
