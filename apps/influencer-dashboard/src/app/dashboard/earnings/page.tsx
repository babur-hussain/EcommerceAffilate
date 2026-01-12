"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Payout } from "@/types";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import toast from "react-hot-toast";

export default function EarningsPage() {
  const { profile, refreshProfile } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState<
    "bank_transfer" | "upi" | "paypal"
  >("upi");
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    paypalEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayouts();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchPayouts();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await api.get("/api/influencers/payouts");
      setPayouts(response.data);
    } catch (error) {
      console.error("Error fetching payouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > (profile?.pendingEarnings || 0)) {
      toast.error("Amount exceeds available balance");
      return;
    }

    const minPayout = 1000;
    if (amount < minPayout) {
      toast.error(`Minimum payout amount is ${formatCurrency(minPayout)}`);
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        amount,
        method: payoutMethod,
      };

      if (payoutMethod === "bank_transfer") {
        if (!accountDetails.accountNumber || !accountDetails.ifscCode) {
          toast.error("Please provide bank account details");
          setSubmitting(false);
          return;
        }
        payload.accountDetails = {
          accountNumber: accountDetails.accountNumber,
          ifscCode: accountDetails.ifscCode,
        };
      } else if (payoutMethod === "upi") {
        if (!accountDetails.upiId) {
          toast.error("Please provide UPI ID");
          setSubmitting(false);
          return;
        }
        payload.accountDetails = {
          upiId: accountDetails.upiId,
        };
      } else if (payoutMethod === "paypal") {
        if (!accountDetails.paypalEmail) {
          toast.error("Please provide PayPal email");
          setSubmitting(false);
          return;
        }
        payload.accountDetails = {
          paypalEmail: accountDetails.paypalEmail,
        };
      }

      await api.post("/api/influencers/payouts", payload);

      toast.success("Payout request submitted successfully!");
      setShowPayoutModal(false);
      setPayoutAmount("");
      setAccountDetails({
        accountNumber: "",
        ifscCode: "",
        upiId: "",
        paypalEmail: "",
      });

      await Promise.all([fetchPayouts(), refreshProfile()]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to request payout");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Earnings & Payouts
          </h1>
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">LIVE</span>
          </div>
        </div>
        <p className="text-gray-600 mt-1">
          Manage your earnings and request withdrawals
        </p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">
              Total Earnings
            </h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(profile?.totalEarnings || 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(profile?.pendingEarnings || 0)}
          </p>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={(profile?.pendingEarnings || 0) < 1000}
            className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-primary-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Paid Out</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(profile?.paidEarnings || 0)}
          </p>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Payout History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payouts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No payout requests yet
                  </td>
                </tr>
              ) : (
                payouts.map((payout) => (
                  <tr key={payout._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payout.requestedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payout.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payout.method === "bank_transfer"
                        ? "Bank Transfer"
                        : payout.method === "upi"
                        ? "UPI"
                        : "PayPal"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payout.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : payout.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : payout.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {payout.status === "completed" && (
                          <CheckCircle className="h-3 w-3" />
                        )}
                        {payout.status === "processing" && (
                          <Clock className="h-3 w-3" />
                        )}
                        {payout.status === "failed" && (
                          <XCircle className="h-3 w-3" />
                        )}
                        {payout.status === "pending" && (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {payout.completedAt
                        ? formatDate(payout.completedAt)
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Request Payout
            </h3>
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    required
                    min="1000"
                    max={profile?.pendingEarnings || 0}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Available: {formatCurrency(profile?.pendingEarnings || 0)} ·
                  Min: ₹1,000
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("upi")}
                    className={`w-full flex items-center gap-3 p-3 border rounded-lg ${
                      payoutMethod === "upi"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">UPI</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod("bank_transfer")}
                    className={`w-full flex items-center gap-3 p-3 border rounded-lg ${
                      payoutMethod === "bank_transfer"
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-300"
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Bank Transfer</span>
                  </button>
                </div>
              </div>

              {payoutMethod === "upi" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={accountDetails.upiId}
                    onChange={(e) =>
                      setAccountDetails({
                        ...accountDetails,
                        upiId: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="yourname@upi"
                  />
                </div>
              )}

              {payoutMethod === "bank_transfer" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountDetails.accountNumber}
                      onChange={(e) =>
                        setAccountDetails({
                          ...accountDetails,
                          accountNumber: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={accountDetails.ifscCode}
                      onChange={(e) =>
                        setAccountDetails({
                          ...accountDetails,
                          ifscCode: e.target.value,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="ABCD0123456"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
