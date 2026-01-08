# Business Registration Testing Guide

## Quick Test Checklist

### ✅ Prerequisites
- [ ] Backend server running on port 4000
- [ ] Frontend server running on port 3000
- [ ] MongoDB connected
- [ ] Firebase Admin SDK configured

### 🧪 Test Steps

#### 1. UI Elements
- [ ] Navigate to homepage
- [ ] "Become a Seller" button visible in header (when not logged in)
- [ ] Click opens auth modal if not logged in
- [ ] After login, "Become a Seller" button shows for non-business users
- [ ] Click opens registration form modal

#### 2. Registration Form - Step 1: Account Type
- [ ] Form opens with step 1
- [ ] Progress bar shows "Step 1 of 8"
- [ ] Two radio options visible: "New Business Account" and "Convert Existing Account"
- [ ] Default selection: "New Business Account"
- [ ] "Next" button enabled
- [ ] Click "Next" advances to step 2

#### 3. Registration Form - Step 2: Business Identity
- [ ] All fields visible:
  - Legal Business Name *
  - Trade Name / Store Name *
  - Business Type * (dropdown)
  - Nature of Business * (dropdown)
  - Year of Establishment * (number input)
- [ ] Dropdowns have correct options
- [ ] Required field validation works
- [ ] "Previous" and "Next" buttons functional

#### 4. Registration Form - Step 3: Owner Details
- [ ] Fields auto-filled from Firebase user:
  - Full Name (from displayName)
  - Email (from email)
  - Mobile (from phoneNumber)
- [ ] Additional fields:
  - Designation *
  - Government ID Type * (dropdown)
  - Government ID Number *
- [ ] All validations work
- [ ] Navigation buttons work

#### 5. Registration Form - Step 4: Address Details
- [ ] Registered Address section visible
- [ ] All address fields present:
  - Address Line 1 *
  - Address Line 2
  - City *
  - State *
  - Country *
  - Pincode *
- [ ] Checkbox: "Operational address is same as registered"
- [ ] Checkbox checked by default
- [ ] Navigation works

#### 6. Registration Form - Step 5: Tax & Legal
- [ ] Fields visible:
  - GSTIN Number *
  - GST Registration Type * (dropdown: Regular/Composition)
  - PAN Card Number *
  - CIN / LLPIN (optional)
  - MSME / UDYAM Number (optional)
- [ ] All validations work
- [ ] Navigation works

#### 7. Registration Form - Step 6: Bank Details
- [ ] Fields visible:
  - Account Holder Name *
  - Bank Name *
  - Account Number *
  - IFSC Code *
  - Account Type * (dropdown: Savings/Current)
  - Settlement Cycle * (dropdown: Daily/Weekly/Bi-Weekly)
- [ ] All validations work
- [ ] Navigation works

#### 8. Registration Form - Step 7: Store Profile
- [ ] Fields visible:
  - Store Description * (textarea)
  - Brand Ownership * (dropdown)
  - Website URL (optional)
- [ ] All validations work
- [ ] Navigation works

#### 9. Registration Form - Step 8: Logistics & Compliance
- [ ] Packaging Type dropdown visible *
- [ ] Compliance section with 4 checkboxes:
  - [ ] Seller Agreement *
  - [ ] Platform Policies *
  - [ ] Tax & Legal Responsibility *
  - [ ] Return Policy *
- [ ] Optional Advanced Features:
  - [ ] Request API Access
  - [ ] Request Dedicated Account Manager
- [ ] All checkboxes required
- [ ] "Previous" and "Submit Registration" buttons visible
- [ ] Submit button says "Submitting..." when loading

#### 10. Form Submission
- [ ] Click "Submit Registration"
- [ ] Loading state shows
- [ ] Network request sent to `/api/business/register`
- [ ] Authorization header includes Firebase ID token
- [ ] Payload matches expected JSON structure
- [ ] Response status 201 on success

