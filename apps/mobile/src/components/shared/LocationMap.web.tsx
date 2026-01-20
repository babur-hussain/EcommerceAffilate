import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Mock types to match native props
export type LocationMapProps = any;

const LocationMap = forwardRef<any, LocationMapProps>((props, ref) => {
    return (
        <View style={[styles.container, props.style]}>
            <Text style={styles.text}>Map is not available on web</Text>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#6B7280',
        fontSize: 14,
    },
});

LocationMap.displayName = 'LocationMap';

export default LocationMap;
