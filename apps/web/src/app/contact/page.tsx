"use client";

import { useState } from "react";
import Link from "next/link";

const contactMethods = [
    { icon: "mail", title: "Email Us", value: "support@localforvocalstartup.com", desc: "We'll respond within 24 hours" },
    { icon: "call", title: "Call Us", value: "+91 1800-XXX-XXXX", desc: "Mon-Sat, 9AM-6PM IST" },
    { icon: "location_on", title: "Visit Us", value: "India", desc: "Multiple locations across India" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, send to API
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Contact Us</span>
                </div>

                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">contact_support</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">Get in Touch</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Have a question, suggestion, or need help? We&apos;d love to hear from you.</p>
                </div>

                {/* Contact Methods */}
                <div className="grid md:grid-cols-3 gap-4 mb-12">
                    {contactMethods.map((m, i) => (
                        <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                            <span className="material-symbols-outlined text-3xl text-primary mb-3 block">{m.icon}</span>
                            <h3 className="font-bold mb-1">{m.title}</h3>
                            <p className="text-sm font-semibold text-primary mb-1">{m.value}</p>
                            <p className="text-xs text-slate-400">{m.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                    {submitted ? (
                        <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center">
                            <span className="material-symbols-outlined text-4xl text-green-500 mb-3 block">check_circle</span>
                            <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                            <p className="text-green-700">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                            <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-4 text-sm text-primary font-semibold hover:underline">
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={form.subject}
                                    onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900"
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900 resize-none"
                                    placeholder="Tell us more..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined">send</span>
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}
