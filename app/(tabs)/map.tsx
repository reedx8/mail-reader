import { StyleSheet, Text, View } from "react-native";

export default function Map() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map Page</Text>
        </View>
    )
};

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
});