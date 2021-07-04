import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TVEventHandler,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StatusBar,
  TouchableHighlight,
} from 'react-native';
import Video from 'react-native-video';


// GLOBAL STYLESHEET
const styles = StyleSheet.create({
  parent: {
    flex:1, 
    width:'100%'
  },
  body: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    padding: 0 
  },
  videoContainer: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  video: {
    position:'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttons: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10, 
    position: 'absolute', 
    opacity: 0
  },
  text: {
    fontSize: 20,
    color: '#ffffff'
  }
});
  
const Item = ({item, index, showList, onSelect}) => {
  const [focusedState, setFocusedState] = useState(false);
  useEffect(()=>{
  },[focusedState])
  
  return(
    <TouchableHighlight key={index} 
    style={{
      backgroundColor:focusedState? "#141745" : "#33322e", padding:1.5,
      opacity:focusedState?1:0.5
    }}
    onFocus={()=>{setFocusedState(true)}}
    onBlur={()=>{setFocusedState(false)}}
    onPress={() => {!showList ? onSelect(index): null}}
    >
      <View>
        <Text style={styles.text}>{item}</Text>
      </View>
    </TouchableHighlight>
  )
}
  

class VideoPlayer extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      dataLoad: true,
      channel: 0,
      showList: false,
      showToolbar: true,
      loading: false,
      error: false,
      errorLog: ''
    }
    
    this.list = React.createRef();
    this._enableTVEventHandler = this._enableTVEventHandler.bind(this)
    this._onSelect = this._onSelect.bind(this)
  }
    
    
      // TV EVENT HANDLING 
  _tvEventHandler;
  _backHandler;
    
  _enableTVEventHandler() {
    
    this._backHandler = BackHandler.addEventListener('hardwareBackPress', this.backEventListener.bind(this));
    
    this._tvEventHandler = new TVEventHandler();
    this._tvEventHandler.enable(this, function(cmp, evt) {
    
      if(evt && evt.eventType === 'right' && evt.eventKeyAction == 0) {
        if(cmp.state.channel < cmp.props.totalChannels) {
          cmp.setState({
            channel: ++cmp.state.channel,
            showList: false
          });
        }
        else cmp.setState({
          channel: 0,
          showList: false
        }); 
      }
    
      else if(evt && evt.eventType === 'left' && evt.eventKeyAction == 0) {
        if(cmp.state.channel == 0) {
          cmp.setState({
            channel: cmp.props.totalChannels,
            showList: false
          });
        }
        else
          cmp.setState({
            channel: cmp.state.channel-1,
            showList: false
          });
      }
    
      else if(evt && evt.eventType === 'select' && evt.eventKeyAction == 0) {
        cmp.setState({
          showList: !cmp.state.showList
        })
      }
    
    });
  }
    
  _disableTVEventHandler() {
    if(this._tvEventHandler) {
      this._backHandler.remove();
      this._tvEventHandler.disable();
      delete this._tvEventHandler;
    }
  }
    
    
  componentDidMount() {
    this._enableTVEventHandler();
  }

  componentWillUnmount() {
    this._disableTVEventHandler();
  }  
  
  // UTILITY FUNCTIONS
  onLoad = () => {
    this.setState({
      loading: true,
      error: false,
      showToolbar: false
    })
  }    
  onError = () => {
    this.setState({
      error: true,
      loading: false,
      showToolbar: false
    })
  }
  onLoadComplete = () => {
    this.setState({
      showToolbar: true,
      error: false,
      loading: false,
    })
    setTimeout(() => {
      this.setState({
      showToolbar: false,
    })
    }, 3000)
  }
    
      
  // OVERRIDE BACK BUTTON FUNCTIONALITY
  backEventListener(event) {
    if (this.state.showList) {
      this.setState({showList:false})
      return true
    }
    return false
  }
    
  _onSelect(pos) {
    this.setState({
      channel: pos
    })
  }
    
  _ListComponent() {
    return(
      this.props.ChannelsName.map((item, index) => (
        <Item key={index} item={item} index={index} showList={this.state.showList} onSelect={this._onSelect}/>
      ))
    )
  }
    
    
    
  // MAIN RENDER FUNCTION
  render() {  
    if (this.state.dataLoad) {
      return (
        <>
        
        <SafeAreaView style={styles.parent}>
              
          <StatusBar hidden={true} />
              
          <View style={styles.body}>
            <View style={styles.videoContainer}>
                  
              <ScrollView style={{
              backgroundColor: 'gray', width:300, left:0, top:0, 
              position:this.state.showList?'absolute':'relative',
              display: this.state.showList ? 'flex':'none', height: '100%',
              zIndex: 2
              }}
            >
              {this._ListComponent()}
            </ScrollView>
     
            {this.state.showToolbar ? 
              <View style={{ backgroundColor:'rgba(0,0,0,0.3)', 
              alignSelf:'flex-start', padding:15,
              position: 'absolute', left: 0, bottom: 50, zIndex: 1}}
              >
                <Text style={{color:'white', fontSize: 40}}>
                  {this.props.ChannelsName[this.state.channel]}
                </Text>
              </View> : null
            }
                    
            {this.state.loading ? 
              <View style={{backgroundColor:'black', position:'absolute', padding:10}}>
                <ActivityIndicator size='large' color='#ffffff'/>
              </View> : null 
            }
                    
            {this.state.error ?  
              <View style={{backgroundColor: 'gray', position:'absolute', padding:5 }}>
                <Text style={{color:'white', fontSize:30}}>Error loading video {'\n'} 
                  Check your internet connection and try again {'\n'}
                  {this.state.errorLog}
                </Text>
              </View> : null
            }
    
            <Video source={{uri: this.props.ChannelsList[this.state.channel]}} style={styles.video} 
            onError={this.onError} onLoadStart={this.onLoad} 
            onLoad={this.onLoadComplete}
            minLoadRetryCount={0} resizeMode='stretch'
            bufferConfig={{
              minBufferMs: 15000,
              maxBufferMs: 50000,
              bufferForPlaybackMs: 10,
              bufferForPlaybackAfterRebufferMs: 1000
            }} />


                  
            </View>
                  
            </View>
          </SafeAreaView>
      
        </>
      );
    }
  }
}

export default VideoPlayer;