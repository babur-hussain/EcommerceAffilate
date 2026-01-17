import { StyleSheet } from 'react-native';
import { Colors } from './Colors';

export const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60, // Safe area top
        paddingBottom: 20,
        backgroundColor: Colors.surface,
    },
});
