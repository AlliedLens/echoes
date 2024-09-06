import React, { useState } from 'react';
import { View, Button, Image, TextInput, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const testCode = () => {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled){
      setImage(result.assets[0].uri);

    }

  };

  const uploadContact = async () => {
    if (!image || !name) {
      setMessage('Please select an image and enter a name.');
      return;
    }

    let localUri = image;
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('file', { uri: localUri, name: filename, type });
    formData.append('name', name);

    const response = await fetch('http://0.0.0.0:5000/register', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = await response.json();
    setMessage(response.ok ? 'Contact uploaded successfully!' : 'Failed to upload contact.');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Enter contact name"
        value={name}
        onChangeText={setName}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: '80%' }}
      />
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginTop: 10 }} />}
      <Button title="Upload Contact" onPress={uploadContact} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

export default testCode;
