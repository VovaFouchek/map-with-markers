/* eslint-disable @typescript-eslint/no-floating-promises */
import { useState, useEffect } from 'react';
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  writeBatch,
} from 'firebase/firestore';
import { IQuest } from '@shared/interfaces';

const useFirestoreMarkers = () => {
  const db = getFirestore();
  const [markers, setMarkers] = useState<IQuest[]>([]);

  useEffect(() => {
    const markersCollection = collection(db, 'markers');
    const markersQuery = query(markersCollection);

    const unsubscribe = onSnapshot(markersQuery, (snapshot) => {
      const data = snapshot.docs.map((document) => document.data() as IQuest);
      setMarkers(data);
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  useEffect(() => {
    const updateLabels = async () => {
      const updatedMarkers: IQuest[] = [];

      markers.forEach((marker) => {
        const markerRef = doc(db, 'markers', marker.id);
        if (markerRef.id === marker.id) {
          updatedMarkers.push(marker);
        }
      });

      if (updatedMarkers.length > 0) {
        const batch = writeBatch(db);
        updatedMarkers.sort(
          (markerA, markerB) =>
            new Date(markerA.timeStamp).getTime() -
            new Date(markerB.timeStamp).getTime()
        );

        updatedMarkers.forEach((marker, index) => {
          const markerRef = doc(db, 'markers', marker.id);
          batch.update(markerRef, { label: `${index + 1}` });
        });

        try {
          await batch.commit();
        } catch (error) {
          throw new Error('Error executing batch...');
        }
      }
    };

    updateLabels();
  }, [db, markers]);

  const addQuestMarker = async (newMarker: IQuest) => {
    try {
      const markerRef = doc(db, 'markers', newMarker.id);
      await setDoc(markerRef, newMarker);
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
      const markerRef = doc(db, 'markers', markerId);
      await deleteDoc(markerRef);
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
