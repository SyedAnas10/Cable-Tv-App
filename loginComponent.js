import React, { useRef, useState } from 'react';
import { 
    ActivityIndicator, 
    AsyncStorage, 
    StyleSheet, 
    Text, 
    TextInput, 
    TouchableHighlight, 
    View 
} from 'react-native';

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#141413',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        color: '#ffffff', 
        fontSize: 30
    },
    button: {
        padding: 10
    }
})

const _storeData = async (user, pass) => {
    const credentials = {'user': user, 'pass': pass}
    try {
        await AsyncStorage.setItem('userName', user);
        await AsyncStorage.setItem('password', pass);
    } catch(error) {
        console.log('Error saving data')
    }
}

const Login = (props) => {

    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const [focusedInput, setFocus] = useState('')
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verifying, isVerifying] = useState(false);

    const setCredentials = () => {
        isVerifying(true)
        _storeData(userName, password)
        props.setUserName(userName)
        props.setPassword(password)
    }

    return (
        <View style={styles.body}>
            <TouchableHighlight onPress={()=>usernameRef.current?.focus()} hasTVPreferredFocus={true}
            onFocus={()=>setFocus('user')}
            >
                <TextInput 
                    ref={usernameRef} style={{height: 60}} style={{color:focusedInput=='user'?'red':'#ffffff'}}
                    onChangeText={text=>setUsername(text)}
                    placeholder="Enter Username" placeholderTextColor={focusedInput=='user'?'red':'#ffffff'}
                >
                    <Text>{userName}</Text>
                </TextInput>
            </TouchableHighlight>

            <TouchableHighlight onPress={()=>passwordRef.current?.focus()} hasTVPreferredFocus={false}
            onFocus={()=>setFocus('pass')}>
                <TextInput
                    ref={passwordRef} style={{height:60}} style={{color:focusedInput=='pass'?'red':'#ffffff'}}
                    onChangeText={text=>setPassword(text)} 
                    placeholder="Enter Password" placeholderTextColor={focusedInput=='pass'?'red':'#ffffff'}
                >
                    <Text>{password}</Text>
                </TextInput>
            </TouchableHighlight>

            <TouchableHighlight onPress={()=>setCredentials()} hasTVPreferredFocus={false}
            style={[styles.button, {backgroundColor:focusedInput=='submit'?'red':'#000000'}]}
            onFocus={()=>setFocus('submit')}
            >
                <Text style={styles.input}>Login</Text>
            </TouchableHighlight>

            <Text style={styles.input}>
                Logging in might take a while!
            </Text>

            {verifying? 
            <View style={styles.button}>
                <Text style={styles.input}>
                    This might be the wrong password! Try Again.
                </Text>
            </View>
            :null}


        </View>
    )
    
}

export default Login;