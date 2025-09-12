import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, text, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import songs from './model/data';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [sound, setSound] = useState(null);
  const [songIndex, setSongIndex] = useState(0);
  const [songStatus, setSongStatus] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const songSlider = useRef(null);
  const  scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    scrollX.addListener(({value}) => {
      console;log(`ScrollX : ${value}`);
      const index = Math.round(value / width);
      console.log(index);
    });
  })

  const renderSongs = ({ item, index }) => {
    return (
      <View style={styles.mainImageWrapper}>
        <View style={[styles.imageWrapper, styles.elevation]}>
          <Image source={item.artwork} style={styles.musicImage}/>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>

      <Animated.FlatList
        data={songs}
        renderItem={renderSongs}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent : {
                contentOffset : { x : scrollX }
              }
            }
          ],
          { useNativeDriver: true }
        )}
      />

      <View>
        <Text style={[styles.songContent, styles.songTitle]}>
          {songs[songIndex].title}
        </Text>
        <Text style={[styles.songContent, styles.songArtist]}>
          {songs[songIndex].artist}
        </Text>
      </View>

      <View>
        <Slider 
          style={styles.progressBar}
          value={10}
          minimumValue={0}
          maximumValue={100}
          thumbTintColor='#FFD369'
          minimunTrackTintColor='#FFD369'
          maximumTrackTintColor='#fff'
          onSlidingComplete={() =>{}}
        />
        <View style={styles.progressLevelDuration}>
          <Text style={styles.progressLabelText}>00:00</Text>
          <Text style={styles.progressLabelText}>00:00</Text>
        </View>
      </View>

        <View style={styles.musicControlsContainer}>
          <TouchableOpacity>  
            <Ionicons name='play-skip-back-outline' size ={35} color='#FFD369'/>
          </TouchableOpacity>
          <TouchableOpacity>  
            <Ionicons name={isPlaying?'pause-circle' : 'play-circle'} size ={75} color='#FFD369'/>
          </TouchableOpacity>
          <TouchableOpacity>  
            <Ionicons name='play-skip-forward-outline' size ={35} color='#FFD369'/>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.footer}>
        <View style={styles.iconWrapper}>
        <TouchableOpacity>
          <Ionicons name='heart-outline' size={30} color="#888888"/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name='repeat' size={30} color="#888888"/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name='share-outline' size={30} color="#888888"/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name='ellipsis-horizontal' size={30} color="#888888"/>
        </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    width: width,
  },
  main: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainImageWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    width: width,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 40,
    borderTopColor: '#393E45',
    borderTopWidth: 1
  },
  iconWrapper:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  imageWrapper:{
    width: 340,
    height: 360,
    marginVertical: 20,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,
    shadowOffset: {
      width: 5,
      height: 5
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },  
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },
  progressBar:{
    width: 340,
    height: 40,
    marginTop: 20,
  },
  progressLevelDuration:{
    width: 340,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#fff',
    fontWeight: '500',
  }, 
  musicControlsContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginVertical: 20,
  }
});