'use client';
// import TextRecognition from '@react-native-ml-kit/text-recognition';
import { performOcr } from '@bear-block/vision-camera-ocr';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import {
    Camera,
    CameraPosition,
    useCameraDevice,
    useFrameProcessor,
} from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core'; // Allows react state to be updated from workflets frameProcessor function
import { ROUTE_14 } from '../constants/addressToLoop';

export default function Index() {
    const [selectedRoute, setSelectedRoute] = useState<number>(1);
    const [loopResult, setLoopResult] = useState<number>(0);
    const [scannedAddress, setScannedAddress] = useState<string>('');
    // const loopResultShared = useSharedValue<number>(0);
    const [cameraDirection, setCameraDirection] =
        useState<CameraPosition>('back'); // front, back, or external
    const [cameraActive, setCameraActive] = useState<boolean>(true);
    const imageURL = 'https://www.svgbasics.com/rasters/text_ex1.png';
    // const loopResultRef = useRef<number>(0); // ✅ ref to avoid stale closure

    const device = useCameraDevice(cameraDirection);

    const updateLoopResult = Worklets.createRunOnJS(
        (loopNumber: number, address: string) => {
            setLoopResult(loopNumber);
            setScannedAddress(address);
        },
    );

    const frameProcessor = useFrameProcessor(
        (frame) => {
            'worklet';

            const result = performOcr(frame, {
                includeBoxes: true,
                includeConfidence: true,
                recognitionLevel: 'accurate',
                recognitionLanguages: ['en-US'],
            });
            if (result?.text) {
                const confidence = result.blocks?.[0]?.lines?.[0].confidence;
                if (confidence && confidence === 1) {
                    if (result.text !== undefined) {
                        // console.log('Detected text: ', result.text.toLowerCase());
                        // console.log('Confidence: ', confidence);

                        const scannedText = result.text.trim().toLowerCase();
                        // console.log('Address: ', address);
                        const streets = Object.keys(ROUTE_14);
                        for (let i = 0; i < streets.length; i++) {
                            const street = streets[i];
                            // console.log('Key: ', key);
                            if (scannedText.includes(street)) {
                                // console.log('Street: ', street);
                                // console.log('LOOP -> ', ROUTE_14[street]);
                                updateLoopResult(ROUTE_14[street], street);
                                break;
                            }
                        }

                        // const streetRegex =
                        //     /^\d+\s+(?:(?:NW|NE|SW|SE|N|S|E|W)\s+)?(?!NN|SS|EE|WW|NM|UN)[A-Z0-9]+(?:\s+[A-Z0-9]+)*\s+(?:ST|AVE|BLVD|DR|RD|LN|CT|WAY|PL|TER|CIR|HWY)\.?\s*$/i;
                        // const normalized = result.text.trim().toUpperCase();
                        // if (normalized.match(streetRegex) !== null) {
                        //     console.log(
                        //         'Street Address: ',
                        //         normalized.toLowerCase(),
                        //     );
                        //     const loop = addressToLoop[normalized.toLowerCase()];
                        //     if (loop !== undefined) {
                        //         console.log('Loop: ', loop);
                        //     }
                        // }
                    }
                }
                // console.log('Confidence: ', result.blocks?.[0]?.lines?.[0].confidence );
            }
        },
        [],
    );

    return (
        <View style={styles.container}>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
                <Image
                    source={require('../assets/images/usps-logo-2.png')}
                    style={{ width: 35, height: 35 }}
                />
                <Text style={styles.title}>USPS Mail Reader</Text>
            </View>
            <View style={{ flex: 1 }}>
                {device === undefined && (
                    <Text style={styles.text}>No camera found</Text>
                )}

                {!cameraActive && (
                    <Text style={styles.text}>Camera is Off</Text>
                )}

                {cameraActive && device !== undefined && (
                    <Camera
                        style={{ width: 300, height: 275 }}
                        device={device}
                        isActive={cameraActive}
                        frameProcessor={frameProcessor}
                        fps={10}
                        isMirrored={false}
                        photoQualityBalance='quality'
                    />
                )}
            </View>
            {/* <Text style={styles.text2}>{loopResultShared.value}</Text> */}
            <View
                style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                    marginBottom: 20,
                }}
            >
                <Text style={styles.text2}>{loopResult}</Text>
                <Text style={styles.text3}>{scannedAddress}</Text>
            </View>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
                {/* <View style={styles.button}>
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
                </View> */}
                <View style={styles.button}>
                    <Button
                        title='Camera On/Off'
                        onPress={() => setCameraActive(!cameraActive)}
                        color={'#007AFF'}
                        accessibilityLabel='Camera On/Off'
                    />
                </View>
                {/* <View style={styles.button}>
                    <Button
                        title='Next Loop'
                        onPress={() => setLoopResult(0)}
                        color={'#007AFF'}
                        accessibilityLabel='Next Loop'
                    />
                </View> */}
            </View>

            <View>
                <Picker
                    selectedValue={selectedRoute}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedRoute(itemValue)
                    }
                    style={styles.picker}
                >
                    <Picker.Item
                        label='Route 1'
                        value={1}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 2'
                        value={2}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 4'
                        value={4}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 5'
                        value={5}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 11'
                        value={11}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 14'
                        value={14}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 15'
                        value={15}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 16'
                        value={16}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 25'
                        value={25}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 29'
                        value={29}
                        style={styles.text}
                    />
                </Picker>
            </View>
            {/* <Text style={styles.text2}>{selectedRoute}</Text> */}
            {/* <Text style={styles.text2}>{loopResult}</Text> */}
            {/* <Text style={styles.text2}>L-2</Text> */}
            {/* <Text style={styles.text2}>Loop {loopResult}</Text> */}
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
        // justifyContent: 'flex-start',
        // alignContent: 'center',
        // color: '#fff',
        // justifyContent: 'center',
    },
    text: {
        color: '#fff',
        // fontSize: 10,
    },
    text2: {
        color: '#fff',
        fontSize: 60,
    },
    text3: {
        color: '#fff',
        fontSize: 23,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#fff',
    },
    picker: {
        width: 200,
        height: 270,
        // height: 'auto',
        color: '#fff',
        padding: 0,
        margin: 0,
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
    },
});

// async function getLoop(imageURL : string) {
//     const result = await TextRecognition.recognize(imageURL);
//     return result.text;
// }
