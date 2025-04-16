import { ExpoRoot } from 'expo-router';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

// ✅ Suppress only the .value render warning
configureReanimatedLogger({
  disable: ['render'],
  level: ReanimatedLogLevel.error,
});

export default function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}
