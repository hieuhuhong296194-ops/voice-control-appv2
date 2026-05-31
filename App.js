import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('Nhập lệnh hoặc nói...');
  const [logs, setLogs] = useState([]);

  const commands = {
    'xin chào': 'Xin chào anh!',
    'mấy giờ rồi': new Date().toLocaleTimeString('vi-VN'),
    'hôm nay thứ mấy': new Date().toLocaleDateString('vi-VN',{weekday:'long'}),
    'mở camera': 'Đang mở Camera...',
    'mở cài đặt': 'Đang mở Cài đặt...',
    'cảm ơn': 'Không có gì ạ!',
  };

  const handleCommand = (text) => {
    const t = text.toLowerCase();
    let found = false;
    for (const [key, val] of Object.entries(commands)) {
      if (t.includes(key)) {
        respond(val); found = true; break;
      }
    }
    if (!found) respond(`Không hiểu: "${text}"`);
    setInput('');
  };

  const respond = (msg) => {
    setResult(msg);
    setLogs(p => [`${new Date().toLocaleTimeString('vi-VN')}: ${msg}`, ...p].slice(0,15));
    Speech.speak(msg, { language: 'vi-VN' });
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>🎙️ Voice Control</Text>
      <View style={s.resultBox}>
        <Text style={s.resultText}>{result}</Text>
      </View>
      <TextInput
        style={s.input}
        value={input}
        onChangeText={setInput}
        placeholder="Nhập lệnh tiếng Việt..."
        placeholderTextColor="#666"
        onSubmitEditing={() => handleCommand(input)}
      />
      <TouchableOpacity style={s.btn} onPress={() => handleCommand(input)}>
        <Text style={s.btnText}>▶ Thực hiện lệnh</Text>
      </TouchableOpacity>
      <ScrollView style={s.log}>
        <Text style={s.label}>Nhật ký:</Text>
        {logs.map((l,i) => <Text key={i} style={s.logText}>{l}</Text>)}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#0f0f1a',padding:20,paddingTop:50},
  title:{fontSize:26,fontWeight:'bold',color:'#fff',textAlign:'center',marginBottom:20},
  resultBox:{backgroundColor:'#16213e',borderRadius:12,padding:15,marginBottom:20,minHeight:60,justifyContent:'center'},
  resultText:{color:'#fff',fontSize:16,textAlign:'center'},
  input:{backgroundColor:'#1a1a2e',borderRadius:12,padding:14,color:'#fff',fontSize:15,marginBottom:12,borderWidth:1,borderColor:'#333'},
  btn:{backgroundColor:'#4a00e0',borderRadius:12,padding:14,alignItems:'center',marginBottom:20},
  btnText:{color:'#fff',fontSize:15,fontWeight:'bold'},
  log:{flex:1,backgroundColor:'#1a1a2e',borderRadius:12,padding:10},
  label:{color:'#666',fontSize:12,marginBottom:4},
  logText:{color:'#aaa',fontSize:12,marginBottom:3},
});
