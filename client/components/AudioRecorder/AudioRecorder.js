import React, { useState } from 'react';
import { Button, Text, View } from '@rneui/themed';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { request, PERMISSIONS } from 'react-native-permissions';

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordPath, setRecordPath] = useState(null);

  const onStartRecord = async () => {
    const permission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
    if (permission === 'granted') {
      const path = 'audio_record.mp4';
      const uri = await audioRecorderPlayer.startRecorder(path);
      setRecordPath(uri);
      setIsRecording(true);
    }
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    setIsRecording(false);
    setRecordPath(result);
  };

  return (
    <View>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? onStopRecord : onStartRecord}
      />
      {recordPath && <Text>Recording saved at: {recordPath}</Text>}
    </View>
  );
};

export default AudioRecorder;
