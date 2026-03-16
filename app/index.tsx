'use client';
// import TextRecognition from '@react-native-ml-kit/text-recognition';
import { performOcr } from '@bear-block/vision-camera-ocr';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import {
    Camera,
    CameraPosition,
    useCameraDevice,
    useFrameProcessor
} from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core'; // Allows react state (eg loopResult) to be updated from workflets frameProcessor function
// import { ROUTE_14 } from '../constants/addressToLoop';
import { db } from '../db/index';

export default function Index() {
    const [selectedRoute, setSelectedRoute] = useState<number>(1);
    const [loopResult, setLoopResult] = useState<number>(-1);
    const [scannedAddress, setScannedAddress] = useState<string>('');
    const [cameraDirection, setCameraDirection] =
        useState<CameraPosition>('back'); // front, back, or external
    const [cameraActive, setCameraActive] = useState<boolean>(true);
    const imageURL = 'https://www.svgbasics.com/rasters/text_ex1.png';

    const device = useCameraDevice(cameraDirection);

    useEffect(() => {
        if (loopResult !== -1) {
            Speech.stop();
            // Speech.speak(String('Loop ' + loopResult), {
            Speech.speak(String(loopResult === 0 ? 'Loop Not Found' : loopResult), {
                language: 'en-US',
                rate: 1,
                pitch: 0.7,
            });
        }
    }, [loopResult, scannedAddress]);

    // Update react state
    // const updateLoopResult = Worklets.createRunOnJS(
    //     (loopNumber: number, address: string) => {
    //         setLoopResult(loopNumber);
    //         setScannedAddress(address);
    //     },
    // );

    const lookupAddressInDb = Worklets.createRunOnJS(
        async (match : string[], fullAddress : string) => {
            try {
                // match[1]: num, match[2]: dir, match[3]: name, match[4]: suffix
                // console.log('route: ', selectedRoute);
                const result = await db.getFirstAsync(
                    'SELECT loop_num FROM street_loops WHERE route_num = ? AND dir = ? AND street_name = ? AND suffix = ? AND ? BETWEEN begin_num AND end_num',
                    [
                        Number(selectedRoute),
                        match[2].toLowerCase(),
                        match[3].toLowerCase(),
                        match[4].toLowerCase(),
                        Number(match[1]),
                    ],
                );

                if (result) {
                    setLoopResult(result.loop_num);
                    setScannedAddress(fullAddress);
                    // console.log('result: ', result);
                } else {
                    // console.log('No result found');
                    setLoopResult(0);
                    setScannedAddress('Loop Not Found');
                }
            } catch (error) {
                console.error('Database error:', error);
            }
        },
    );

    const frameProcessor = useFrameProcessor((frame) => {
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
                    // const streetRegex =
                    // /^\d+\s+(?:(?:NW|NE|SW|SE|N|S|E|W|NORTH|SOUTH|EAST|WEST)\s+)?(?!NN|SS|EE|WW|NM|UN)[A-Z0-9]+(?:\s+[A-Z0-9]+)*\s+(?:ST|AVE|BLVD|DR|RD|LN|CT|WAY|PL|TER|CIR|HWY|STREET|ROAD|AVENUE|DRIVE|HIGHWAY|LANE|WAY|PLACE|TERRACE|CIRCLE|COURT|BOULEVARD)\.?\s*$/i;
                    const addressRegex =
                        /\b(\d{3,6})\s+(n|s|e|w|ne|nw|se|sw|north|south|east|west|northeast|northwest|southeast|southwest)?\s+([a-z]+)\s+(st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard|ct|court|pl|place|hwy|highway|ter|terrace|cir|circle|way)\b/i;

                    const scannedText = result.text.trim().toLowerCase();

                    // const streets = Object.keys(ROUTE_14); // all streets in route
                    // 3) indexOf() solutions:
                    // 3.1: match entire street address exactly (more reliable):
                    // for (let i = 0; i < streets.length; i++) {
                    //     const street = streets[i];
                    //     const indexOfFirst = scannedText.indexOf(street);
                    //     if (indexOfFirst !== -1) {
                    //         updateLoopResult(ROUTE_14[street], street);
                    //         break;
                    //     }
                    // }

                    // 3.2: match on street number and name only (less reliable):
                    // for (let i = 0; i < streets.length; i++) {
                    //     // find street number in scanned text first:
                    //     const streetNum = streets[i].split(' ')[0];
                    //     const indexOfFirst = scannedText.indexOf(streetNum);
                    //     if (indexOfFirst !== -1) {
                    //         // Now find if street name also matches at that position/index
                    //         const streetName = streets[i].split(' ')[2];
                    //         const addressParts = scannedText
                    //             .slice(indexOfFirst, 100)
                    //             .split(' ', 4);
                    //         // console.log('Address Parts: ', addressParts);
                    //         if (addressParts.join(' ').match(streetRegex)) {
                    //             console.log('Street Name: ', streetName);
                    //             if (streetName === addressParts[2]) {
                    //                 console.log(
                    //                     'Street Address: ',
                    //                     addressParts.join(' '),
                    //                 );
                    //                 updateLoopResult(
                    //                     ROUTE_14[streets[i]],
                    //                     streets[i],
                    //                 );
                    //                 break;
                    //             }
                    //         }
                    //     }

                    // 2) includes() solution:
                    // for (let i = 0; i < streets.length; i++) {
                    //     const street = streets[i];
                    //     if (scannedText.includes(street)) {
                    //         updateLoopResult(ROUTE_14[street], street);
                    //         break;
                    //     }
                    // }

                    // 1.) regex solution
                    // first find an address anywhere in the text
                    const match = scannedText.match(addressRegex);
                    if (match) {
                        const fullAddress =
                            match[1] +
                            ' ' +
                            match[2] +
                            ' ' +
                            match[3] +
                            ' ' +
                            match[4];
                        // console.log('Street Address: ', fullAddress);

                        // Now check if that address is in the route
                        lookupAddressInDb(match, fullAddress);
                        
                        // for (let i = 0; i < streets.length; i++) {
                        //     if (fullAddress.includes(streets[i])) {
                        //         // Display the found loop and address
                        //         updateLoopResult(
                        //             ROUTE_14[fullAddress],
                        //             fullAddress,
                        //         );
                        //         break;
                        //     }
                        // }
                        // updateLoopResult(ROUTE_14[fullAddress], fullAddress);
                    }
                }
            }
            // console.log('Confidence: ', result.blocks?.[0]?.lines?.[0].confidence );
        }
    }, [selectedRoute]);
    // console.log('selectedRoute: ', selectedRoute);

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
                <Text style={styles.text2}>
                    {loopResult === -1 || loopResult === 0 ? '' : loopResult}
                </Text>
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
