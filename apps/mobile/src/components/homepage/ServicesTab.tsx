import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, PanResponder, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AdvancedRenderer from '../sdui/AdvancedRenderer';
import { useAdvancedLayout } from '../../hooks/useAdvancedLayout';

interface ServicesTabProps {
    onTabPress?: (tabId: string) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 80;

const ServicesTab = ({ onTabPress }: ServicesTabProps) => {
    const { layout, loading } = useAdvancedLayout('services');
    const translateX = useRef(new Animated.Value(0)).current;

    const animateOut = () => {
        Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onTabPress?.('shopping');
            // Reset position after short delay to be ready for next time
            // Since this tab goes to z-index 0, this reset won't be visible
            setTimeout(() => {
                translateX.setValue(0);
            }, 100);
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (evt) => {
                return evt.nativeEvent.pageX < 30;
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return evt.nativeEvent.pageX < 50 && gestureState.dx > 10 && Math.abs(gestureState.dy) < 30;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dx > 0) {
                    translateX.setValue(gestureState.dx);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dx > SWIPE_THRESHOLD) {
                    animateOut();
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
            onPanResponderTerminate: () => {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            },
        })
    ).current;

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#2BC0E4" />
            </View>
        );
    }

    const componentData = layout?.components?.[0] || { id: 'empty', type: 'Container', children: [] };

    return (
        <Animated.View
            style={[styles.container, { transform: [{ translateX }] }]}
            {...panResponder.panHandlers}
        >
            <LinearGradient
                colors={['#2BC0E4', '#EAECC6', '#FFFFFF']}
                locations={[0, 0.25, 0.6]}
                style={StyleSheet.absoluteFillObject}
            />
            {layout && <AdvancedRenderer component={componentData} onBack={animateOut} />}
        </Animated.View>
    );
};

export default React.memo(ServicesTab);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
});
