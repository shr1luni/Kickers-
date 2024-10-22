import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import {format} from 'date-fns';
import {SERVER_URL} from '@env';

const FutsalSlotScreen = props => {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [futsalType, setFutsalType] = useState('FiveA');
  const [price, setPrice] = useState('');
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [isFormVisible, setFormVisible] = useState(false);
  const [currentSlotId, setCurrentSlotId] = useState(null);
 

  const showStartPicker = () => setStartPickerVisible(true);
  const hideStartPicker = () => setStartPickerVisible(false);
  const showEndPicker = () => setEndPickerVisible(true);
  const hideEndPicker = () => setEndPickerVisible(false);


  const handleCancel=()=>{
    resetForm();
        setFormVisible(false);
  }
  const {route, navigation} = props;
  const {futsalId, token} = route.params;

  const handleSaveSlot = async () => {
    if (!selectedDate || !startTime || !endTime || !price) {
      alert('Please fill all fields');
      return;
    }
  
    const slotData = {
      timeSlots: [
        {
          date: selectedDate,
          startTime: startTime,
          endTime: endTime,
          futsalType: futsalType,
          price: price,
        },
      ],
      futsalId,
    };
  
    const url = currentSlotId 
      ? `http://192.168.43.19:8001/update-time-slot/${currentSlotId}` 
      : 'http://192.168.43.19:8001/add-time-slot';
  
    try {
      const response = await fetch(url, {
        method: currentSlotId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(slotData),
      });
  
      const responseText = await response.text();
  
      if (response.ok) {
        const result = JSON.parse(responseText);
        console.log(currentSlotId ? 'Slot updated successfully' : 'Time Slot added successfully', result);
        resetForm();
        setFormVisible(false);
        getData(); // Refresh the slot list
      } else {
        console.error('Failed to save time slot:', responseText);
      }
    } catch (error) {
      console.error('Error submitting Slot:', error);
    }
  };
  

  const resetForm = () => {
    setSelectedDate('');
    setSelectedStartTime('');
    setSelectedEndTime('');
    setStartTime('');
    setEndTime('');
    setFutsalType('FiveA');
    setPrice('');
  };

  const handleEditSlot = slot => {
    setSelectedDate(slot.date);
    setSelectedStartTime(slot.startTime);
    setSelectedEndTime(slot.endTime);
    setFutsalType(slot.futsalType);
    setPrice(slot.price);
    setCurrentSlotId(slot.id);
    setFormVisible(true);
  };

  const handleDeleteSlot = slotId => {
    setSlots(slots.filter(slot => slot.id !== slotId));
  };

  const formatTime = time => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleConfirmStartTime = date => {
    const isoTime = date.toISOString();
    const formattedTime = formatTime(date);
    setStartTime(isoTime);
    setSelectedStartTime(formattedTime);
    hideStartPicker();
  };

  const handleConfirmEndTime = date => {
    const isoTime = date.toISOString();
    const formattedTime = formatTime(date);
    setEndTime(isoTime);
    setSelectedEndTime(formattedTime);
    hideEndPicker();
  };

 
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStartTime, setFilterStartTime] = useState('');
  const [filterEndTime, setFilterEndTime] = useState('');
  const [isFilterStartPickerVisible, setFilterStartPickerVisible] = useState(false);
  const [isFilterEndPickerVisible, setFilterEndPickerVisible] = useState(false);

  // Filter slots
  const filterSlots = () => {
    const filtered = slots.filter(slot => {
      const slotDate = formatDateTime(slot.date).date;
      const slotStartTime = formatDateTime(slot.startTime).time;
      const slotEndTime = formatDateTime(slot.endTime).time;

      return (
        (!filterDate || slotDate === filterDate) &&
        (!filterStartTime || slotStartTime === filterStartTime) &&
        (!filterEndTime || slotEndTime === filterEndTime)
      );
    });

    setFilteredSlots(filtered);
    setFilterModalVisible(false);
  };

  

  // Handlers for Date and Time selection
  const handleConfirmFilterDate = date => {
    setFilterDate(format(date, 'yyyy/MM/dd'));
  };

  const handleConfirmFilterStartTime = date => {
    setFilterStartTime(formatTime(date));
    setFilterStartPickerVisible(false);
  };

  const handleConfirmFilterEndTime = date => {
    setFilterEndTime(formatTime(date));
    setFilterEndPickerVisible(false);
  };
  
  // Toggle the filter modal
  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };
   // Clear filters
   const clearFilters = () => {
    setFilterDate('');
    setFilterStartTime('');
    setFilterEndTime('');
    setFilteredSlots(slots);
  };

  //conversion
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return {
      date: format(date, 'yyyy/MM/dd'),
      time: format(date, 'hh:mm a')
    };
  };
  const getData = async () => {
    const url = `http://192.168.43.19:8001/getTimeSlot/${futsalId}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        const filteredSlots = result.result.filter(slot => {
          const today = new Date();
          const slotDate = new Date(slot.date);
          return slotDate >= today; // Only include future or current dates
        });

        // console.warn(result)
        setSlots(filteredSlots); // Assuming the response is an array of slots
      } else {
        // console.error('Failed to fetch time slots:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };
  
  useEffect(() => {
    getData();
  },[slots]);
  

  return (
    <View style={styles.container}>
     
        {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleFilterModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Calendar
            minDate={format(new Date(), 'yyyy-MM-dd')}
              onDayPress={day => handleConfirmFilterDate(new Date(day.timestamp))}
              markedDates={{
                [filterDate]: {
                  selected: true,
                  marked: true,
                  selectedColor:'#F95609',
                },
              }}
            />

            <View style={styles.pickerContainer}>
              <TouchableOpacity
                style={styles.timePicker}
                onPress={() => setFilterStartPickerVisible(true)}>
                <Text style={styles.input}>
                  {filterStartTime
                    ? `Start Time: ${filterStartTime}`
                    : 'Select Start Time'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.timePicker}
                onPress={() => setFilterEndPickerVisible(true)}>
                <Text style={styles.input}>
                  {filterEndTime
                    ? `End Time: ${filterEndTime}`
                    : 'Select End Time'}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isFilterStartPickerVisible}
                mode="time"
                onConfirm={handleConfirmFilterStartTime}
                onCancel={() => setFilterStartPickerVisible(false)}
              />

              <DateTimePickerModal
                isVisible={isFilterEndPickerVisible}
                mode="time"
                onConfirm={handleConfirmFilterEndTime}
                onCancel={() => setFilterEndPickerVisible(false)}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={filterSlots}>
                <Text style={styles.saveButtonText}>Apply Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, styles.cancelButton]}
                onPress={clearFilters}>
                <Text style={styles.saveButtonText}>Clear Filter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      {isFormVisible ? (
        <>
          {/* Form components */}
          <Calendar
            minDate={format(new Date(), 'yyyy-MM-dd')}
            onDayPress={day => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: '#F95609',
              },
            }}
          />
  
          <View style={styles.pickerContainer}>
            <TouchableOpacity
              style={styles.timePicker}
              onPress={showStartPicker}>
              <Text style={styles.input}>
                {selectedStartTime
                  ? `Start Time: ${selectedStartTime}`
                  : 'Start Time'}
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.timePicker} onPress={showEndPicker}>
              <Text style={styles.input}>
                {selectedEndTime
                  ? `End Time: ${selectedEndTime}`
                  : 'End Time'}
              </Text>
            </TouchableOpacity>
  
            <DateTimePickerModal
              isVisible={isStartPickerVisible}
              mode="time"
              onConfirm={handleConfirmStartTime}
              onCancel={hideStartPicker}
            />
  
            <DateTimePickerModal
              isVisible={isEndPickerVisible}
              mode="time"
              onConfirm={handleConfirmEndTime}
              onCancel={hideEndPicker}
            />
          </View>
  
          <View style={styles.picker}>
            <Text style={styles.label}>Futsal Type:</Text>
            <Button
              title={futsalType}
              color={'#F95609'}
              onPress={() =>
                setFutsalType(futsalType === 'FiveA' ? 'SevenA' : 'FiveA')
              }
            />
          </View>
          <View style={styles.amount}>
            <Text style={{color: 'black', fontSize: 16, top: 15}}>Amount:</Text>
            <TextInput
              style={styles.textinput}
              placeholder="Enter Price"
              keyboardType="numeric"
              value={price.toString()}
              onChangeText={setPrice}
              color={'black'}
            />
          </View>
          <View style={styles.bottomButton}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveSlot}>
              <View style={styles.saveButtonInner}>
                <Text style={styles.saveButtonText}>Save</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, styles.cancel]}
              onPress={handleCancel}>
              <View style={styles.saveButtonInner}>
                <Text style={styles.saveButtonText}>Cancel</Text>
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Show update button when form is not visible */}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => setFormVisible(true)}>
            <View style={styles.updateButtonInner}>
              <Text style={styles.updateButtonText}>Update Slot</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
        <Icon name="filter" size={20} color="black" />
      </TouchableOpacity>
  
          {/* FlatList component */}
          <FlatList
            data={slots}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => {
              const formattedDate = formatDateTime(item.date).date;
              const formattedStartTime = formatDateTime(item.startTime).time;
              const formattedEndTime = formatDateTime(item.endTime).time;
              return (
                <View style={styles.slotItem}>
                  <View>
                    <Text style={styles.slotText}>Date: {formattedDate}</Text>
                  </View>
                  <View>
                    <Text style={styles.slotText}>
                      Time: {formattedStartTime} - {formattedEndTime}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.slotText}>Type: {item.futsalType}</Text>
                  </View>
                  <View>
                    <Text style={styles.slotText}>Price: {item.price}</Text>
                  </View>
  
                  <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => handleEditSlot(item)}>
                      <Icon name="edit" size={20} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteSlot(item.id)}>
                      <Icon name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No time slots available</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    
  },
  
  picker: {
    height:50,
    borderBottomWidth: 1,
    borderColor:'#D9D9D9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  amount:{
    height:50,
    borderBottomWidth: 0,
    borderColor:'#D9D9D9',
    flexDirection: 'row',
    gap: 3,
    alignContent:'center'
  },
  label: {
    color: 'black',
    fontSize: 16,
  },
  slotItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: 'black',
  },
  slotText: {
    color: 'black',
    fontSize: 12,
  },
  buttons: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 15,
  },
  pickerContainer: {
    height:70,
    borderBottomWidth: 1,
    borderColor:'#D9D9D9',
    marginVertical: 10,
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
   borderWidth:0,
    height: 50,
    borderColor: 'grey',
     alignSelf:'center',
    paddingVertical: 15,
    
    color: 'black',
  },
  textinput:{
    fontSize: 14,
    alignSelf:'center',
    borderColor:'#D9D9D9',
    borderWidth:2,
    height:40,
    textAlign:'center',
    paddingTop:10,borderRadius:10
  },
  timePicker: {
    borderWidth:2,
    borderRadius:10,
    flex:1,
    borderColor:'#D9D9D9',
    alignSelf:'center',
    alignItems: 'center',
   
  },
  bottomButton:{
    flexDirection:'row',
    alignSelf:'center',
    justifyContent:'center',
    gap:30
  },
  saveButton: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F95609',
    borderRadius: 10,
    alignItems: 'center',
    width:130,
    height:50
  },
  saveButtonText: {
    color: '#fff',
    // fontSize: 14,
    fontWeight:'bold'
  },
  cancel:{
    backgroundColor:'red'
  },
  saveButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateButton: {
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F95609',
    borderRadius: 10,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  updateButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  
});

export default FutsalSlotScreen;
