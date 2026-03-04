import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { PieChart, ProgressChart } from 'react-native-chart-kit';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [meals, setMeals] = useState([]);
  const [water, setWater] = useState(0); // NEU: Wasser-Status
  const [currentDate, setCurrentDate] = useState(new Date());

  // Daten laden, wenn der Tab geöffnet wird
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // Wir nehmen hier vereinfacht immer das heutige Datum für die Bilanz,
      // oder man könnte das Datum aus dem Context holen.
      // Hier laden wir "Heute" als Standard.
      const dateString = new Date().toISOString().split('T')[0];
      const storageKey = `@meals_${dateString}`;
      const savedMeals = await AsyncStorage.getItem(storageKey);
      
      if (savedMeals !== null) {
        setMeals(JSON.parse(savedMeals));
      } else {
        setMeals([]);
      }

      // NEU: Wasser laden
      const waterKey = `@water_${dateString}`;
      const savedWater = await AsyncStorage.getItem(waterKey);
      setWater(savedWater ? parseInt(savedWater) : 0);
    } catch (e) {
      console.error(e);
    }
  };

  // Summen berechnen
  const totalCal = meals.reduce((sum, m) => sum + (m.cal || 0), 0);
  const totalFat = meals.reduce((sum, m) => sum + (m.fat || 0), 0);
  const totalSatFat = meals.reduce((sum, m) => sum + (m.saturatedFat || 0), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + (m.carbs || 0), 0);
  const totalSugar = meals.reduce((sum, m) => sum + (m.sugar || 0), 0);
  const totalProtein = meals.reduce((sum, m) => sum + (m.protein || 0), 0);
  const totalSalt = meals.reduce((sum, m) => sum + (m.salt || 0), 0);
  const totalFiber = meals.reduce((sum, m) => sum + (m.fiber || 0), 0);
  const totalSodium = meals.reduce((sum, m) => sum + (m.sodium || 0), 0);
  const totalVitaminA = meals.reduce((sum, m) => sum + (m.vitaminA || 0), 0);
  const totalVitaminC = meals.reduce((sum, m) => sum + (m.vitaminC || 0), 0);
  const totalCalcium = meals.reduce((sum, m) => sum + (m.calcium || 0), 0);
  const totalIron = meals.reduce((sum, m) => sum + (m.iron || 0), 0);
  const totalCholesterol = meals.reduce((sum, m) => sum + (m.cholesterol || 0), 0);
  const totalPotassium = meals.reduce((sum, m) => sum + (m.potassium || 0), 0);
  const totalMagnesium = meals.reduce((sum, m) => sum + (m.magnesium || 0), 0);
  const totalZinc = meals.reduce((sum, m) => sum + (m.zinc || 0), 0);

  const screenWidth = Dimensions.get("window").width;

  // NEU: Wasser ändern und speichern
  const updateWater = async (change) => {
    const newWater = Math.max(0, water + change);
    setWater(newWater);
    const dateString = new Date().toISOString().split('T')[0];
    try {
      await AsyncStorage.setItem(`@water_${dateString}`, newWater.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const chartData = [
    {
      name: "Fett",
      population: totalFat,
      color: "#d9534f",
      legendFontColor: isDark ? "#fff" : "#7F7F7F",
      legendFontSize: 14
    },
    {
      name: "Kohlenhydrate",
      population: totalCarbs,
      color: "#f0ad4e",
      legendFontColor: isDark ? "#fff" : "#7F7F7F",
      legendFontSize: 14
    },
    {
      name: "Protein",
      population: totalProtein,
      color: "#5cb85c",
      legendFontColor: isDark ? "#fff" : "#7F7F7F",
      legendFontSize: 14
    }
  ];

  const StatRow = ({ label, value, unit = 'g', isSub = false, color = isDark ? '#fff' : '#333' }) => (
    <View style={[styles.row, isSub && styles.subRow]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <Text style={[styles.value, { color }]}>{Math.round(value * 10) / 10} {unit}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>Tagesbilanz (Heute)</Text>
      
      <View style={[styles.card, isDark && { backgroundColor: '#1e1e1e' }]}>
        <Text style={[styles.cardTitle, isDark && { color: '#aaa' }]}>Kalorien</Text>
        <Text style={[styles.bigNumber, isDark && { color: '#fff' }]}>{totalCal} <Text style={styles.unit}>kcal</Text></Text>
      </View>

      {/* Tortendiagramm nur anzeigen, wenn Daten vorhanden sind */}
      {(totalFat > 0 || totalCarbs > 0 || totalProtein > 0) && (
        <View style={[styles.section, isDark && { backgroundColor: '#1e1e1e' }, { marginBottom: 20, alignItems: 'center' }]}>
          <Text style={[styles.sectionTitle, isDark && { color: '#fff', borderBottomColor: '#333' }, { width: '100%' }]}>Verteilung</Text>
          <PieChart
            data={chartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[0, 0]}
            absolute={false}
          />
        </View>
      )}

      {/* NEU: Zwei-Spalten-Layout für Wasser (Links) und Details (Rechts) */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        
        {/* Linke Spalte: Wasser-Tracker */}
        <View style={[styles.section, isDark && { backgroundColor: '#1e1e1e' }, { flex: 0.8, marginBottom: 0, alignItems: 'center', justifyContent: 'space-between' }]}>
          <Text style={[styles.sectionTitle, isDark && { color: '#fff', borderBottomColor: '#333' }, { width: '100%', textAlign: 'center', fontSize: 18 }]}>Wasser</Text>
          
          <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
            <ProgressChart
              data={{ data: [Math.min(1, (water * 0.25) / 2.5)] }} // Ziel: 2.5 Liter
              width={120}
              height={120}
              strokeWidth={10}
              radius={40}
              chartConfig={{
                backgroundGradientFrom: isDark ? "#1e1e1e" : "#fff",
                backgroundGradientTo: isDark ? "#1e1e1e" : "#fff",
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // Blau
              }}
              hideLegend={true}
            />
            <View style={{ position: 'absolute', alignItems: 'center' }}>
               <Text style={[styles.bigNumber, isDark && { color: '#fff' }, { fontSize: 22 }]}>{(water * 0.25).toFixed(2)} L</Text>
               <Text style={[styles.unit, { fontSize: 12 }]}>von 2.5 L</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 15 }}>
            <TouchableOpacity onPress={() => updateWater(-1)} style={[styles.waterButton, { backgroundColor: '#d9534f' }]}>
              <Text style={styles.waterButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => updateWater(1)} style={[styles.waterButton, { backgroundColor: '#5cb85c' }]}>
              <Text style={styles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rechte Spalte: Makronährstoffe & Details (Komprimiert) */}
        <View style={[styles.section, isDark && { backgroundColor: '#1e1e1e' }, { flex: 1.2, marginBottom: 0, paddingHorizontal: 10 }]}>
          <Text style={[styles.sectionTitle, isDark && { color: '#fff', borderBottomColor: '#333' }, { fontSize: 18 }]}>Details</Text>
          
          <View style={styles.statBlock}>
            <StatRow label="Fett" value={totalFat} color="#d9534f" />
            <StatRow label="gesättigt" value={totalSatFat} isSub />
          </View>

          <View style={styles.statBlock}>
            <StatRow label="Kohlenh." value={totalCarbs} color="#f0ad4e" />
            <StatRow label="Zucker" value={totalSugar} isSub />
            <StatRow label="Ballastst." value={totalFiber} isSub />
          </View>

          <View style={styles.statBlock}>
            <StatRow label="Protein" value={totalProtein} color="#5cb85c" />
          </View>

          <View style={styles.statBlock}>
            <StatRow label="Salz" value={totalSalt} color="#5bc0de" />
            <StatRow label="Natrium" value={totalSodium} isSub />
          </View>

          <View style={styles.statBlock}>
            <Text style={[styles.label, { marginBottom: 5, color: isDark ? '#4d00dd' : '#333', fontSize: 14 }]}>Mikros (mg)</Text>
            <StatRow label="Vit C" value={totalVitaminC * 1000} unit="" isSub />
            <StatRow label="Eisen" value={totalIron * 1000} unit="" isSub />
            <StatRow label="Magnes." value={totalMagnesium * 1000} unit="" isSub />
            <StatRow label="Zink" value={totalZinc * 1000} unit="" isSub />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 20, elevation: 3 },
  cardTitle: { fontSize: 18, color: '#666', marginBottom: 5 },
  bigNumber: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  unit: { fontSize: 20, color: '#888', fontWeight: 'normal' },
  section: { backgroundColor: '#fff', borderRadius: 15, padding: 20, elevation: 3 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  statBlock: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  subRow: { paddingLeft: 10, marginBottom: 5 },
  label: { fontSize: 14, fontWeight: '500' },
  value: { fontSize: 14, fontWeight: 'bold' },
  waterButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  waterButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold', lineHeight: 26 },
});
