"use client";

import { useState } from "react";

interface AffiliateButtonProps {
    productId: string;
    referralCode: string;
    className?: string;
    variant?: "button" | "icon";
}

export default function AffiliateButton({
    productId,
    referralCode,
    className = "",
    variant = "button",
}: AffiliateButtonProps) {
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const generateLink = () => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        return `${baseUrl}/product/${productId}?ref=${referralCode}`;
    };

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            const link = generateLink();
            await navigator.clipboard.writeText(link);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const toggleModal = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowLinkModal(!showLinkModal);
    };

    if (variant === "icon") {
        return (
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowLinkModal(!showLinkModal);
                    }}
                    className={`p-2 rounded-full transition-all duration-200 bg-white/90 text-primary shadow-sm hover:bg-white ${className}`}
                    title="Generate affiliate link"
                >
                    <span className="material-symbols-outlined text-lg">
                        link
                    </span>
                </button>

                {showLinkModal && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowLinkModal(false);
                            }}
                        />
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                            <h4 className="text-sm font-bold text-slate-900 mb-2">Your Affiliate Link</h4>
                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                <input
                                    readOnly
                                    value={generateLink()}
                                    className="flex-1 bg-transparent border-none text-xs text-slate-600 focus:ring-0 p-0"
                                />
                                <button
                                    onClick={handleCopy}
                                    className="p-1.5 hover:bg-white rounded-md transition-colors text-primary"
                                    title="Copy to clipboard"
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {copied ? "check" : "content_copy"}
                                    </span>
                                </button>
                            </div>
                            {copied && <p className="text-[10px] text-green-600 font-medium mt-1 text-right">Copied to clipboard!</p>}
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setShowLinkModal(!showLinkModal)}
                className={`flex items-center justify-center gap-2 px-4 py-3 w-full rounded-xl font-bold text-sm transition-all duration-200 bg-slate-900 text-white hover:bg-slate-800 ${className}`}
            >
                <span className="material-symbols-outlined text-lg">
                    monetization_on
                </span>
                Generate Affiliate Link
            </button>

            {showLinkModal && (
                <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Share & Earn</h4>
                    <p className="text-xs text-slate-500 mb-3">Copy this link and share it with your followers to earn commission.</p>
                    <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <input
                            readOnly
                            value={generateLink()}
                            className="flex-1 bg-transparent border-none text-sm text-slate-600 focus:ring-0 p-0"
                            onClick={(e) => e.currentTarget.select()}
                        />
                        <button
                            onClick={handleCopy}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied
                                ? "bg-green-500 text-white"
                                : "bg-primary text-white hover:bg-primary/90"
                                }`}
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
