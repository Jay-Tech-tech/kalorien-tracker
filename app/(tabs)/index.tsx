import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false); // NEU: Lade-Status
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  // --- NEU: State für Nährwerte (werden beim Scannen gefüllt) ---
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  // --- NEU: Detaillierte Nährwerte ---
  const [sugar, setSugar] = useState('');
  const [saturatedFat, setSaturatedFat] = useState('');
  const [salt, setSalt] = useState('');
  const [fiber, setFiber] = useState(''); // NEU: Ballaststoffe
  // --- NEU: Vitamine & Mineralstoffe ---
  const [sodium, setSodium] = useState('');
  const [vitaminA, setVitaminA] = useState('');
  const [vitaminC, setVitaminC] = useState('');
  const [calcium, setCalcium] = useState('');
  const [iron, setIron] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [potassium, setPotassium] = useState('');
  const [magnesium, setMagnesium] = useState('');
  const [zinc, setZinc] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // Steuert das Popup
  const [meals, setMeals] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  
  // --- NEU: State für das aktuell angezeigte Datum ---
  // Wir starten standardmäßig mit dem heutigen Datum
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // --- NEU: Hilfsfunktion, um das Datum als String zu formatieren (z.B. "2026-03-01") ---
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // --- ANGEPASST: Wird immer ausgeführt, wenn sich 'currentDate' ändert ---
  useEffect(() => {
    loadDataForDate(currentDate);
  }, [currentDate]);

  const loadDataForDate = async (date) => {
    try {
      const dateString = getFormattedDate(date);
      const storageKey = `@meals_${dateString}`; // Dynamischer Schlüssel!

      const savedMeals = await AsyncStorage.getItem(storageKey);
      if (savedMeals !== null) {
        setMeals(JSON.parse(savedMeals));
      } else {
        setMeals([]); // Wenn es für den Tag keine Daten gibt, leere Liste anzeigen
      }

      // Favoriten laden (die sind vom Datum unabhängig)
      const savedRecent = await AsyncStorage.getItem('@recent_foods');
      if (savedRecent !== null) setRecentFoods(JSON.parse(savedRecent));
    } catch (e) {
      console.error("Fehler beim Laden der Daten", e);
    }
  };

  const saveMealsForDate = async (newMealsArray, date) => {
    try {
      const dateString = getFormattedDate(date);
      const storageKey = `@meals_${dateString}`;
      await AsyncStorage.setItem(storageKey, JSON.stringify(newMealsArray));
    } catch (e) {
      console.error("Fehler beim Speichern der Mahlzeiten", e);
    }
  };

  const saveRecentFoods = async (newRecentArray) => {
    try {
      await AsyncStorage.setItem('@recent_foods', JSON.stringify(newRecentArray));
    } catch (e) {
      console.error("Fehler beim Speichern der Favoriten", e);
    }
  };

  const addMeal = () => {
    if (foodName.trim() === '' || calories.trim() === '') return;

    const newMeal = {
      id: Math.random().toString(),
      name: foodName,
      cal: parseInt(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      sugar: parseFloat(sugar) || 0,
      saturatedFat: parseFloat(saturatedFat) || 0,
      salt: parseFloat(salt) || 0,
      fiber: parseFloat(fiber) || 0,
      sodium: parseFloat(sodium) || 0,
      vitaminA: parseFloat(vitaminA) || 0,
      vitaminC: parseFloat(vitaminC) || 0,
      calcium: parseFloat(calcium) || 0,
      iron: parseFloat(iron) || 0,
      cholesterol: parseFloat(cholesterol) || 0,
      potassium: parseFloat(potassium) || 0,
      magnesium: parseFloat(magnesium) || 0,
      zinc: parseFloat(zinc) || 0
    };

    const updatedMeals = [...meals, newMeal];
    setMeals(updatedMeals);
    saveMealsForDate(updatedMeals, currentDate); // Speichert für das aktuell gewählte Datum

    const isKnown = recentFoods.some(
      food => food.name.toLowerCase() === foodName.trim().toLowerCase()
    );

    if (!isKnown) {
      const newRecent = {
        name: foodName.trim(),
        cal: calories, // Strings speichern wir direkt
        protein: parseFloat(protein) || 0, carbs: parseFloat(carbs) || 0, fat: parseFloat(fat) || 0, sugar: parseFloat(sugar) || 0, saturatedFat: parseFloat(saturatedFat) || 0, salt: parseFloat(salt) || 0, fiber: parseFloat(fiber) || 0,
        sodium: parseFloat(sodium) || 0, vitaminA: parseFloat(vitaminA) || 0, vitaminC: parseFloat(vitaminC) || 0, calcium: parseFloat(calcium) || 0, iron: parseFloat(iron) || 0, cholesterol: parseFloat(cholesterol) || 0, potassium: parseFloat(potassium) || 0, magnesium: parseFloat(magnesium) || 0, zinc: parseFloat(zinc) || 0
      };
      const updatedRecent = [...recentFoods, newRecent];
      setRecentFoods(updatedRecent);
      saveRecentFoods(updatedRecent);
    }
    
    resetForm();
  };

  const deleteMeal = (idToRemove) => {
    const updatedMeals = meals.filter(meal => meal.id !== idToRemove);
    setMeals(updatedMeals);
    saveMealsForDate(updatedMeals, currentDate);
  };

  const resetForm = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setSugar('');
    setSaturatedFat('');
    setSalt('');
    setFiber('');
    setSodium('');
    setVitaminA('');
    setVitaminC('');
    setCalcium('');
    setIron('');
    setCholesterol('');
    setPotassium('');
    setMagnesium('');
    setZinc('');
    setShowAddModal(false);
  };

  const handleQuickSelect = (food) => {
    setFoodName(food.name);
    setCalories(food.cal.toString());
    // Nährwerte aus dem gespeicherten Objekt laden (oder 0 falls alt/nicht vorhanden)
    setProtein((food.protein || 0).toString());
    setCarbs((food.carbs || 0).toString());
    setFat((food.fat || 0).toString());
    setSugar((food.sugar || 0).toString());
    setSaturatedFat((food.saturatedFat || 0).toString());
    setSalt((food.salt || 0).toString());
    setFiber((food.fiber || 0).toString());
    setSodium((food.sodium || 0).toString());
    setVitaminA((food.vitaminA || 0).toString());
    setVitaminC((food.vitaminC || 0).toString());
    setCalcium((food.calcium || 0).toString());
    setIron((food.iron || 0).toString());
    setCholesterol((food.cholesterol || 0).toString());
    setPotassium((food.potassium || 0).toString());
    setMagnesium((food.magnesium || 0).toString());
    setZinc((food.zinc || 0).toString());
  };

  // --- NEU: Funktionen zum Wechseln der Tage ---
  // Wir nutzen die Date-Funktionen von JavaScript (getDate / setDate)
  const changeDay = (daysToAdd) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + daysToAdd);
    
    // Verhindern, dass man in die Zukunft geht
    if (newDate > new Date()) return;
    
    setCurrentDate(newDate);
  };

  const onDateChange = (event, selectedDate) => {
    // Auf Android muss der Picker geschlossen werden, auf iOS bleibt er offen bis "Fertig" gedrückt wird
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  // Hilfsfunktion für die Anzeige "Heute" / "Gestern"
  const getDisplayDate = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) => 
      d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    if (isSameDay(date, today)) return "Heute";
    if (isSameDay(date, yesterday)) return "Gestern";
    
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const displayDate = getDisplayDate(currentDate);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.cal, 0);

  // Prüfen, ob heute ist (um den Vorwärts-Pfeil zu deaktivieren)
  const isToday = new Date().toDateString() === currentDate.toDateString();

  // --- NEU: Barcode-Scanner Logik ---
  const processProductData = (product) => {
    const name = product.product_name || 'Unbekanntes Produkt';
        // Versuchen, Kalorien zu finden (pro 100g oder pro Portion)
        const kcal = product.nutriments?.['energy-kcal_100g'] || product.nutriments?.['energy-kcal_serving'] || 0;
        
        // --- NEU: Nährwerte auslesen ---
        const p = product.nutriments?.proteins_100g || 0;
        const c = product.nutriments?.carbohydrates_100g || 0;
        const f = product.nutriments?.fat_100g || 0;
        // Details
        const sat = product.nutriments?.['saturated-fat_100g'] || 0;
        const sug = product.nutriments?.sugars_100g || 0;
        const sa = product.nutriments?.salt_100g || 0;
        const fib = product.nutriments?.fiber_100g || 0; // NEU: Ballaststoffe auslesen
        
        // Vitamine & Mineralstoffe (oft in Gramm in der DB)
        const sod = product.nutriments?.sodium_100g || 0;
        const vitA = product.nutriments?.['vitamin-a_100g'] || 0;
        const vitC = product.nutriments?.['vitamin-c_100g'] || 0;
        const calc = product.nutriments?.calcium_100g || 0;
        const irn = product.nutriments?.iron_100g || 0;
        const chol = product.nutriments?.cholesterol_100g || 0;
        const pot = product.nutriments?.potassium_100g || 0;
        const mag = product.nutriments?.magnesium_100g || 0;
        const zn = product.nutriments?.zinc_100g || 0;

        setFoodName(name);
        setCalories(kcal.toString());
        setProtein(p.toString()); setCarbs(c.toString()); setFat(f.toString());
        setSaturatedFat(sat.toString()); setSugar(sug.toString()); setSalt(sa.toString());
        setFiber(fib.toString());
        setSodium(sod.toString()); setVitaminA(vitA.toString()); setVitaminC(vitC.toString()); setCalcium(calc.toString()); setIron(irn.toString());
        setCholesterol(chol.toString()); setPotassium(pot.toString()); setMagnesium(mag.toString()); setZinc(zn.toString());
        
        setShowAddModal(true); // Öffnet das Popup statt Alert
  };

  const fetchProductByBarcode = async (barcode) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const json = await response.json();

      if (json.status === 1) {
        processProductData(json.product);
      } else {
        Alert.alert("Nicht gefunden", "Dieses Produkt ist nicht in der Datenbank.");
      }
    } catch (error) {
      Alert.alert("Fehler", "Daten konnten nicht geladen werden.");
    }
  };

  const searchProductByName = async (term) => {
    try {
      // Suche nach Produktnamen
      // OPTIMIERUNG: Deutsche Server (de) + Filter nach Deutschland (tag_0=germany) + Sortierung (unique_scans_n)
      const response = await fetch(`https://de.openfoodfacts.org/cgi/search.pl?search_terms=${term}&search_simple=1&action=process&json=1&page_size=15&fields=product_name,brands,nutriments,code&tagtype_0=countries&tag_contains_0=contains&tag_0=germany&sort_by=unique_scans_n`);
      const json = await response.json();

      if (json.products && json.products.length > 0) {
        setSearchResults(json.products);
        setShowSearchModal(true);
      } else {
        Alert.alert("Nicht gefunden", "Kein Produkt mit diesem Namen gefunden.");
      }
    } catch (error) {
      Alert.alert("Fehler", "Suche fehlgeschlagen.");
    }
  };

  const handleSelectSearchResult = (product) => {
    setShowSearchModal(false);
    processProductData(product);
  };

  const handleBarcodeScanned = ({ data }) => {
    setScanning(false);
    fetchProductByBarcode(data);
  };

  const handleSearch = async () => {
    if (searchText.trim() === '') return;
    if (isSearching) return; // Doppeltes Tippen verhindern

    setIsSearching(true); // Ladekreis an
    
    // Prüfen ob es ein Barcode (nur Zahlen) oder ein Name ist
    const isBarcode = /^\d+$/.test(searchText.trim());
    
    if (isBarcode) {
      await fetchProductByBarcode(searchText.trim());
    } else {
      await searchProductByName(searchText.trim());
    }
    
    setIsSearching(false); // Ladekreis aus
    setSearchText('');
  };

  // Automatische Kalorienberechnung
  const calculateCalories = (p, c, f) => {
    const pVal = parseFloat(p.replace(',', '.')) || 0;
    const cVal = parseFloat(c.replace(',', '.')) || 0;
    const fVal = parseFloat(f.replace(',', '.')) || 0;
    const cal = Math.round(pVal * 4 + cVal * 4 + fVal * 9);
    setCalories(cal.toString());
  };

  // Helper für die Eingabefelder im Modal
  const renderNutrientInput = (label, value, setter, unit = 'g') => (
    <View style={styles.nutrientRow}>
      <Text style={[styles.nutrientLabel, isDark && { color: '#ddd' }]}>{label}</Text>
      <View style={styles.nutrientInputContainer}>
        <TextInput
          style={[styles.nutrientInput, isDark && { color: '#fff', borderColor: '#555' }]}
          value={value}
          onChangeText={setter}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={isDark ? '#666' : '#ccc'}
        />
        <Text style={[styles.nutrientUnit, isDark && { color: '#aaa' }]}>{unit}</Text>
      </View>
    </View>
  );

  if (scanning) {
    if (!permission) return <View />;
    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>Wir brauchen Zugriff auf deine Kamera.</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Kamera erlauben</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginTop: 10, backgroundColor: '#d9534f' }]} onPress={() => setScanning(false)}>
            <Text style={styles.buttonText}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <CameraView style={{ flex: 1 }} facing="back" mirror={false} onBarcodeScanned={handleBarcodeScanned}>
        <View style={styles.scannerOverlay}>
          <View style={styles.scannerFrame} />
          <TouchableOpacity style={styles.closeScannerButton} onPress={() => setScanning(false)}>
            <Text style={styles.closeScannerText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <Text style={[styles.title, isDark && { color: '#fff' }]}>Kalorien Tracker</Text>

      {/* --- NEU: Suchergebnisse Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSearchModal}
        onRequestClose={() => setShowSearchModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#1e1e1e' }, { height: '80%' }]}>
            <Text style={[styles.modalTitle, isDark && { color: '#fff' }]}>Suchergebnisse</Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.searchResultItem, isDark && { borderBottomColor: '#333' }]} onPress={() => handleSelectSearchResult(item)}>
                  <Text style={[styles.searchResultName, isDark && { color: '#fff' }]}>{item.product_name || 'Unbekannt'}</Text>
                  <Text style={[styles.searchResultBrand, isDark && { color: '#aaa' }]}>{item.brands || ''}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={[styles.button, { backgroundColor: '#d9534f', marginTop: 10 }]} onPress={() => setShowSearchModal(false)}>
              <Text style={styles.buttonText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- NEU: Das Popup-Fenster (Modal) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.modalContent, isDark && { backgroundColor: '#1e1e1e' }]}>
            <View style={{ width: '100%', alignItems: 'center' }}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDark && { color: '#fff' }]}>Nährwerte bearbeiten</Text>
              <TouchableOpacity onPress={resetForm} style={styles.closeModalButton}>
                <Text style={[styles.closeModalText, isDark && { color: '#fff' }]}>X</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalFoodName, isDark && { color: '#ccc', marginBottom: 10 }]}>{foodName || 'Neuer Eintrag'}</Text>
            
            <ScrollView style={[styles.modalStats, isDark && { backgroundColor: '#2c2c2c' }]} contentContainerStyle={{paddingBottom: 10}}>
              {renderNutrientInput("Kalorien (kcal)", calories, setCalories, "")}
              {renderNutrientInput("Eiweiß", protein, (text) => { setProtein(text); calculateCalories(text, carbs, fat); })}
              {renderNutrientInput("Fett", fat, (text) => { setFat(text); calculateCalories(protein, carbs, text); })}
              {renderNutrientInput("davon gesättigt", saturatedFat, setSaturatedFat)}
              {renderNutrientInput("Kohlenhydrate", carbs, (text) => { setCarbs(text); calculateCalories(protein, text, fat); })}
              {renderNutrientInput("davon Zucker", sugar, setSugar)}
              {renderNutrientInput("Ballaststoffe", fiber, setFiber)}
              {renderNutrientInput("Salz", salt, setSalt)}
              {renderNutrientInput("Natrium", sodium, setSodium)}
              {renderNutrientInput("Cholesterin", cholesterol, setCholesterol)}
              {renderNutrientInput("Vitamin A", vitaminA, setVitaminA)}
              {renderNutrientInput("Vitamin C", vitaminC, setVitaminC)}
              {renderNutrientInput("Calcium", calcium, setCalcium)}
              {renderNutrientInput("Eisen", iron, setIron)}
              {renderNutrientInput("Magnesium", magnesium, setMagnesium)}
              {renderNutrientInput("Zink", zinc, setZinc)}
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={addMeal}>
              <Text style={styles.buttonText}>Hinzufügen</Text>
            </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Datums-Navigation */}
      <View style={[styles.dateNavContainer, isDark && { backgroundColor: '#1e1e1e', borderColor: '#333' }]}>
        <TouchableOpacity style={[styles.dateButton, isDark && { backgroundColor: '#333' }]} onPress={() => changeDay(-1)}>
          <Text style={[styles.dateButtonText, isDark && { color: '#fff' }]}>{'<'}</Text>
        </TouchableOpacity>
        
        <View style={styles.dateWrapper}>
          {Platform.OS === 'web' ? (
            // Im Web nutzen wir ein Standard-HTML-Element, das stürzt nicht ab
            React.createElement('input', {
              type: 'date',
              value: currentDate.toISOString().split('T')[0],
              onChange: (e: any) => setCurrentDate(new Date(e.target.value)),
              max: new Date().toISOString().split('T')[0],
              style: {
                fontSize: 16, padding: 5, borderRadius: 5, 
                border: isDark ? '1px solid #555' : '1px solid #ccc', 
                color: isDark ? '#fff' : '#333', 
                backgroundColor: isDark ? '#333' : '#fff'
              }
            })
          ) : (
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.dateText, isDark && { color: '#fff' }]}>📅 {displayDate}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.dateButton, isToday && styles.disabledButton, isDark && { backgroundColor: '#333' }, isToday && isDark && { backgroundColor: '#222' }]} 
          onPress={() => changeDay(1)}
          disabled={isToday}
        >
          <Text style={[styles.dateButtonText, isToday && styles.disabledText, isDark && { color: '#fff' }, isToday && { color: '#555' }]}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {Platform.OS !== 'web' && showDatePicker && (
        <View>
          <DateTimePicker
            value={currentDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
          {Platform.OS === 'ios' && (
            <TouchableOpacity style={styles.iosButton} onPress={() => setShowDatePicker(false)}>
              <Text style={styles.iosButtonText}>Fertig</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text style={styles.totalText}>Gesamt: {totalCalories} kcal</Text>

      {recentFoods.length > 0 && (
        <View style={styles.recentContainer}>
          <Text style={[styles.recentTitle, isDark && { color: '#aaa' }]}>Zuletzt gegessen (Antippen zum Ausfüllen):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentFoods.map((food, index) => (
              <TouchableOpacity key={index} style={[styles.recentChip, isDark && { backgroundColor: '#333' }]} onPress={() => handleQuickSelect(food)}>
                <Text style={[styles.recentChipText, isDark && { color: '#fff' }]}>{food.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.scanButton} onPress={() => setScanning(true)}>
          <Text style={styles.scanButtonText}>📷 Barcode scannen</Text>
        </TouchableOpacity>

        {/* Manuelle Barcode-Eingabe */}
        <View style={styles.barcodeRow}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }, isDark && { backgroundColor: '#2c2c2c', color: '#fff', borderColor: '#444' }]}
            placeholderTextColor={isDark ? '#888' : '#999'}
            placeholder="Barcode oder Produktname"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch} disabled={isSearching}>
            {isSearching ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>🔍</Text>}
          </TouchableOpacity>
        </View>

        <TextInput
          style={[styles.input, isDark && { backgroundColor: '#2c2c2c', color: '#fff', borderColor: '#444' }]}
          placeholderTextColor={isDark ? '#888' : '#999'}
          placeholder="Was hast du gegessen?"
          value={foodName}
          onChangeText={setFoodName}
        />
        <TextInput
          style={[styles.input, isDark && { backgroundColor: '#2c2c2c', color: '#fff', borderColor: '#444' }]}
          placeholderTextColor={isDark ? '#888' : '#999'}
          placeholder="Kalorien"
          keyboardType="decimal-pad"
          value={calories}
          onChangeText={setCalories}
        />
        <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity style={[styles.button, {flex: 1}]} onPress={addMeal}>
              <Text style={styles.buttonText}>Hinzufügen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, {backgroundColor: '#007AFF', width: 80}]} onPress={() => setShowAddModal(true)}>
               <Text style={styles.buttonText}>Details</Text> 
            </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.mealItem, isDark && { backgroundColor: '#1e1e1e', borderColor: '#333' }]}>
            <View style={styles.mealTextContainer}>
              <Text style={[styles.mealName, isDark && { color: '#fff' }]}>{item.name}</Text>
              <Text style={[styles.mealCal, isDark && { color: '#ccc' }]}>{item.cal} kcal</Text>
              {/*  Anzeige der Nährwerte falls vorhanden */}
              {(item.protein > 0 || item.carbs > 0 || item.fat > 0) && (
                <Text style={styles.macroText}>
                  P: {Math.round(item.protein)}g • K: {Math.round(item.carbs)}g • F: {Math.round(item.fat)}g
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => deleteMeal(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 15, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  
  // --- NEU: Styles für die Datums-Navigation ---
  dateNavContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, backgroundColor: '#fff', padding: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  dateButton: { paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#e0e0e0', borderRadius: 5 },
  disabledButton: { backgroundColor: '#f0f0f0' }, // Heller, wenn deaktiviert
  disabledText: { color: '#ccc' }, // Grauer Text, wenn deaktiviert
  dateButtonText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  
  // --- NEU: Container für Text + Web-Picker ---
  dateWrapper: { alignItems: 'center', justifyContent: 'center' },
  webDatePicker: { width: 130, marginTop: 5 },
  
  dateText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#d9534f', marginBottom: 10, textAlign: 'center' },
  recentContainer: { marginBottom: 10 },
  recentTitle: { fontSize: 12, color: '#666', marginBottom: 5 },
  recentChip: { backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  recentChipText: { fontSize: 14, color: '#333' },
  inputContainer: { marginBottom: 10 },
  input: { backgroundColor: '#fff', padding: 10, marginBottom: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#5cb85c', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  mealItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 10, marginBottom: 6, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  mealTextContainer: { flex: 1 },
  mealName: { fontSize: 15 },
  mealCal: { fontSize: 15, fontWeight: 'bold', color: '#555' },
  // Neuer Style für die Nährwert-Zeile
  macroText: { fontSize: 12, color: '#888', marginTop: 2 },
  deleteButton: { backgroundColor: '#ffcccc', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5, marginLeft: 8 },
  deleteButtonText: { color: '#d9534f', fontWeight: 'bold', fontSize: 14 },
  // Styles für den iOS Fertig-Button
  iosButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  iosButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  // Scanner Styles
  scanButton: { backgroundColor: '#333', padding: 8, borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  barcodeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  searchButton: { backgroundColor: '#007AFF', padding: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  
  scanButtonText: { color: '#ffffff', fontWeight: 'bold' },
  scannerOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
  scannerFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#ffffff', borderRadius: 20, marginBottom: 50 },
  closeScannerButton: { position: 'absolute', bottom: 40, backgroundColor: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 8, alignItems: 'center' },
  closeScannerText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeModalButton: { padding: 5 },
  closeModalText: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  modalFoodName: { fontSize: 16, marginBottom: 10, color: '#333' },
  modalCal: { fontSize: 20, fontWeight: 'bold', color: '#5cb85c', marginBottom: 15 }, // Wird im neuen Layout ggf. nicht mehr direkt genutzt, aber styles behalten
  modalStats: { width: '100%', maxHeight: 400, marginBottom: 15, padding: 5, backgroundColor: '#f9f9f9', borderRadius: 10 },
  
  // Nutrient Input Styles
  nutrientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  nutrientLabel: { fontSize: 13, color: '#333', width: 160 },
  nutrientInputContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  nutrientInput: { flex: 1, borderBottomWidth: 1, borderBottomColor: '#ccc', textAlign: 'right', paddingRight: 5, color: '#333', paddingVertical: 2 },
  nutrientUnit: { fontSize: 11, color: '#888', width: 25, marginLeft: 5 },

  // Search Result Styles
  searchResultItem: { width: '100%', padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchResultName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  searchResultBrand: { fontSize: 14, color: '#666' }
});