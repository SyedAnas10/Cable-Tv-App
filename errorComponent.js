import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#141413',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 30,
        color: '#ffffff',
    }
})

const ErrorComponent = () => {

    return(
        <View style={styles.body}>
            <Text style={styles.text}>Network Error! Please check your internet connection</Text>
        </View>
    )
}

export default ErrorComponent;