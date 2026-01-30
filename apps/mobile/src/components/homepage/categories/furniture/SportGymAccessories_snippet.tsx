
// 14. Gym Approved Accessories
export const SportGymAccessories = ({ data }: SectionProps) => {
    const router = useRouter();
    const items = data?.items || [];
    if (!items.length) return null;

    return (
        <View style={styles.gymAccessoriesSection}>
            <SectionHeader title={data.title || 'Gym-approved accessories'} actionUrl={data.headerActionUrl} router={router} />
            <View style={styles.gymAccessoriesGrid}>
                {items.map((item: any, index: number) => (
                    <TouchableOpacity key={index} style={styles.gymAccessoryCard} onPress={() => router.push(normalizeUrl(item.actionUrl) as any)}>
                        <LinearGradient
                            colors={['#3B82F6', '#172554']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gymAccessoryBackground}
                        >
                            <View style={styles.gymAccessoryContent}>
                                <Text style={styles.gymAccessoryTitle} numberOfLines={2}>{item.title}</Text>
                                <Text style={styles.gymAccessoryDiscount}>{item.discount}</Text>
                            </View>

                            {/* Decorative Line */}
                            <View style={styles.gymAccessoryLine} />

                            <CachedImage source={{ uri: getOptimizedUrl(item.image, 300) }} style={styles.gymAccessoryImage} resizeMode="contain" />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
