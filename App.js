import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { WebView } from 'react-native-webview';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState('Chờ lệnh...');
  const [isListening, setIsListening] = useState(false);
  const [logs, setLogs] = useState([]);
  const webviewRef = useRef(null);

  const commands = {
    'xin chào': () => respond('Xin chào anh!'),
    'mấy giờ rồi': () => respond(`Bây giờ là ${new Date().toLocaleTimeString('vi-VN')}`),
    'hôm nay thứ mấy': () => respond(`Hôm nay là ${new Date().toLocaleDateString('vi-VN', {weekday:'long'})}`),
    'mở camera': () => respond('Đang mở Camera...'),
    'mở cài đặt': () => respond('Đang mở Cài đặt...'),
    'tăng âm lượng': () => respond('Đang tăng âm lượng...'),
    'giảm âm lượng': () => respond('Đang giảm âm lượng...'),
    'cảm ơn': () => respond('Không có gì ạ!'),
  };

  const handleCommand = (text) => {
    setTranscript(text);
    let found = false;
    for (const [key, action] of Object.entries(commands)) {
      if (text.toLowerCase().includes(key)) { action(); found = true; break; }
    }
    if (!found) respond(`Không hiểu: "${text}"`);
  };

  const respond = (msg) => {
    setResult(msg);
    setLogs(p => [`${new Date().toLocaleTimeString('vi-VN')}: ${msg}`, ...p].slice(0,15));
    Speech.speak(msg, { language: 'vi-VN' });
  };

  const html = `<html><body><script>
    var r = new webkitSpeechRecognition();
    r.lang='vi-VN'; r.continuous=false;
    r.onresult=function(e){window.ReactNativeWebView.postMessage(e.results[0][0].transcript)};
    function start(){r.start()} function stop(){r.stop()}
  </script></body></html>`;

  return (
    <View style={s.container}>
      <Text style={s.title}>🎙️ Voice Control</Text>
      <WebView ref={webviewRef} source={{html}} style={{height:0,width:0}}
        onMessage={e=>handleCommand(e.nativeEvent.data)} javaScriptEnabled/>
      <View style={s.box}>
        <Text style={s.label}>Đã nghe:</Text>
        <Text style={s.blue}>{transcript||'...'}</Text>
      </View>
      <View style={s.result}>
        <Text style={s.white}>{result}</Text>
      </View>
      <TouchableOpacity style={[s.mic, isListening&&s.micOn]}
        onPressIn={()=>{setIsListening(true);webviewRef.current?.injectJavaScript('start();true;')}}
        onPressOut={()=>{setIsListening(false);webviewRef.current?.injectJavaScript('stop();true;')}}>
        <Text style={{fontSize:36}}>{isListening?'🔴':'🎙️'}</Text>
        <Text style={s.white}>{isListening?'Đang nghe...':'Giữ để nói'}</Text>
      </TouchableOpacity>
      <ScrollView style={s.log}>
        <Text style={s.label}>Nhật ký:</Text>
        {logs.map((l,i)=><Text key={i} style={s.logText}>{l}</Text>)}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#0f0f1a',padding:20,paddingTop:50},
  title:{fontSize:26,fontWeight:'bold',color:'#fff',textAlign:'center',marginBottom:20},
  box:{backgroundColor:'#1a1a2e',borderRadius:12,padding:15,marginBottom:10},
  label:{color:'#666',fontSize:12,marginBottom:4},
  blue:{color:'#00d4ff',fontSize:16},
  result:{backgroundColor:'#16213e',borderRadius:12,padding:15,marginBottom:20,minHeight:55,justifyContent:'center'},
  white:{color:'#fff',fontSize:16,textAlign:'center'},
  mic:{backgroundColor:'#4a00e0',borderRadius:100,width:130,height:130,alignSelf:'center',justifyContent:'center',alignItems:'center',marginBottom:20,elevation:8},
  micOn:{backgroundColor:'#e00040'},
  log:{flex:1,backgroundColor:'#1a1a2e',borderRadius:12,padding:10},
  logText:{color:'#aaa',fontSize:12,marginBottom:3},
});
