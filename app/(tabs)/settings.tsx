import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Funktion zum Löschen aller Daten (als Beispiel für eine Einstellung)
  const clearAllData = async () => {
    Alert.alert(
      "Alles löschen?",
      "Möchtest du wirklich alle gespeicherten Mahlzeiten und Favoriten löschen? Das kann nicht rückgängig gemacht werden.",
      [
        { text: "Abbrechen", style: "cancel" },
        { 
          text: "Löschen", 
          style: "destructive", 
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Erledigt", "Alle Daten wurden gelöscht.");
            } catch(e) {
              Alert.alert("Fehler", "Konnte Daten nicht löschen.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <Text style={[styles.title, isDark && { color: '#fff' }]}>Einstellungen</Text>
      
      <View style={[styles.section, isDark && { backgroundColor: '#1e1e1e' }]}>
        <Text style={[styles.sectionTitle, isDark && { color: '#fff' }]}>Datenverwaltung</Text>
        <Text style={[styles.text, isDark && { color: '#ccc' }]}>
          Hier kannst du deine gespeicherten Daten verwalten.
        </Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={clearAllData}>
          <Text style={styles.dangerButtonText}>Alle Daten löschen</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, isDark && { backgroundColor: '#1e1e1e' }]}>
        <Text style={[styles.sectionTitle, isDark && { color: '#fff' }]}>Über die App</Text>
        <Text style={[styles.text, isDark && { color: '#ccc' }]}>Kalorien Tracker v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  section: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  text: { fontSize: 16, color: '#666', marginBottom: 15 },
  dangerButton: { backgroundColor: '#ffcccc', padding: 15, borderRadius: 8, alignItems: 'center' },
  dangerButtonText: { color: '#d9534f', fontWeight: 'bold', fontSize: 16 },
});
