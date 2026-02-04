'use client';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import {
    Camera,
    CameraPosition,
    useCameraDevice,
} from 'react-native-vision-camera';

export default function Index() {
    const [selectedRoute, setSelectedRoute] = useState<number>(1);
    const [cameraDirection, setCameraDirection] =
        useState<CameraPosition>('back');
    const device = useCameraDevice(cameraDirection);

    // if (device === undefined) {
    //     return <Text>no camera found</Text>;
    // }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Image
                    source={require('../assets/images/usps-logo-2.png')}
                    style={{ width: 35, height: 35}}
                />
                <Text style={styles.title}>USPS Mail Reader</Text>
            </View>
            <View style={{ flex: 1 }}>
                {device === undefined ? (
                    <Text style={styles.text}>No camera found </Text>
                ) : (
                    <Camera
                        style={{ width: 300, height: 275 }}
                        device={device}
                        isActive={true}
                    />
                )}
            </View>
            <View style={styles.button}>
                <Button
                    title='Switch Camera'
                    onPress={() =>
                        setCameraDirection(
                            cameraDirection === 'back' ? 'front' : 'back',
                        )
                    }
                    color={'#007AFF'}
                    accessibilityLabel='Switch Camera'
                />
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
            {/* <Text style={styles.text2}>{selectedRoute}</Text> */}
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
        padding: 10,
        // justifyContent: 'space-between',
        // color: '#fff',
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
        height: 'auto',
        color: '#fff',
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
});
