import React, { useEffect, useState } from 'react';
import { AsyncStorage, LogBox } from 'react-native';
import Login from './loginComponent';
import VideoPlayer from './videoPlayer';
import LoadingComponent from './loadingComponent';
import ErrorComponent from './errorComponent';

LogBox.ignoreAllLogs();

// SERVER ADDRESS
const server = 'https://tv-backend-server.herokuapp.com/';

// APP COMPONENT
const App = () => {

  const _getData = async () => {
    try {
      const user = await AsyncStorage.getItem('userName');
      const pass = await AsyncStorage.getItem('password');
      setUserName(user);
      setPassword(pass);
      isCredLoad(true);
    } catch (error) {}
  }

  const LoadResources = async () => {
    await fetch(server+'links').then(response=>response.json())
    .then(result=>{
      setList(result.links);
      setName(result.names);
      setCloudUser(result.user);
      setCloudPass(result.pass);
      if (channelList.length===0){
        isDataLoad(false)
      }
      else {
        isDataLoad(true)
        isNetError(false)
        _getData()
      }
    }).catch(err=>{
      console.log('Error! '+err)
      isDataLoad(true);
      isNetError(true);
      setTimeout(()=>LoadResources(), 5000)
    })
  }


  const [channelList, setList] = useState([]);
  const [channelName, setName] = useState([]);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [cloudUser, setCloudUser] = useState('1');
  const [cloudPass, setCloudPass] = useState('1');
  const [dataLoad, isDataLoad] = useState();
  const [credLoad, isCredLoad] = useState(false);
  const [netError, isNetError] = useState(false);
  useEffect(()=>{
    LoadResources()
  }, [dataLoad])
  


  if(dataLoad && userName===cloudUser && password===cloudPass) {
    return(
        <VideoPlayer ChannelsList={channelList} ChannelsName={channelName} totalChannels={channelList.length-1}/>
    )
  }
  else if(dataLoad && credLoad && (userName!==cloudUser || password!=cloudPass)) {
    return(
      <Login setUserName={setUserName} setPassword={setPassword} />
    )
  }
  else if(dataLoad && netError) {
    return(
      <ErrorComponent />
    )
  }
  else {
    return (
      <LoadingComponent />
    )
  }
  
}

export default App;
