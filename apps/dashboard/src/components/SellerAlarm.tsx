'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { ALARM_SOUNDS, getAlarmSettings, EVENTS } from '@/lib/alarmSettings';
import { Bell, VolumeX, AlertTriangle } from 'lucide-react';

export function SellerAlarm() {
    const { firebaseUser, user } = useAuth();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isFirstLoad = useRef(true);
    const [enabled, setEnabled] = useState(true);
    const [audioPrimed, setAudioPrimed] = useState(false);

    // Track currently playing alarm
    const activeToastId = useRef<string | null>(null);
    const originalTitle = useRef<string>("ShopPlatform Business");

    // Initialize settings, request permissions, and PRIME AUDIO
    useEffect(() => {
        // Request notification permission
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
        originalTitle.current = document.title;

        const setupAudio = () => {
            const settings = getAlarmSettings();
            setEnabled(settings.enabled);

            const sound = ALARM_SOUNDS.find(s => s.id === settings.soundId) || ALARM_SOUNDS[0];

            // Stop existing if any
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
            }

            // Create new audio only if src changed or not exists
            if (!audioRef.current || audioRef.current.src !== sound.src) {
                audioRef.current = new Audio(sound.src);
                audioRef.current.loop = true;
                audioRef.current.preload = 'auto'; // Force load
            }

            console.log("🔔 [SellerAlarm] Audio setup. Source:", sound.name);
        };

        setupAudio();
        const handleSettingsUpdate = () => setupAudio();
        window.addEventListener(EVENTS.SETTINGS_UPDATED, handleSettingsUpdate);

        // PRIME AUDIO ON FIRST INTERACTION OR EXPLICIT REQUEST
        const primeAudio = () => {
            if (audioRef.current) {
                // Play muted briefly to unlock autoplay
                // We use 0.01 volume to be "meaningful" but effectively silent
                const originalVolume = audioRef.current.volume;
                audioRef.current.volume = 0.01;

                const p = audioRef.current.play();
                if (p !== undefined) {
                    p.then(() => {
                        console.log("🔔 [SellerAlarm] Audio successfully primed!");
                        audioRef.current?.pause();
                        if (audioRef.current) audioRef.current.volume = 1.0;
                        setAudioPrimed(true);

                        // Cleanup generic listeners
                        window.removeEventListener('click', primeAudio);
                        window.removeEventListener('keydown', primeAudio);
                        window.removeEventListener('mousedown', primeAudio);
                        window.removeEventListener('touchstart', primeAudio);
                    }).catch(e => {
                        console.warn("🔔 [SellerAlarm] Priming failed (will retry):", e);
                        if (audioRef.current) audioRef.current.volume = originalVolume;
                    });
                }
            }
        };

        window.addEventListener('click', primeAudio);
        window.addEventListener('keydown', primeAudio);
        window.addEventListener('mousedown', primeAudio);
        window.addEventListener('touchstart', primeAudio);
        window.addEventListener('SELLER_ALARM_PRIME', primeAudio); // Listen for button click from OrdersPage

        // Cross-tab synchronization
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'seller_alarm_stopped_timestamp') {
                stopAlarm(false);
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener(EVENTS.SETTINGS_UPDATED, handleSettingsUpdate);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('click', primeAudio);
            window.removeEventListener('keydown', primeAudio);
            window.removeEventListener('mousedown', primeAudio);
            window.removeEventListener('touchstart', primeAudio);
            window.removeEventListener('SELLER_ALARM_PRIME', primeAudio);
        };
    }, [audioPrimed]);

    const stopAlarm = (broadcast = true) => {
        // 1. Stop Audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // 2. Dismiss Toast
        if (activeToastId.current) {
            toast.dismiss(activeToastId.current);
            activeToastId.current = null;
        }

        // 3. Reset Title
        document.title = originalTitle.current;

        // 4. Broadcast Stop
        if (broadcast) {
            localStorage.setItem('seller_alarm_stopped_timestamp', Date.now().toString());
        }
    };

    const triggerAlarm = (title: string, message: string) => {
        if (!enabled || !audioRef.current) return;

        console.log("🔔 [SellerAlarm] Triggering alarm!");

        // 1. Play Audio (Loop)
        audioRef.current.volume = 1.0;
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.error("🔔 [SellerAlarm] Play failed:", e);
                // Retry once if possibly not ready?
                toast.error(
                    (t) => (
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                            // Manual unlock on toaster click
                            audioRef.current?.play();
                            toast.dismiss(t.id);
                        }}>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>Audio blocked. <b>Click here to enable!</b></span>
                        </div>
                    ),
                    { duration: Infinity, id: 'audio-block-error' }
                );
            });
        }

        // 2. System Notification
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: message,
                    icon: '/icon.png'
                });
            } catch (e) {
                console.error("Notification failed", e);
            }
        }

        // 3. Flash Title
        let flashState = false;
        const flashInterval = setInterval(() => {
            if (activeToastId.current) {
                document.title = flashState ? `🔔 ${title}` : "New Order!";
                flashState = !flashState;
            } else {
                clearInterval(flashInterval);
                document.title = originalTitle.current;
            }
        }, 1000);

        // 4. Persistent Toast
        if (!activeToastId.current) {
            activeToastId.current = toast.custom((t) => (
                <div className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-l-4 border-red-500`}>
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <Bell className="h-10 w-10 text-red-500 animate-bounce" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-lg font-bold text-gray-900">
                                    {title}
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col border-l border-gray-200">
                        <button
                            onClick={() => {
                                stopAlarm(true);
                            }}
                            className="w-full border-b border-gray-200 p-4 flex items-center justify-center text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 focus:outline-none transition-colors"
                        >
                            <VolumeX className="mr-2 h-4 w-4" />
                            STOP ALARM
                        </button>
                        <button
                            onClick={() => {
                                // View Order logic here if needed
                                stopAlarm(true);
                                window.location.reload();
                            }}
                            className="w-full p-3 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-50 focus:outline-none"
                        >
                            View Order
                        </button>
                    </div>
                </div>
            ), {
                duration: Infinity,
                position: 'top-center',
                id: 'alarm-toast'
            });
        }
    };

    useEffect(() => {
        if (!firebaseUser) return;

        if (user && !['SELLER_OWNER', 'SELLER_MANAGER', 'SELLER_STAFF'].includes(user.role)) return;

        const q = query(
            collection(db, 'seller_notifications'),
            where('sellerUid', '==', firebaseUser.uid),
            where('status', '==', 'unread'),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (isFirstLoad.current) {
                isFirstLoad.current = false;
                return;
            }

            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    console.log("🔔 [SellerAlarm] New notification detected!", change.doc.id);
                    const data = change.doc.data();
                    triggerAlarm(data.title || 'New Order!', data.message || 'You have a new order.');
                }
            });
        }, (error) => {
            console.error("🔔 [SellerAlarm] Snapshot Listener Error:", error);
        });

        return () => unsubscribe();
    }, [firebaseUser, user, enabled]);

    return null;
}
