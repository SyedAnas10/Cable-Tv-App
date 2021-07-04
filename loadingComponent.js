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
        paddingBottom: 20
    }
})

const LoadingComponent = () => {

    return(
        <View style={styles.body}>
            <Text style={styles.text}>Verifying UserName and Password</Text>
            <ActivityIndicator size='large' color='#ffffff' />
        </View>
    )
}

export default LoadingComponent;