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
                })
                return;
            }

            address = address.trim().toLowerCase();
            address = address.replace(/\./g, ''); // remove any dots if present

            // street name may be multiple words
            const streetName = address.split(' ').slice(2, -1).join(' ');
            const suffixName = address.split(' ').slice(-1)[0];

            const dbResult: Schema | null = await db.getFirstAsync(
                'SELECT loop_num, route_num FROM street_loops WHERE street_name = ? AND suffix = ? AND ? BETWEEN begin_num AND end_num',
                [
                    // address.split(' ')[0],
                    // address.split(' ')[1],
                    // address.split(' ')[2],
                    streetName,
                    suffixName,
                    address.split(' ')[0],
                ],
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
        } catch (error) {
            console.error('Database error:', error);
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
