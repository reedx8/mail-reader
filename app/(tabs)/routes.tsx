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
};

type PickerSchema = {
    label: string;
    value: number;
};

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

                if (data) {
                    let prevLoopNum = '-1';
                    let streetsOnLoop = [];

                    // let prevStreet = '';
                    // let prevStretsNumbers = [];

                    const formattedData = new Map<string, string[]>();

                    // Iterate over every record (row) in Loops table
                    for (const row of data as LoopsSchema[]) {
                        // console.log(row.loop_num)
                        let streetAddress = '';

                        // format street address depending on if 1 address or an address range
                        if (row.begin_num === row.end_num) {
                            // 1 address
                            streetAddress = `${row.begin_num} ${row.dir} ${row.street_name} ${row.suffix}`.toUpperCase();
                        } else {
                            // address range
                            streetAddress = `${row.begin_num} - ${row.end_num} ${row.dir} ${row.street_name} ${row.suffix}`.toUpperCase();
                        }

                        if (
                            row.loop_num === prevLoopNum ||
                            prevLoopNum === '-1'
                        ) {
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
                    formattedData.set(prevLoopNum, streetsOnLoop)

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
            <ScrollView style={{ width: '100%', height: "100%" }}>
                {[...currentLoops.entries()].map(([loopNum, streets]) => (
                    <View key={loopNum} style={styles.loopRow}>
                        <Text style={styles.loopNumText}>Loop {loopNum}:</Text>
                        {streets.map((street: any, index: any) => (
                            <Text style={styles.streetText} key={index}>
                                {street}
                            </Text>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

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
        fontWeight: '100'
    },
    loopNumText : {
        color: 'white',
        fontSize: 26,
    },
    loopRow: {
        marginBottom: 10
    }
});
