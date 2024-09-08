// src/services/firestore.js
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../Firebase/Firebase'; // Import the Firestore instance

// Add new accommodation
export const addAccommodation = async (newAccommodation) => {
  try {
    await addDoc(collection(db, 'accommodations'), newAccommodation);
  } catch (error) {
    console.error('Error adding accommodation: ', error);
  }
};

// Get all accommodations
export const getAccommodations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'accommodations'));
    const accommodations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return accommodations;
  } catch (error) {
    console.error('Error getting accommodations: ', error);
    return []; // Return an empty array in case of error
  }
};

// Update accommodation
export const updateAccommodation = async (id, updatedAccommodation) => {
  try {
    const docRef = doc(db, 'accommodations', id);
    await updateDoc(docRef, updatedAccommodation);
  } catch (error) {
    console.error('Error updating accommodation: ', error);
  }
};

// Delete accommodation
export const deleteAccommodation = async (id) => {
  try {
    const docRef = doc(db, 'accommodations', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting accommodation: ', error);
  }
};