#### 11. Backend Processing
- [ ] Console logs show request received
- [ ] Firebase token verified
- [ ] User found/created in MongoDB
- [ ] Business document created
- [ ] User role updated to BUSINESS_OWNER
- [ ] Firebase custom claims set:
  ```json
  {
    "accountType": "business",
    "role": "BUSINESS_OWNER",
    "businessId": "<business-id>"
  }
  ```
- [ ] Response sent back

#### 12. Post-Registration
- [ ] Success alert shown
- [ ] Modal closes
- [ ] Page refreshes
- [ ] User profile dropdown shows "Business Dashboard" option
- [ ] "Become a Seller" button no longer visible

#### 13. Database Verification
- [ ] Check MongoDB `users` collection:
  ```javascript
  db.users.findOne({ firebaseUid: "<firebase-uid>" })
  // Should have:
  // - role: "BUSINESS_OWNER"
  // - businessId: ObjectId(...)
  ```
- [ ] Check MongoDB `businesses` collection:
  ```javascript
  db.businesses.findOne({ ownerId: ObjectId(...) })
  // Should have all submitted data
  // - status: "pending_verification"
  // - verification.isVerified: false
  ```

### 🐛 Common Issues & Solutions

#### Issue: 401 Unauthorized
- **Cause**: Firebase token not sent or expired
- **Solution**: 
  - Check browser console for token
  - Logout and login again to refresh token
  - Verify `NEXT_PUBLIC_API_BASE` env variable

#### Issue: Form doesn't submit
- **Cause**: Validation failure
- **Solution**:
  - Check all required fields filled
  - Ensure all 4 compliance checkboxes checked
  - Check browser console for errors

#### Issue: User role not updating
- **Cause**: Firebase custom claims not set
- **Solution**:
  - Check backend logs for Firebase Admin SDK errors
  - Verify `firebase-adminsdk.json` file present
  - Check Firebase service account permissions

#### Issue: Business Dashboard not showing
- **Cause**: Custom claims not read by frontend
- **Solution**:
  - Refresh page after registration
  - Force token refresh in AuthContext
  - Check token payload in browser devtools

### 📊 Test Data Template

```javascript
// Use this sample data for quick testing
{
  accountType: "new",
  legalBusinessName: "Test Enterprises Pvt Ltd",
  tradeName: "Test Store",
  businessType: "Private Limited",
  natureOfBusiness: "Retailer",
  yearOfEstablishment: "2020",
  
  ownerFullName: "Test Owner",
  ownerDesignation: "Director",
  ownerMobile: "+919876543210",
  ownerEmail: "test@example.com",
  govIdType: "PAN",
  govIdNumber: "ABCDE1234F",
  
  regAddressLine1: "123 Test Street",
  regCity: "Mumbai",
  regState: "Maharashtra",
  regCountry: "India",
  regPincode: "400001",
  
  gstinNumber: "27AAAAA0000A1Z5",
  gstRegistrationType: "Regular",
  panNumber: "ABCDE1234F",
  
  bankAccountHolder: "Test Enterprises Pvt Ltd",
  bankName: "HDFC Bank",
  bankAccountNumber: "12345678901234",
  bankIfscCode: "HDFC0000001",
  bankAccountType: "Current",
  settlementCycle: "Weekly",
  
  storeDescription: "We sell quality products",
  brandOwnership: "Reseller",
  
  packagingType: "Seller Packed"
}
```

### 🔍 Debug Commands

```bash
# Check backend logs
cd apps/backend && npm run dev

# Check MongoDB data
mongosh
use ecommerce_db
db.businesses.find().pretty()
db.users.find({ role: "BUSINESS_OWNER" }).pretty()

# Check Firebase custom claims
firebase auth:export users.json --format=JSON
cat users.json | jq '.users[] | select(.email == "test@example.com") | .customClaims'

# Test API directly
curl -X POST http://localhost:4000/api/business/register \
  -H "Authorization: Bearer $(firebase login --token)" \
  -H "Content-Type: application/json" \
  -d @test-payload.json
```

---

**Ready to Test**: ✅  
**All Systems**: Go ✅  
**Expected Result**: Successful business registration with role upgrade and custom claims set
