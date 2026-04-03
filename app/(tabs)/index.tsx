'use client';
// import TextRecognition from '@react-native-ml-kit/text-recognition';
import { performOcr } from '@bear-block/vision-camera-ocr';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import {
    Camera,
    CameraPosition,
    useCameraDevice,
    useFrameProcessor,
} from 'react-native-vision-camera';
import { Worklets } from 'react-native-worklets-core'; // Allows react state (eg loopResult) to be updated from workflets frameProcessor function
// import { ROUTE_14 } from '../constants/addressToLoop';
import { useIsFocused } from '@react-navigation/native';
import { db } from '../../db/index';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
// import { Link } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

type Schema = {
    id: number;
    begin_num: number;
    end_num: number;
    street_name: string;
    dir: string;
    suffix: string;
    loop_num: string;
    route_num: number;
};

const SCANNER_WIDTH = 325;
const SCANNER_HEIGHT = 150;
const CORNER_SIZE = 20; // Length of the corner lines
const CORNER_THICKNESS = 1; // Thickness of the lines
const GAP = 10; // Space between the camera and the corners


// Scan page
export default function Index() {
    const [selectedRoute, setSelectedRoute] = useState<number>(1);
    const [loopResult, setLoopResult] = useState<string>(''); // loop could be a number (2), number plus letter (eg 16b), or dismount/drive off (D.O.)
    const [scannedAddress, setScannedAddress] = useState<string>('');
    const [cameraDirection, setCameraDirection] =
        useState<CameraPosition>('back'); // front, back, or external
    const [cameraActive, setCameraActive] = useState<boolean>(true);
    // const imageURL = 'https://www.svgbasics.com/rasters/text_ex1.png';
    const isFocused = useIsFocused();
    const device = useCameraDevice(cameraDirection);
    const routes = [1, 3, 7, 12, 14, 15, 16, 21, 24, 25, 26, 29, 36];

    useEffect(() => {
        if (loopResult !== '') {
            Speech.stop();
            // Speech.speak(String('Loop ' + loopResult), {
            Speech.speak(String(loopResult), {
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
        async (match: string[], fullAddress: string) => {
            try {
                // match[1]: num, match[2]: dir, match[3]: name, match[4]: suffix
                // console.log('route: ', selectedRoute);
                const streetName = match.slice(3,-1).join(' ').toLowerCase();
                let suffix = match[match.length - 1].toLowerCase();

                // const streetName = match[3].toLowerCase();
                // let suffix = match[4].toLowerCase();
                const streetNum = match[1];

                switch (suffix) {
                    case 'street':
                        suffix = 'st';
                        break;
                    case 'avenue':
                        suffix = 'ave';
                        break;
                    case 'boulevard':
                        suffix = 'blvd';
                        break;
                    case 'drive':
                        suffix = 'dr';
                        break;
                    case 'road':
                        suffix = 'rd';
                        break;
                    case 'lane':
                        suffix = 'ln';
                        break;
                    case 'place':
                        suffix = 'pl';
                        break;
                    case 'court':
                        suffix = 'ct';
                        break;
                    case 'circle':
                        suffix = 'cir';
                        break;
                    case 'highway':
                        suffix = 'hwy';
                        break;
                    case 'terrace':
                        suffix = 'ter';
                        break;
                }

                // if (suffix === '' || suffix === undefined) {
                //     result = await db.getFirstAsync(
                //         'SELECT loop_num FROM street_loops WHERE route_num = ? AND street_name = ? AND ? BETWEEN begin_num AND end_num',
                //         [Number(selectedRoute), streetName, streetNum],
                //     );
                // } else {
                const result: Schema | null = await db.getFirstAsync(
                    'SELECT loop_num FROM street_loops WHERE route_num = ? AND street_name = ? AND suffix = ? AND ? BETWEEN begin_num AND end_num',
                    // 'SELECT loop_num FROM street_loops WHERE route_num = ? AND dir = ? AND street_name = ? AND suffix = ? AND ? BETWEEN begin_num AND end_num',
                    [
                        Number(selectedRoute),
                        // match[2].toLowerCase(),
                        streetName,
                        suffix,
                        streetNum,
                    ],
                );
                // }

                if (result) {
                    setLoopResult(result.loop_num);
                    setScannedAddress(fullAddress);
                    // console.log('result: ', result);
                }
                // } else {
                // console.log('No result found');
                // setLoopResult(0);
                // setScannedAddress('Loop Not Found');
                // }
            } catch (error) {
                console.error('Database error: ', error);
            }
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
                        // const streetRegex =
                        // /^\d+\s+(?:(?:NW|NE|SW|SE|N|S|E|W|NORTH|SOUTH|EAST|WEST)\s+)?(?!NN|SS|EE|WW|NM|UN)[A-Z0-9]+(?:\s+[A-Z0-9]+)*\s+(?:ST|AVE|BLVD|DR|RD|LN|CT|WAY|PL|TER|CIR|HWY|STREET|ROAD|AVENUE|DRIVE|HIGHWAY|LANE|WAY|PLACE|TERRACE|CIRCLE|COURT|BOULEVARD)\.?\s*$/i;

                        // previous regex: worked ok for most addresses, but crucially misses addresses with multiple street names
                        // const addressRegex =
                            // /\b(\d{3,6})\s+(n|s|e|w|ne|nw|se|sw|north|south|east|west|northeast|northwest|southeast|southwest)?\s+([a-z]+)\s+(st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard|ct|court|pl|place|hwy|highway|ter|terrace|cir|circle|way)\b/i;
                        
                        // new regex: now includes addresses with dots on suffix + up to 4 street names in address + street names that are numbers
                        // const addressRegex = /\b(\d{3,6})\s+(n|s|e|w|ne|nw|se|sw|north|south|east|west|northeast|northwest|southeast|southwest)?\s+([a-z0-9]+)\s+(st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard|ct|court|pl|place|hwy|highway|ter|terrace|cir|circle|way)\b/i;
                        const addressRegex = /\b(\d{3,6})\s+(n|s|e|w|ne|nw|se|sw|north|south|east|west|northeast|northwest|southeast|southwest)?\s+([a-z0-9]+(?:\s+[a-z0-9]+){0,3})\s+(st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard|ct|court|pl|place|hwy|highway|ter|terrace|cir|circle|way)\b/i;

                        // const addressRegex = /\b\d{3,6}\s+(n|s|e|w|ne|nw|se|sw|north|south|east|west|northeast|northwest|southeast|southwest)\.?\s+?(?:[a-z0-9]+\s+){1,4}(?:st|street|ave|avenue|rd|road|dr|drive|ln|lane|blvd|boulevard|ct|court|pl|place|hwy|highway|ter|terrace|cir|circle|way)\b/i;

                        let scannedText = result.text.trim().toLowerCase();
                        scannedText = scannedText.replace(/\./g, ''); // remove any dots if present


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
        },
        [selectedRoute],
    );
    // console.log('selectedRoute: ', selectedRoute);

    return (
        <View style={styles.container}>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
                <Image
                    source={require('../../assets/images/usps-logo-2.png')}
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

                {cameraActive && device !== undefined && isFocused && (
                    <View style={styles.cameraWrapper}>
                        <Camera
                            style={{
                                width: 325,
                                height: 150,
                                // margin: 10,
                            }}
                            device={device}
                            isActive={cameraActive && isFocused}
                            frameProcessor={frameProcessor}
                            fps={10}
                            isMirrored={false}
                            photoQualityBalance='quality'
                        />
                        <View
                            style={[
                                styles.corner,
                                styles.topLeft,
                                {
                                    borderTopWidth: CORNER_THICKNESS,
                                    borderLeftWidth: CORNER_THICKNESS,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.corner,
                                styles.topRight,
                                {
                                    borderTopWidth: CORNER_THICKNESS,
                                    borderRightWidth: CORNER_THICKNESS,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.corner,
                                styles.bottomLeft,
                                {
                                    borderBottomWidth: CORNER_THICKNESS,
                                    borderLeftWidth: CORNER_THICKNESS,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.corner,
                                styles.bottomRight,
                                {
                                    borderBottomWidth: CORNER_THICKNESS,
                                    borderRightWidth: CORNER_THICKNESS,
                                },
                            ]}
                        />
                    </View>
                )}
            </View>
            {/* <Text style={styles.text2}>{loopResultShared.value}</Text> */}
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 5,
                    justifyContent: 'center',
                    // alignContent: 'center',
                    // marginBottom: 50,
                }}
            >
                <Text style={styles.text2}>
                    {loopResult}
                    {/* {loopResult === -1 || loopResult === 0 ? '' : loopResult} */}
                </Text>
                <Text style={styles.text3}>{scannedAddress}</Text>
            </View>
            <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
                <View style={styles.button}>
                    <Pressable
                        onPress={() =>
                            setCameraDirection(
                                cameraDirection === 'back' ? 'front' : 'back',
                            )
                        }
                        style={styles.cameraButton}
                        accessibilityLabel='Switch Camera'
                    >
                        <Entypo name='camera' size={24} color='black' />
                        <Text style={styles.buttonText}>Switch</Text>
                    </Pressable>
                </View>
                <Pressable
                    onPress={() => {
                        setCameraActive(!cameraActive);
                    }}
                    style={styles.cameraButton}
                    accessibilityLabel='Camera On/Off'
                >
                    <Feather
                        name={cameraActive ? 'video' : 'video-off'}
                        size={24}
                        color='black'
                    />
                    <Text style={styles.buttonText}>
                        {cameraActive ? 'On' : 'Off'}
                    </Text>
                </Pressable>
                {/* <View style={styles.button}>
                    <Button
                        title='Camera On/Off'
                        onPress={() => setCameraActive(!cameraActive)}
                        color={'#007AFF'}
                        accessibilityLabel='Camera On/Off'
                    />
                </View> */}
                {/* <View style={styles.button}>
                    <Button
                        title='Next Loop'
                        onPress={() => setLoopResult(0)}
                        color={'#007AFF'}
                        accessibilityLabel='Next Loop'
                    />
                </View> */}
            </View>
            {/* <View>
                <Link href='../route-modal' style={styles.routeButton}>
                    <Text style={styles.buttonText}>Route {selectedRoute}</Text>
                </Link>
            </View> */}

            <View>
                <Picker
                    selectedValue={selectedRoute}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedRoute(itemValue)
                    }
                    style={styles.picker}
                >
                    {routes.map((routeNum, index) => (
                        <Picker.Item
                            label={'Route ' + routeNum}
                            value={routeNum}
                            style={styles.text}
                            key={index}
                        />
                    ))}
                    {/* <Picker.Item
                        label='Route 1'
                        value={1}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 3'
                        value={3}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 7'
                        value={7}
                        style={styles.text}
                    />
                    <Picker.Item
                        label='Route 12'
                        value={12}
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
                        label='Route 21'
                        value={21}
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
                    /> */}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#25292e',
        alignItems: 'center',
        paddingTop: 75,
        // marginTop: 50,
        // justifyContent: 'flex-end',
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
        height: 200,
        // height: 270,
        // height: 'auto',
        color: '#fff',
        padding: 0,
        margin: 0,
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 10,
        // marginTop: 10,
        // padding: 10,
    },
    routeButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cameraButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    buttonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cameraWrapper: {
        width: SCANNER_WIDTH + GAP * 2.5, // Total width including gaps
        height: SCANNER_HEIGHT + GAP * 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    camera: {
        width: SCANNER_WIDTH,
        height: SCANNER_HEIGHT,
        borderRadius: 2,
    },
    corner: {
        position: 'absolute',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: 'white',
    },
    topLeft: { top: 0, left: 0 },
    topRight: { top: 0, right: 0 },
    bottomLeft: { bottom: 0, left: 0 },
    bottomRight: { bottom: 0, right: 0 },
});

// async function getLoop(imageURL : string) {
//     const result = await TextRecognition.recognize(imageURL);
//     return result.text;
// }
