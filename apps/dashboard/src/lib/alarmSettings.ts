export const ALARM_SOUNDS = [
    {
        id: 'custom',
        name: 'Custom Alert (Looping)',
        src: 'https://res.cloudinary.com/deljcbcvu/video/upload/v1768678626/new-notification-022-370046_rbbfgl.mp3'
    },
    {
        id: 'bell',
        name: 'Classic Bell',
        src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3'
    },
    {
        id: 'digital',
        name: 'Digital Beep',
        src: 'https://www.soundjay.com/buttons/sounds/beep-07.mp3'
    },
    {
        id: 'coins',
        name: 'Coins Drop',
        src: 'https://www.soundjay.com/misc/sounds/coins-dropped-2.mp3'
    },
    {
        id: 'alert',
        name: 'High Alert',
        src: 'https://www.soundjay.com/buttons/sounds/button-10.mp3'
    }
];

export const EVENTS = {
    SETTINGS_UPDATED: 'SELLER_ALARM_SETTINGS_UPDATED'
};

export const getAlarmSettings = () => {
    if (typeof window === 'undefined') return { enabled: true, soundId: 'custom' };

    const enabled = localStorage.getItem('seller_alarm_enabled');
    const soundId = localStorage.getItem('seller_alarm_sound');

    return {
        enabled: enabled === null ? true : enabled === 'true',
        soundId: soundId || 'custom'
    };
};

export const setAlarmSettings = (enabled: boolean, soundId: string) => {
    localStorage.setItem('seller_alarm_enabled', String(enabled));
    localStorage.setItem('seller_alarm_sound', soundId);

    // Dispatch event for local updates
    window.dispatchEvent(new Event(EVENTS.SETTINGS_UPDATED));
};
