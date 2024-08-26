import {SafeAreaView, StyleSheet} from "react-native";
import Navigation from "./client/Navigation"
export default function App() {
  return (
    <SafeAreaView style={[styles.container, styles.text]}>
      <Navigation/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    fontWeight: '500',
  },
});