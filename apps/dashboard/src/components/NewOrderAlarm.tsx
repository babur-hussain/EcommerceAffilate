'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { X, Bell } from 'lucide-react';

export default function NewOrderAlarm() {
    const { firebaseUser } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!firebaseUser?.uid) return;

        const q = query(
            collection(db, 'seller_notifications'),
            where('sellerUid', '==', firebaseUser.uid),
            where('status', '==', 'unread')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotifications(newNotifications);
        });

        return () => unsubscribe();
    }, [firebaseUser]);

    useEffect(() => {
        if (notifications.length > 0) {
            if (!isPlaying) {
                startAlarm();
            }
        } else {
            stopAlarm();
        }
    }, [notifications, isPlaying]);

    // Clean up on unmount
    useEffect(() => {
        return () => stopAlarm();
    }, []);

    const startAlarm = () => {
        setIsPlaying(true);

        // Initialize AudioContext if not exists
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
            }
        }

        if (!audioContextRef.current) return;

        const playBeep = () => {
            const ctx = audioContextRef.current;
            if (!ctx) return;

            // Create oscillator and gain node
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            // Ringing sound
            osc.type = 'sine';
            // Modulate frequency to sound like a phone ring
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

            // Envelope
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        };

        // Play immediately one beep
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
        playBeep();

        // Repeat 
        intervalRef.current = setInterval(playBeep, 800);
    };

    const stopAlarm = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsPlaying(false);

        // Sometimes helpful to suspend context to save resources
        if (audioContextRef.current && audioContextRef.current.state === 'running') {
            audioContextRef.current.suspend();
        }
    };

    const handleClose = async () => {
        stopAlarm();
        // Mark all as read
        try {
            const batch = writeBatch(db);
            notifications.forEach(n => {
                const ref = doc(db, 'seller_notifications', n.id);
                batch.update(ref, { status: 'read' });
            });
            await batch.commit();
        } catch (e) {
            console.error('Failed to mark notifications as read:', e);
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full animate-bounce text-center border-2 border-red-500">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Bell className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">New Order Received!</h3>
                <p className="text-gray-600 mb-6">You have {notifications.length} new order(s) waiting for your attention.</p>

                <button
                    onClick={handleClose}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" />
                    Acknowledge & Close
                </button>
            </div>
        </div>
    );
}
