import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Alert,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: true, // Reanimated runs in strict mode by default
});

GoogleSignin.configure({
  webClientId: '1061066222675-jvt6ob80rvjuva0qknmhnh76gf5jve6i.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: '1061066222675-gjbsfevvduqbbv499i15i92ir1bm3o2a.apps.googleusercontent.com',
});

export default function HomeScreen() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();

  const slideAnimLogo = useRef(new Animated.Value(100)).current;
  const slideAnimSubtitle = useRef(new Animated.Value(100)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      setUserInfo(user);

      const { accessToken, idToken } = await GoogleSignin.getTokens();
      if (!idToken || !accessToken) {
        throw new Error('Missing token(s)');
      }

      await AsyncStorage.setItem('accessToken', accessToken);
      router.push('/ScheduleScreen');
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            Alert.alert('Sign-in already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Google Play Services not available');
            break;
          default:
            Alert.alert('Google Sign-In Error', error.message);
        }
      } else {
        Alert.alert('Unknown Error', String(error));
      }
    }
  };

  useEffect(() => {
    Animated.timing(slideAnimLogo, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnimSubtitle, {
      toValue: 0,
      duration: 1400,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -18,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Animated.View style={[styles.titleWrapper, { transform: [{ translateY: slideAnimLogo }] }]}>
          <Image
            source={require('../../assets/images/tinytasks-title.png')}
            style={styles.titleImage}
          />
        </Animated.View>

        <Animated.View style={[styles.subtitleWrapper, { transform: [{ translateY: slideAnimSubtitle }] }]}>
          <Image
            source={require('../../assets/images/secondary-title.png')}
            style={styles.subtitleImage}
          />
        </Animated.View>

        <View style={styles.logoWrapperContainer}>
          <Animated.View style={[styles.logoWrapper, { transform: [{ translateY: bounceAnim }] }]}>
            <Image
              source={require('../../assets/images/favicon.png')}
              style={styles.logoImage}
            />
          </Animated.View>

          <View style={styles.shadowBelow} />
        </View>

        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleGoogleSignIn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#e8e8e8',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 24,
    width: '90%',
    alignItems: 'center',
  },
  titleWrapper: {
    marginBottom: 0,
  },
  titleImage: {
    width: 280,
    height: 80,
    resizeMode: 'contain',
  },
  subtitleWrapper: {
    marginBottom: 80,
  },
  subtitleImage: {
    width: 300,
    height: 40,
    resizeMode: 'contain',
  },
  logoWrapperContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  shadowBelow: {
    width: 60,
    height: 10,
    backgroundColor: '#000',
    opacity: 0.15,
    borderRadius: 10,
    position: 'absolute',
    top: 100,
    zIndex: -1,
  },
  googleButton: {
    width: 260,
    height: 48,
    elevation: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
});
