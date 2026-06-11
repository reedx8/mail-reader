// routes page not used yet
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { db } from '../../db/index';

type RoutesSchema = {
    route_num: number;
    // label: string;
};

type LoopsSchema = {
    id: number;
    begin_num: number;
    end_num: number;
    street_name: string;
    dir: string;
    suffix: string;
    loop_num: string;
    route_num: number;
    office_num: number;
    street_side: string;
    drive_off: boolean;
};

type PickerSchema = {
    label: string;
    value: number;
};

/**
 * Cheat sheet view for each route in the database
 * @returns Routes page component
 */
export default function Routes() {
    const [currentOffice] = useState(0);
    const [currentRoute, setCurrentRoute] = useState(1);
    // const [currentLoops, setCurrentLoops] = useState<LoopsSchema[] | unknown[]>(
    //     [],
    // );
    const [currentLoops, setCurrentLoops] = useState<any | unknown[]>([]);
    const [pickerData, setPickerData] = useState<RoutesSchema[] | unknown[]>(
        [],
    );

    useEffect(() => {
        async function fetchRoutes() {
            try {
                let data: RoutesSchema[] | unknown[] = await db.getAllAsync(
                    `SELECT route_num FROM routes WHERE office_id = ?`,
                    [currentOffice],
                );
                if (data) {
                    // console.log(routes);
                    const formattedData: PickerSchema[] = data.map((e) => {
                        return {
                            label: 'Route ' + (e as RoutesSchema).route_num,
                            value: (e as RoutesSchema).route_num,
                        };
                    });
                    // console.log(pickerData);
                    setPickerData(formattedData);
                } else {
                    setPickerData([0]);
                }
            } catch {
                console.error('Database error');
            }
        }

        fetchRoutes();
    }, [currentOffice]);

    useEffect(() => {
        async function fetchLoopsOnRoute() {
            try {
                let data: LoopsSchema[] | unknown[] = await db.getAllAsync(
                    `SELECT * FROM loops WHERE route_num = ?`,
                    [currentRoute],
                );

                if (data && data.length > 0) {
                    // let formattedData = getSingleAddresses(data);
                    let formattedData = formatAndGroupData(data);
                    setCurrentLoops(formattedData);
                } else {
                    setCurrentLoops([0]);
                }
            } catch {
                console.error('Database error');
            }
        }
        fetchLoopsOnRoute();
    }, [currentRoute]);

    return (
        <View style={styles.container}>
            {/* <Text style={styles.text}>Routes Page</Text> */}
            <View style={{ width: '100%' }}>
                <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    data={pickerData}
                    // search
                    maxHeight={300}
                    labelField='label'
                    valueField='value'
                    placeholder='Select Route'
                    // searchPlaceholder='Search...'
                    value={currentRoute}
                    onChange={(item) => {
                        setCurrentRoute(item.value);
                    }}
                    // renderLeftIcon={() => (
                    //   <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
                    // )}
                />
            </View>
            <ScrollView style={{ width: '100%', height: '100%' }}>
                {[...currentLoops.entries()].map(([loopNum, streets]) => (
                    <View key={loopNum} style={styles.loopRow}>
                        <Text style={styles.loopNumText}>Loop {loopNum}:</Text>
                        {streets.map((street: any, index: any) => (
                            <Text style={styles.streetText} key={index}>
                                {street[0] === street[1]
                                    ? `${street[0]} ${street[2]}`
                                    : `${street[0]}-${street[1]} ${street[2]}`}
                            </Text>
                        ))}
                    </View>
                ))}
                {/* {[...currentLoops.entries()].map(([loopNum, streets]) => (
                    <View key={loopNum} style={styles.loopRow}>
                        <Text style={styles.loopNumText}>Loop {loopNum}:</Text>
                        {streets.map((street: any, index: any) => (
                            <Text style={styles.streetText} key={index}>
                                {street}
                            </Text>
                        ))}
                    </View>
                ))} */}
            </ScrollView>
        </View>
    );
}

/**
 * Styling the Routes component
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#25292e',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 6,
    },
    text: {
        color: '#fff',
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
    dropdown: {
        // marginVertical: 24,
        marginBottom: 6,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        color: 'white',
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 24,
        color: 'white',
    },
    selectedTextStyle: {
        fontSize: 34,
        color: 'white',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    pickerContainer: {
        marginTop: 50,
        // padding: 10,
    },
    streetText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '100',
        letterSpacing: 0.8,
        marginBottom: 1.4,
    },
    loopNumText: {
        color: 'white',
        fontSize: 26,
    },
    loopRow: {
        marginBottom: 10,
    },
});


/**
 * Format a single route's data into a simpler view simply for improved readability for user
 * @param data - The route's data returned from the expo sqlite db
 * @returns A Map(), `formattedData<loop_num, [street_min, street_max, full_street_name]>`, containing the simpler view of the db's data
 * @example
 * formatAndGroupData({"1": [{1, 2,"main st"},{3, 4,"main st"}], "2": [{1,1,"otter st"}]}) // Returns {"1": [{1,4, "main st", "2": [{1,"otter st"}]}]}
 */
