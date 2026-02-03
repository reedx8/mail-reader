'use client';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

export default function Index() {
    const [selectedRoute, setSelectedRoute] = useState(1);
    const device = useCameraDevice('back');

    if (device === undefined) { return <Text>No camera found</Text>; }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>USPS Mail Reader</Text>
            <View style={{ flex: 1 }}>
                <Camera style={{ width: 300, height: 300 }} device={device} isActive={true} />
            </View>
            <Picker
                selectedValue={selectedRoute}
                onValueChange={(itemValue, itemIndex) =>
                    setSelectedRoute(itemValue)
                }
                style={styles.picker}
            >
                <Picker.Item label='Route 1' value={1} style={styles.text} />
                <Picker.Item label='Route 2' value={2} style={styles.text} />
                <Picker.Item label='Route 4' value={4} style={styles.text} />
                <Picker.Item label='Route 5' value={5} style={styles.text} />
                <Picker.Item label='Route 11' value={11} style={styles.text} />
                <Picker.Item label='Route 15' value={15} style={styles.text} />
                <Picker.Item label='Route 16' value={16} style={styles.text} />
                <Picker.Item label='Route 25' value={25} style={styles.text} />
                <Picker.Item label='Route 29' value={29} style={styles.text} />
            </Picker>
            <Text style={styles.text2}>L-2</Text>
            <Text style={styles.text2}>Loop 3</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#25292e',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    text: {
        color: '#fff',
        // fontSize: 10,
    },
    text2: {
        color: '#fff',
        fontSize: 50,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
    },
    picker: {
        width: 200,
        height: 300,
    },
});
