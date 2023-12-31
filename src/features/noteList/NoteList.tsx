import React, {useState, useEffect} from 'react';
import {Text, View, Image, TouchableOpacity, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@realm/react';

import * as Navigation from 'navigation/Navigation';

import images from 'assets/images';
import strings from 'assets/strings';

import styles from './styles';

import {Note} from 'db/Note';

function NoteList() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const allNotes = useQuery(Note);

  useEffect(() => {
    getUserData();
  });

  const getUserData = async() => {
    const name = await AsyncStorage.getItem("name");
    const email = await AsyncStorage.getItem("email");

    setName(name);
    setEmail(email);
  }

  const logout = async() => {
    await AsyncStorage.clear().then(() => {
      Navigation.replace('Login');
    });
  }

  const addNote = () => {
    Navigation.navigate('AddNote');
  }

  const noteDetail = (id) => {
    Navigation.navigate('NoteDetail', {id});
  }

  const renderItem = (item) => (
    <TouchableOpacity
      onPress={() => noteDetail(item._id)}
      style={styles.item}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      
      <Text
        style={styles.noteContent}
        ellipsizeMode='tail'
        numberOfLines={2}
      >
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={logout}>
          <Image
            style={styles.cta}
            source={images.logout}
            resizeMode='contain'
          />
        </TouchableOpacity>

        <View style={styles.containerWelcome}>
          <Text style={styles.welcome}>{`Welcome, ${name}`}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>

      <View style={styles.containerTitle}>
        <Text style={styles.title}>{strings.note_list}</Text>

        <TouchableOpacity onPress={addNote}>
          <Image
            style={styles.cta}
            source={images.add}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={allNotes}
        renderItem={({item}) => renderItem(item)}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default NoteList;