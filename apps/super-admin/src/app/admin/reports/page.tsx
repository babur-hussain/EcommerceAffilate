"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  FileText,
  Download,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  ShoppingBag,
  Eye,
  Printer,
} from "lucide-react";

interface Report {
  _id: string;
  type: string;
  title: string;
  description: string;
  period: string;
  status: "generated" | "pending" | "failed";
  createdAt: string;
  fileUrl?: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("sales");
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await api.get("/api/super-admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data.reports || []);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      // Use mock data for now
      setReports([
        {
          _id: "1",
          type: "sales",
          title: "Monthly Sales Report",
          description: "Comprehensive sales data for December 2025",
          period: "December 2025",
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "2",
          type: "users",
          title: "User Activity Report",
          description: "User engagement and activity metrics",
          period: "Q4 2025",
          status: "generated",
          createdAt: new Date().toISOString(),
        },
        {
          _id: "3",
          type: "revenue",
          title: "Revenue Report",
          description: "Platform revenue breakdown and analysis",
          period: "2025",
          status: "generated",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await api.post(
        "/api/super-admin/reports/generate",
        { type: reportType, period },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Report generation started");
      fetchReports();
    } catch (error) {
      toast.error("Failed to generate report");
    }
  };

  const downloadReport = (reportId: string) => {
    toast.success("Downloading report...");
    // Implementation would download the report file
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case "sales":
        return <ShoppingBag className="w-5 h-5" />;
      case "users":
        return <Users className="w-5 h-5" />;
      case "revenue":
        return <DollarSign className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Ready
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">
            Generate and download platform reports
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {reports.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-primary-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">12</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sales Reports</p>
              <p className="text-2xl font-bold text-green-600 mt-1">8</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Analytics</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">15</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Generate New Report */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Generate New Report
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="sales">Sales Report</option>
              <option value="users">User Activity</option>
              <option value="revenue">Revenue Report</option>
              <option value="products">Product Performance</option>
              <option value="influencers">Influencer Performance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              className="w-full px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Reports
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {reports.map((report) => (
            <div
              key={report._id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                    {getReportIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.title}
                      </h3>
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {report.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {report.period}
                      </span>
                      <span>
                        Generated:{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {report.status === "generated" && (
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => downloadReport(report._id)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Print"
                    >
                      <Printer className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reports generated yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Generate your first report using the form above
            </p>
          </div>
        )}
      </div>

      {/* Report Templates */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Report Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
            <DollarSign className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">Monthly Revenue</h3>
            <p className="text-sm text-gray-600 mt-1">
              Complete revenue breakdown
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
            <Users className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">User Growth</h3>
            <p className="text-sm text-gray-600 mt-1">User acquisition metrics</p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-left">
            <ShoppingBag className="w-6 h-6 text-primary-600 mb-2" />
            <h3 className="font-medium text-gray-900">Sales Performance</h3>
            <p className="text-sm text-gray-600 mt-1">
              Product sales analysis
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
