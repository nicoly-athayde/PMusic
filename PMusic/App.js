import { StatusBar } from 'expo-status-bar';
import { Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styçes.main}>

      </View>
      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons name='heart-outline' size={30} color="#888888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name='repeat' size={30} color="#888888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name='share-outline' size={30} color="#888888" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name='ellipsis-horizontal' size={30} color="#888888" />
        </TouchableOpacity>
      </View>
     <StatusBar style="light" />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222831',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
