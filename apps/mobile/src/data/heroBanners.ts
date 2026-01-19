export interface BannerData {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    backgroundColor: string;
}

/**
 * Fallback banner data used when API fails or returns empty.
 * IDs correlate to specific promotions used in navigation.
 */
export const HERO_BANNERS: BannerData[] = [
    {
        id: '1',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745335/1_vcpjpg.webp',
        backgroundColor: '#4F46E5',
    },
    {
        id: '2',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745335/2_iauxf4.webp',
        backgroundColor: '#10B981',
    },
    {
        id: '3',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745335/3_uhuock.webp',
        backgroundColor: '#F59E0B',
    },
    {
        id: '4',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745336/5_qxzpp7.webp',
        backgroundColor: '#F59E0B',
    },
    {
        id: '5',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745336/4_taojjq.webp',
        backgroundColor: '#F59E0B',
    },
    {
        id: '6',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745336/7_b3pmpt.webp',
        backgroundColor: '#F59E0B',
    },
    {
        id: '7',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745336/6_qs6vai.webp',
        backgroundColor: '#F59E0B',
    },
    {
        id: '8',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745336/8_bkp0rd.webp',
        backgroundColor: '#F59E0B',
    },
    {
        id: '9',
        title: '',
        subtitle: '',
        image: 'https://res.cloudinary.com/deljcbcvu/image/upload/v1768745336/9_js76ou.webp',
        backgroundColor: '#F59E0B',
    },
];
