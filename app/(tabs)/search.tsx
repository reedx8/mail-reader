import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../../db/index';

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

export default function Search() {
    const [address, setAddress] = useState<string>('');
    const [result, setResult] = useState<any>({
        route: 0,
        loop: '',
    });

    async function lookUpAddressInDb(address: string) {
        try {
            if (address === '' || address === null || address === undefined) {
                setResult({
                    route: 0,
                    loop: '',
                });
                return;
            }

            address = address.trim().toLowerCase();
            address = address.replace(/\./g, ''); // remove any dots if present

            // try assuming user inputs full address (street number + dir + steet name + suffix)
            // const dir = address.split(' ')[1]; // only used in 2nd attempt
            const streetNum = address.split(' ')[0];
            let streetName = address.split(' ').slice(2, -1).join(' '); // street name my be multiple words
            const suffixName = address.split(' ').slice(-1)[0];

            let dbResult: Schema | null = await db.getFirstAsync(
                'SELECT loop_num, route_num FROM street_loops WHERE street_name = ? AND suffix = ? AND ? BETWEEN begin_num AND end_num',
                [streetName, suffixName, streetNum],
            );

            if (dbResult) {
                setResult({
                    route: dbResult.route_num,
                    loop: dbResult.loop_num,
                });
            } else {
                // try again if user inputs partial address (eg street number + name or street number + name + suffix)
                if (!checkForDir(address) && !checkForSuffix(address)) {
                    // 1. check for only number + name
                    streetName = address.split(' ').slice(1).join(' ');
                } else if (checkForDir(address) && !checkForSuffix(address)) {
                    // 2. check for number + dir + name
                    if (address.split(' ').length === 3) {
                        streetName = address.split(' ').slice(2).join(' ');
                    }
                } else if (!checkForDir(address) && checkForSuffix(address)) {
                    // check for number + name + suffix
                    streetName = address.split(' ').slice(1, -1).join(' ');
                }

                dbResult = await db.getFirstAsync(
                    'SELECT loop_num, route_num FROM street_loops WHERE street_name = ? AND ? BETWEEN begin_num AND end_num',
                    [streetName, streetNum],
                );

                if (dbResult) {
                    setResult({
                        route: dbResult.route_num,
                        loop: dbResult.loop_num,
                    });
                } else {
                    setResult({
                        route: -1,
                        loop: '',
                    });
                }
            }
        } catch (error) {
            console.error('Database error:', error);
            setResult({
                route: -1,
                loop: '',
            })
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                // value={address}
                onChangeText={(text) => setAddress(text)}
                style={styles.input}
                placeholder='Search for an address'
                // autoComplete={'address-line1'}
                autoComplete={'off'}
                clearButtonMode={'always'}
                // clearTextOnFocus={true}
                inputMode={'search'}
                onSubmitEditing={() => {
                    lookUpAddressInDb(address);
                    setAddress('');
                }}
                // minimize keyboard on press out
                // onPressOut={}
                returnKeyType={'search'}
                // enablesReturnKeyAutomatically={true}
                // selectTextOnFocus={true}
            />
            <View style={styles.header}>
                {result.route > 0 && (
                    <>
                        <Text style={styles.headerText}>
                            Route {result.route === 0 ? '' : result.route}
                        </Text>
                        <Text style={styles.subHeaderText}>
                            Loop {result.loop === 0 ? '' : result.loop}
                        </Text>
                    </>
                )}
                {result.route === -1 && (
                    <Text style={styles.subHeaderText}>No results found</Text>
                )}
            </View>
        </View>
    );
}
function checkForSuffix(address: string) {
    let suffix = address.split(' ').slice(-1)[0];

    if (suffix === 'steet' || suffix === 'st') {
        suffix = 'st';
        // return suffix;
        return true;
    } else if (suffix === 'avenue' || suffix === 'ave') {
        suffix = 'ave';
        // return suffix;
        return true;
    } else if (suffix === 'boulevard' || suffix === 'blvd') {
        suffix = 'blvd';
        // return suffix;
        return true;
    } else if (suffix === 'drive' || suffix === 'dr') {
        suffix = 'dr';
        // return suffix;
        return true;
    } else if (suffix === 'road' || suffix === 'rd') {
        suffix = 'rd';
        // return suffix;
        return true;
    } else if (suffix === 'lane' || suffix === 'ln') {
        suffix = 'ln';
        // return suffix;
        return true;
    } else if (suffix === 'place' || suffix === 'pl') {
        suffix = 'pl';
        // return suffix;
        return true;
    } else if (suffix === 'court' || suffix === 'ct') {
        suffix = 'ct';
        return suffix;
    } else if (suffix === 'circle' || suffix === 'cir') {
        suffix = 'cir';
        // return suffix;
        return true;
    } else if (suffix === 'highway' || suffix === 'hwy') {
        suffix = 'hwy';
        // return suffix;
        return true;
    } else if (suffix === 'terrace' || suffix === 'ter') {
        suffix = 'ter';
        // return suffix;
        return true;
    } else {
        // return 'none';
        return false;
    }
}

function checkForDir(address: string) {
    let dir = address.split(' ').slice(1, 2)[0];

    if (dir === 'north' || dir === 'n') {
        dir = 'n';
        // return dir;
        return true;
    } else if (dir === 'south' || dir === 's') {
        dir = 's';
        // return dir;
        return true;
    } else if (dir === 'east' || dir === 'e') {
        dir = 'e';
        // return dir;
        return true;
    } else if (dir === 'west' || dir === 'w') {
        dir = 'w';
        // return dir;
        return true;
    } else if (dir === 'northeast' || dir === 'ne') {
        dir = 'ne';
        // return dir;
        return true;
    } else if (dir === 'northwest' || dir === 'nw') {
        dir = 'nw';
        // return dir;
        return true;
    } else if (dir === 'southeast' || dir === 'se') {
        dir = 'se';
        // return dir;
        return true;
    } else if (dir === 'southwest' || dir === 'sw') {
        dir = 'sw';
        // return dir;
        return true;
    } else {
        // return 'none';
        return false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#25292e',
        paddingTop: 75,
    },
    // text: {
    //     color: '#fff',
    //     fontSize: 20,
    // },
    input: {
        borderWidth: 1,
        padding: 10,
        borderColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 30,
        fontSize: 25,
        color: '#fff',
    },
    header: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 50,
        // justifyContent: 'center',
    },
    headerText: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
    },
    subHeaderText: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'ultralight',
    },
});
