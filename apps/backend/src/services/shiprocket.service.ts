import axios, { AxiosError } from 'axios';
import { env } from '../config/env';

/**
 * ShiprocketService - Complete API integration following official documentation
 * https://apidocs.shiprocket.in
 * 
 * Key Features:
 * - Token caching with expiry management (tokens valid for 10 days)
 * - Automatic token refresh
 * - Retry logic with exponential backoff for rate limits
 * - Comprehensive error handling
 * - All major Shiprocket operations
 */
export class ShiprocketService {
    private static token: string | null = null;
    private static tokenExpiry: Date | null = null;
    private static readonly BASE_URL = 'https://apiv2.shiprocket.in/v1/external';
    private static readonly TOKEN_VALIDITY_DAYS = 10;
    private static readonly MAX_RETRIES = 3;

    // ============================================
    // TOKEN MANAGEMENT
    // ============================================

    /**
     * Check if current token is still valid
     * Refreshes 1 hour before expiry for safety
     */
    private static isTokenValid(): boolean {
        if (!this.token || !this.tokenExpiry) return false;
        const buffer = 60 * 60 * 1000; // 1 hour buffer
        return Date.now() < (this.tokenExpiry.getTime() - buffer);
    }

    /**
     * Get headers with valid auth token
     * Automatically refreshes token if expired
     */
    private static async getHeaders(): Promise<Record<string, string>> {
        if (!this.isTokenValid()) {
            await this.login();
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
        };
    }

    /**
     * Authenticate with Shiprocket API
     * Stores token with expiry for subsequent requests
     */
    static async login(): Promise<string> {
        try {
            if (!env.shiprocket.email || !env.shiprocket.password) {
                throw new Error('Shiprocket credentials missing. Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD to .env');
            }

            console.log('[Shiprocket] Authenticating...');

            const res = await axios.post(`${this.BASE_URL}/auth/login`, {
                email: env.shiprocket.email,
                password: env.shiprocket.password,
            });

            this.token = res.data.token;
            // Set expiry to 10 days from now
            this.tokenExpiry = new Date(Date.now() + this.TOKEN_VALIDITY_DAYS * 24 * 60 * 60 * 1000);

            console.log('[Shiprocket] Authentication successful, token valid until:', this.tokenExpiry.toISOString());
            return this.token!;

        } catch (error: any) {
            const errorData = error.response?.data;
            console.error('[Shiprocket] Login Failed:', errorData || error.message);

            if (errorData?.message?.includes('blocked')) {
                throw new Error('Shiprocket account blocked due to too many failed login attempts. Please wait 30 minutes or reset your password.');
            }
            if (errorData?.status_code === 403) {
                throw new Error('Invalid Shiprocket credentials. Please create an API user in Shiprocket Settings → API → Add New API User');
            }

            throw new Error(`Shiprocket Login Failed: ${errorData?.message || error.message}`);
        }
    }

    /**
     * Invalidate current token (useful for manual refresh)
     */
    static invalidateToken(): void {
        this.token = null;
        this.tokenExpiry = null;
    }

