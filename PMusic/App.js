import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, text, Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
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
      const index = Math.round(value / width);
      //console;log(`ScrollX : ${value}`);
      //console.log(index);
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
  };

const loadSound = async () => {
  const { sound } = await Audio.Sound.createAsync(songs[songIndex].url);
  setSound(sound);
  const status = await sound.getStatusAsync();
  status.isLooping = isLooping;
  await sound.setIsLoopingAsync(isLooping);
  setSongStatus(status);
  setIsPlaying(false);
}

useEffect(() => {
  if (sound) {
    sound.unloadAsync();
  }
  loadSound();
  return () => {
    if (sound) {
      sound.unloadAsync();
    }
  };
}, [songIndex]);

const play = async () => {
  if (sound) {
    setIsPlaying(true);
    await sound.playAsync();
  }
}

const pause = async () => {
  if (sound) {
    setIsPlaying(false);
    await sound.pauseAsync();
  }
}


const handlePlayPause = async () => {
  if (isPlaying) {
    await pause();
  } else {
    await play();
  }
}

const stop = async () => {
  if (sound) {
    await sound.stopAsync();
    sound.unloadAsync();
    await loadSound();
  }
}

const skipToPrevious = () => {
  songSlider.current.scrollToOffset({
    offset: (songIndex - 1) * width
  })
}

const skipToNext = () => {
  songSlider.current.scrollToOffset({
    offset: (songIndex + 1) * width
  })
}

const updatePosition = async () => {
  if (sound && isPlaying) {
    const status = await sound.getStatusAsync();
    setSongStatus(status);
    if (status.positionMillis == status.durationMillis) {
      if (!isLooping) await stop();
    }
  }
}

useEffect(() => {
  const intervalId = setInterval(updatePosition, 500);
  return () => clearInterval(intervalId);
}, [sound, isPlaying])

const repeat = async (value) => {
  setIsLooping(value);
  await sound.setIsLoopingAsync(value);
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.main}>

      <Animated.FlatList
        ref={songSlider}
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
          value={songStatus ? songStatus.positionMillis : 0}
          minimumValue={0}
          maximumValue={songStatus ? songStatus.durationMillis : 0}
          thumbTintColor='#FFD369'
          minimunTrackTintColor='#FFD369'
          maximumTrackTintColor='#fff'
          onSlidingComplete={(value) =>{
            sound.setPositionAsync(value)
          }}
        />
        <View style={styles.progressLevelDuration}>
          <Text style={styles.progressLabelText}>
            {songStatus ? (
              `${Math.floor(songStatus.positionMillis / 1000 / 60)}:${String(Math.floor(songStatus.positionMillis / 1000 % 60)).padStart(2,"0")}`
              ) : "00:00"}
          </Text>
          <Text style={styles.progressLabelText}>
          {songStatus ? (
              `${Math.floor(songStatus.durationMillis / 1000 / 60)}:${String(Math.floor(songStatus.durationMillis / 1000 % 60)).padStart(2,"0")}`
              ) : "00:00"}  
          </Text>
        </View>
      </View>

        <View style={styles.musicControlsContainer}>
          <TouchableOpacity onPress={skipToPrevious}>  
            <Ionicons name='play-skip-back-outline' size ={35} color='#FFD369'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayPause}>  
            <Ionicons name={isPlaying?'pause-circle' : 'play-circle'} size ={75} color='#FFD369'/>
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>  
            <Ionicons name='play-skip-forward-outline' size ={35} color='#FFD369'/>
          </TouchableOpacity>
        </View>

      </View>
      <View style={styles.footer}>
        <View style={styles.iconWrapper}>
        <TouchableOpacity>
          <Ionicons name='heart-outline' size={30} color="#888888"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { repeat(!isLooping) }}>
          <Ionicons name='repeat' size={30} color={isLooping ? "#ffffff" : "#888888"}/>
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