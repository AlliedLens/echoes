import {View, StyleSheet} from "react-native";
import Navigation from "./client/Navigation";
import { createTheme, useThemeMode, ThemeProvider, makeStyles } from "@rneui/themed";
import { ScrollView } from "react-native";

const theme = createTheme({
  mode: 'light',
  lightColors:{

  },
  darkColors:{
    primary: 'green',
  },
  components: {
    Button: {
      radius: 'lg'
    },
  },
})

export default function App() {
  return (
    <ScrollView style={[styles.box, styles.text]}>
      <Navigation/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  box: {
    display: 'flex',
    flexDirection:"row",
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  image: { width: 200, height: 200 },
  text: { textAlign: 'center', fontWeight: 'bold' },

});
