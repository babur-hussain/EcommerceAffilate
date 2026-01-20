import React, { forwardRef } from 'react';
import MapView, { MapViewProps, PROVIDER_GOOGLE } from 'react-native-maps';
import { Platform } from 'react-native';

export type LocationMapProps = MapViewProps;

const LocationMap = forwardRef<MapView, LocationMapProps>((props, ref) => {
    return (
        <MapView
            ref={ref}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            {...props}
        />
    );
});

LocationMap.displayName = 'LocationMap';

export default LocationMap;
