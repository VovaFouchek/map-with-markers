/* eslint-disable @typescript-eslint/no-shadow */
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { IQuest } from '@shared/interfaces';

const useFirestoreMarkers = () => {
  const db = getFirestore();
  const [markers, setMarkers] = useState<IQuest[]>([]);

  useEffect(() => {
    const markersCollection = collection(db, 'markers');
    const markersQuery = query(markersCollection);

    const unsubscribe = onSnapshot(markersQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as IQuest);
      setMarkers(data);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  const addQuestMarker = async (newMarker: IQuest) => {
    try {
      await addDoc(collection(db, 'markers'), newMarker);
    } catch (error) {
      throw new Error('Error adding quest marker...');
    }
  };

  const updateQuestMarker = async (
    markerId: string,
    updatedData: Partial<IQuest>
  ) => {
    try {
      const markerRef = doc(db, 'markers', markerId);
      await updateDoc(markerRef, updatedData);
    } catch (error) {
      throw new Error('Error update quest marker...');
    }
  };

  const deleteQuestMarker = async (markerId: string) => {
    try {
      await deleteDoc(doc(db, 'markers', markerId));
    } catch (error) {
      throw new Error('Error delete quest marker...');
    }
  };

  return {
    markers,
    setMarkers,
    addQuestMarker,
    updateQuestMarker,
    deleteQuestMarker,
  };
};

export default useFirestoreMarkers;