    /**
     * Wrapper for API calls with automatic retry on 401
     */
    private static async withRetry<T>(
        operation: () => Promise<T>,
        retries = 1
    ): Promise<T> {
        try {
            return await operation();
        } catch (error: any) {
            if (error.response?.status === 401 && retries > 0) {
                console.log('[Shiprocket] Token expired, refreshing...');
                this.invalidateToken();
                return this.withRetry(operation, retries - 1);
            }

            if (error.response?.status === 429 && retries > 0) {
                // Rate limited - wait and retry
                const waitTime = Math.pow(2, this.MAX_RETRIES - retries) * 1000;
                console.log(`[Shiprocket] Rate limited, waiting ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.withRetry(operation, retries - 1);
            }

            throw error;
        }
    }

    // ============================================
    // PICKUP LOCATIONS
    // ============================================

    /**
     * Get all pickup locations configured in the Shiprocket account
     */
    static async getPickupLocations(): Promise<any[]> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();
            const res = await axios.get(`${this.BASE_URL}/settings/company/pickup`, { headers });

            console.log('[Shiprocket] Fetched pickup locations:', res.data.data?.shipping_address?.length || 0);
            return res.data.data?.shipping_address || [];
        });
    }

    /**
     * Add a new pickup location
     */
    static async addPickupLocation(location: {
        pickup_location: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        address_2?: string;
        city: string;
        state: string;
        country: string;
        pin_code: string;
    }): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();
            const res = await axios.post(`${this.BASE_URL}/settings/company/addpickup`, location, { headers });
            return res.data;
        });
    }

    // ============================================
    // SERVICEABILITY & COURIER SELECTION
    // ============================================

    /**
     * Check courier serviceability between two pincodes
     * Returns available courier partners and rates
     */
    static async checkServiceability(order: any): Promise<any> {
        return this.withRetry(async () => {
            // Calculate total weight from order items
            const totalWeight = order.items.reduce((sum: number, item: any) => {
                return sum + ((item.productId?.weight || 0.5) * item.quantity);
            }, 0);
            const weight = Math.max(totalWeight, 0.5);

            // Get pickup pincode from Business
            let pickupPincode = '110001'; // Default fallback
            try {
                const firstProduct = order.items[0]?.productId;
                if (firstProduct?.businessId) {
                    const { Business } = await import('../models/business.model');
                    const business = await Business.findById(firstProduct.businessId)
                        .select('addresses.operational.pincode addresses.registered.pincode');

                    if (business) {
                        pickupPincode = business.addresses?.operational?.pincode ||
                            business.addresses?.registered?.pincode ||
                            pickupPincode;
                    }
                }
            } catch (err) {
                console.warn('[Shiprocket] Failed to fetch business pincode, using default:', err);
            }

            const deliveryPincode = order.shippingAddress?.pincode;
            if (!deliveryPincode) {
                throw new Error('Delivery pincode is required for serviceability check');
            }

            console.log(`[Shiprocket] Checking serviceability: Pickup=${pickupPincode}, Delivery=${deliveryPincode}, Weight=${weight}kg`);

            const headers = await this.getHeaders();
            const res = await axios.get(`${this.BASE_URL}/courier/serviceability`, {
                params: {
                    pickup_postcode: pickupPincode,
                    delivery_postcode: deliveryPincode,
                    weight: weight,
                    cod: order.paymentProvider === 'COD' ? 1 : 0,
                },
                headers,
            });

            const couriers = res.data.data?.available_courier_companies || [];
            console.log(`[Shiprocket] Found ${couriers.length} available couriers`);

            return {
                status: 200,
                pickup_postcode: pickupPincode,
                delivery_postcode: deliveryPincode,
                weight: weight,
                data: res.data.data,
            };
        });
    }

    /**
     * Get available couriers for a specific shipment
     * Use this after order creation to select courier
     */
    static async getAvailableCouriers(shipmentId: number): Promise<any[]> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();
            const res = await axios.get(`${this.BASE_URL}/courier/courierListWithCounts`, {
                params: { shipment_id: shipmentId },
                headers,
            });

            return res.data.data?.available_courier_companies || [];
        });
    }

    // ============================================
    // ORDER MANAGEMENT
    // ============================================

    /**
     * Create order in Shiprocket (Ad-hoc method)
     * This creates both order and shipment in one call
     */
    static async createOrder(order: any, pickupLocationName: string = 'Primary'): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            // Calculate dimensions and weight
            let totalWeight = 0;
            let maxLength = 10;
            let maxBreadth = 10;
            let maxHeight = 10;

            const orderItems = order.items.map((item: any) => {
                const product = item.productId;
                const qty = item.quantity;

                const itemWeight = (product.weight || 0.5) * qty;
                totalWeight += itemWeight;

                if (product.dimensions) {
                    maxLength = Math.max(maxLength, product.dimensions.length || 10);
                    maxBreadth = Math.max(maxBreadth, product.dimensions.breadth || 10);
                    maxHeight = Math.max(maxHeight, product.dimensions.height || 10);
                }

                return {
                    name: product.title?.substring(0, 200) || 'Product', // Max 200 chars
                    sku: String(product._id),
                    units: qty,
                    selling_price: item.price,
                    discount: 0,
                    tax: 0,
                    hsn: product.hsn || '',
                };
            });

            // Prepare payload according to Shiprocket docs
            const payload = {
                order_id: String(order._id), // Your internal order ID
                order_date: new Date(order.createdAt).toISOString().split('T')[0], // YYYY-MM-DD format
                pickup_location: pickupLocationName, // Must match configured pickup location name
                channel_id: '', // Optional: Leave empty for default channel

                // Billing details (customer info)
                billing_customer_name: order.shippingAddress?.name?.split(' ')[0] || 'Customer',
                billing_last_name: order.shippingAddress?.name?.split(' ').slice(1).join(' ') || '',
                billing_address: order.shippingAddress?.addressLine1 || '',
                billing_address_2: order.shippingAddress?.addressLine2 || '',
                billing_city: order.shippingAddress?.city || '',
                billing_pincode: order.shippingAddress?.pincode || '',
                billing_state: order.shippingAddress?.state || '',
                billing_country: order.shippingAddress?.country || 'India',
                billing_email: order.userId?.email || '',
                billing_phone: order.shippingAddress?.phone?.replace(/\D/g, '').slice(-10) || '', // Last 10 digits

                // Shipping same as billing
                shipping_is_billing: true,

                // Order items
                order_items: orderItems,

                // Payment
                payment_method: order.paymentProvider === 'COD' ? 'COD' : 'Prepaid',
                sub_total: order.totalAmount,

                // Package dimensions (in cm for length/breadth/height, kg for weight)
                length: maxLength,
                breadth: maxBreadth,
                height: maxHeight,
                weight: Math.max(totalWeight, 0.5),
            };

            console.log('[Shiprocket] Creating order with payload:', JSON.stringify(payload, null, 2));

            const res = await axios.post(`${this.BASE_URL}/orders/create/adhoc`, payload, { headers });

            console.log('[Shiprocket] Order created:', res.data);

            return {
                order_id: res.data.order_id,
                shipment_id: res.data.shipment_id,
                status: res.data.status,
                status_code: res.data.status_code,
            };
        });
    }

    /**
     * Cancel Shiprocket order(s)
     */
    static async cancelOrder(shiprocketOrderIds: number[]): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();
            const res = await axios.post(`${this.BASE_URL}/orders/cancel`, {
                ids: shiprocketOrderIds,
            }, { headers });

            console.log('[Shiprocket] Order(s) cancelled:', shiprocketOrderIds);
            return res.data;
        });
    }

    /**
     * Cancel shipment (different from cancelling order)
     */
    static async cancelShipment(awbCodes: string[]): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();
            const res = await axios.post(`${this.BASE_URL}/orders/cancel/shipment/awbs`, {
                awbs: awbCodes,
            }, { headers });

            return res.data;
        });
    }

    // ============================================
    // AWB & COURIER ASSIGNMENT
    // ============================================

    /**
     * Generate AWB (Assign courier to shipment)
     */
    static async generateAWB(shipmentId: number, courierId: number): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            console.log(`[Shiprocket] Generating AWB for shipment ${shipmentId} with courier ${courierId}`);

            const res = await axios.post(`${this.BASE_URL}/courier/assign/awb`, {
                shipment_id: shipmentId,
                courier_id: courierId,
            }, { headers });

            if (res.data.awb_assign_status === 1) {
                console.log('[Shiprocket] AWB assigned:', res.data.response?.data);
                return {
                    success: true,
                    awb_code: res.data.response?.data?.awb_code,
                    courier_name: res.data.response?.data?.courier_name,
                    courier_company_id: res.data.response?.data?.courier_company_id,
                    applied_weight: res.data.response?.data?.applied_weight,
                    ...res.data,
                };
            } else {
                throw new Error(res.data.message || res.data.response?.data?.message || 'AWB assignment failed');
            }
        });
    }

    /**
     * Auto-assign AWB based on recommendation
     */
    static async autoAssignAWB(shipmentId: number): Promise<any> {
        // First get available couriers
        const couriers = await this.getAvailableCouriers(shipmentId);

        if (!couriers || couriers.length === 0) {
            throw new Error('No couriers available for this shipment');
        }

        // Select the recommended or cheapest courier
        const recommended = couriers.find((c: any) => c.is_recommended_courier) || couriers[0];

        console.log(`[Shiprocket] Auto-selecting courier: ${recommended.courier_name} (ID: ${recommended.courier_company_id})`);

        return this.generateAWB(shipmentId, recommended.courier_company_id);
    }

    // ============================================
    // PICKUP SCHEDULING
    // ============================================

    /**
     * Request pickup for shipments
     */
    static async requestPickup(shipmentIds: number[]): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            console.log('[Shiprocket] Requesting pickup for shipments:', shipmentIds);

            const res = await axios.post(`${this.BASE_URL}/courier/generate/pickup`, {
                shipment_id: shipmentIds,
            }, { headers });

            console.log('[Shiprocket] Pickup response:', res.data);
            return res.data;
        });
    }

    // ============================================
    // LABEL & DOCUMENTS
    // ============================================

    /**
     * Generate shipping label
     */
    static async generateLabel(shipmentIds: number[]): Promise<string> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const res = await axios.post(`${this.BASE_URL}/courier/generate/label`, {
                shipment_id: shipmentIds,
            }, { headers });

            const labelUrl = res.data.label_url || res.data.label_created;
            console.log('[Shiprocket] Label generated:', labelUrl);
            return labelUrl;
        });
    }

    /**
     * Generate manifest
     */
    static async generateManifest(shipmentIds: number[]): Promise<string> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const res = await axios.post(`${this.BASE_URL}/manifests/generate`, {
                shipment_id: shipmentIds,
            }, { headers });

            return res.data.manifest_url;
        });
    }

    /**
     * Generate invoice
     */
    static async generateInvoice(orderIds: number[]): Promise<string> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const res = await axios.post(`${this.BASE_URL}/orders/print/invoice`, {
                ids: orderIds,
            }, { headers });

            return res.data.invoice_url;
        });
    }

    // ============================================
    // TRACKING
    // ============================================

    /**
     * Track shipment by Shiprocket shipment ID
     */
    static async trackShipment(shipmentId: number): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const res = await axios.get(`${this.BASE_URL}/courier/track/shipment/${shipmentId}`, { headers });

            return res.data;
        });
    }

    /**
     * Track shipment by AWB code
     */
    static async trackByAWB(awbCode: string): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const res = await axios.get(`${this.BASE_URL}/courier/track/awb/${awbCode}`, { headers });

            return res.data;
        });
    }

    /**
     * Get order details from Shiprocket
     */
    static async getOrderDetails(shiprocketOrderId: number): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const res = await axios.get(`${this.BASE_URL}/orders/show/${shiprocketOrderId}`, { headers });

            return res.data;
        });
    }

    // ============================================
    // NDR (Non-Delivery Report) MANAGEMENT
    // ============================================

    /**
     * Get NDR shipments
     */
    static async getNDRShipments(): Promise<any[]> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const res = await axios.get(`${this.BASE_URL}/ndr/all`, { headers });

            return res.data.data || [];
        });
    }

    /**
     * Take action on NDR
     */
    static async updateNDR(awbCode: string, action: 'reattempt' | 'cancel', params?: {
        address?: string;
        phone?: string;
        comments?: string;
    }): Promise<any> {
        return this.withRetry(async () => {
            const headers = await this.getHeaders();

            const payload: any = {
                awb: awbCode,
                action: action === 'reattempt' ? 're-attempt' : 'cancel',
            };

            if (params?.address) payload.address = params.address;
            if (params?.phone) payload.phone = params.phone;
            if (params?.comments) payload.comments = params.comments;

            const res = await axios.put(`${this.BASE_URL}/ndr`, payload, { headers });

            return res.data;
        });
    }

    // ============================================
    // UTILITY METHODS
    // ============================================

    /**
     * Format error for API response
     */
    static formatError(error: any): { message: string; details?: any } {
        if (error.response?.data) {
            return {
                message: error.response.data.message || 'Shiprocket API error',
                details: error.response.data,
            };
        }
        return {
            message: error.message || 'Unknown error occurred',
        };
    }
}
