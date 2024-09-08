// src/services/reservations.js
import { db } from '../Firebase/Firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Add new reservation
export const addReservation = async (reservation) => {
  try {
    await addDoc(collection(db, 'reservations'), reservation);
  } catch (error) {
    console.error('Error adding reservation: ', error);
  }
};

// Get all reservations
export const getReservations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'reservations'));
    const reservations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return reservations;
  } catch (error) {
    console.error('Error getting reservations: ', error);
    return []; // Return an empty array in case of error
  }
};

// Update reservation
export const updateReservation = async (id, updatedReservation) => {
  try {
    const docRef = doc(db, 'reservations', id);
    await updateDoc(docRef, updatedReservation);
  } catch (error) {
    console.error('Error updating reservation: ', error);
  }
};

// Delete reservation
export const deleteReservation = async (id) => {
  try {
    const docRef = doc(db, 'reservations', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting reservation: ', error);
  }
};