function formatAndGroupData(data: LoopsSchema[] | unknown[]) {
    if (!data || data.length === 0 || !isLoopsSchema(data[0])) {
        return new Map();
    }
    type streetType = [number, number, string];
    const formattedData = new Map<string, streetType[]>(); // <loop_num, [streetType]
    const visitedStreets = new Map<string, [number, number]>(); // <full_street_name, [min, max]>
    let prevLoop = data[0].loop_num;

    // Iterate over every row in Loops table
    for (const row of data as LoopsSchema[]) {
        const fullStreetName = `${row.dir} ${row.street_name} ${row.suffix}`;
        if (prevLoop === row.loop_num) {
            // 1st entry, or same loop as previous loop: get min + max of each street in loop
            if (visitedStreets.has(fullStreetName)) {
                if (
                    row.end_num > (visitedStreets.get(fullStreetName)?.[1] || 0)
                ) {
                    const currMin = visitedStreets.get(fullStreetName)?.[0];
                    visitedStreets.set(fullStreetName, [
                        currMin || 0,
                        row.end_num,
                    ]);
                }
                if (
                    row.begin_num <
                    (visitedStreets.get(fullStreetName)?.[0] || 0)
                ) {
                    const currMax = visitedStreets.get(fullStreetName)?.[1];
                    visitedStreets.set(fullStreetName, [
                        row.begin_num,
                        currMax || 0,
                    ]);
                }
            } else {
                visitedStreets.set(fullStreetName, [
                    row.begin_num,
                    row.end_num,
                ]);
            }
        } else {
            // New loop: add all previous loop's streets to formattedData, then add current row's data
            let streetsOnLoop: streetType[] = [];
            for (let [name, num] of visitedStreets) {
                streetsOnLoop.push([
                    num[0],
                    num[1],
                    capitalizeStreetName(name),
                ]);
                // streetsOnLoop.push([num[0], num[1], name]);
            }
            formattedData.set(prevLoop, streetsOnLoop);
            visitedStreets.clear();

            visitedStreets.set(fullStreetName, [row.begin_num, row.end_num]);
            prevLoop = row.loop_num;
        }
    }

    // and add last loop to formattedData as well
    let streetsOnLoop: streetType[] = [];
    for (let [name, num] of visitedStreets) {
        streetsOnLoop.push([num[0], num[1], capitalizeStreetName(name)]);
    }
    formattedData.set(prevLoop, streetsOnLoop);

    // console.log(formattedData);
    return formattedData;
}

/**
 * Formats the full street name for better readability, 
 * @param streetName - the raw full street name string as it appears in the db, eg "n main st"
 * @returns A string formattedName, eg "N Main St"
 * @example
 * capitalizeStreetName("n main st") // Returns "N Main St"
 */
function capitalizeStreetName(streetName: string) {
    let words = streetName.split(' ');
    let dir = '';
    let formattedName = '';
    if (isDirection(words[0])) {
        dir = words[0].toUpperCase();
        formattedName = dir + ' '; // dir may not exist in street name
    }
    for (let i = 1; i < words.length; ++i) {
        formattedName +=
            words[i].charAt(0).toUpperCase() +
            words[i].slice(1).toLowerCase() +
            ' ';
    }
    return formattedName;
}

/**
 * Simply a utility function to test if param (a single word) is a direction (eg n, nw, e, etc)
 * @param data - A string containing a single word passed from caller function
 * @returns A boolean whether param is a direction
 * @example
 * isDirection("n") // Returns True
 * isDirection("main") // Returns False
 */
function isDirection(data: string) {
    let word = data.toLowerCase();
    return (
        word === 'n' ||
        word === 'nw' ||
        word === 'ne' ||
        word === 's' ||
        word === 'sw' ||
        word === 'se' ||
        word === 'e' ||
        word === 'w'
    );
}

/**
 * A utility function to check if the data is of the type LoopsSchema
 * @param item - data from the expo sqlite db
 * @returns A boolean true/false
 */
function isLoopsSchema(item: any): item is LoopsSchema {
    return (
        item !== null &&
        typeof item === 'object' &&
        'loop_num' in item &&
        'street_name' in item
    );
}

/**
 * (Not used, `formatAndGroupData()` replaced it) Reformat data such that single addresses from db are not outputted to UI as a range (eg "200 Main st", not "200 - 200 Main st"). For better readability.
 * @param data 
 * @returns 
 */
function getSingleAddresses(data: any) {
    let prevLoopNum = '-1';
    let streetsOnLoop = [];

    // let prevStreet = '';
    // let prevStretsNumbers = [];

    const formattedData = new Map<string, string[]>();

    // Iterate over every record (row) in Loops table
    for (const row of data as LoopsSchema[]) {
        // console.log(row.loop_num)
        let streetAddress = '';

        // Check if 1 address or an address range
        if (row.begin_num === row.end_num) {
            // 1 address
            streetAddress =
                `${row.begin_num} ${row.dir} ${row.street_name} ${row.suffix}`.toUpperCase();
        } else {
            // address range
            streetAddress =
                `${row.begin_num} - ${row.end_num} ${row.dir} ${row.street_name} ${row.suffix}`.toUpperCase();
        }

        if (row.loop_num === prevLoopNum || prevLoopNum === '-1') {
            // collect addresses on same loop (or first street) into streetsOnLoop[]
            prevLoopNum = row.loop_num;
            streetsOnLoop.push(streetAddress);
        } else {
            // Add collected addresses (streetsOnLoop[]) on same loop to formatted data, now that weve reached new loop #
            formattedData.set(prevLoopNum, streetsOnLoop);
            streetsOnLoop = [];
            streetsOnLoop.push(streetAddress);
            prevLoopNum = row.loop_num;
        }
    }
    // and add last loop too
    formattedData.set(prevLoopNum, streetsOnLoop);

    return formattedData;
}
