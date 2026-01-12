export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const copyToClipboard = async (text: string): Promise<void> => {
  await navigator.clipboard.writeText(text);
};

export const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: "text-green-600 bg-green-50",
    inactive: "text-red-600 bg-red-50",
    pending: "text-yellow-600 bg-yellow-50",
    approved: "text-blue-600 bg-blue-50",
    rejected: "text-red-600 bg-red-50",
    suspended: "text-gray-600 bg-gray-50",
  };
  return statusMap[status.toLowerCase()] || "text-gray-600 bg-gray-50";
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};
