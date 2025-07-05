import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
  Query
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface RideRequest {
  id?: string;
  riderId: string;
  riderName: string;
  pickup: string;
  destination: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  completedAt?: Timestamp;
  driverId?: string;
  driverName?: string;
  estimatedDuration?: string;
}

export interface Trip {
  id?: string;
  driverId: string;
  riderId: string;
  pickup: string;
  destination: string;
  fare: number;
  status: 'completed';
  completedAt: Timestamp;
  driverName: string;
  riderName: string;
}

export const useRideRequests = (driverId?: string) => {
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q: Query<DocumentData>;
    
    if (driverId) {
      // Driver sees only their accepted rides
      q = query(
        collection(db, 'rideRequests'),
        where('driverId', '==', driverId),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Show all pending requests for drivers to accept
      q = query(
        collection(db, 'rideRequests'),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RideRequest[];
      
      setRequests(requestsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [driverId]);

  const createRideRequest = async (request: Omit<RideRequest, 'id' | 'createdAt' | 'status'>) => {
    await addDoc(collection(db, 'rideRequests'), {
      ...request,
      status: 'pending',
      createdAt: Timestamp.now()
    });
  };

  const acceptRideRequest = async (requestId: string, driverId: string, driverName: string) => {
    const requestRef = doc(db, 'rideRequests', requestId);
    await updateDoc(requestRef, {
      status: 'accepted',
      driverId,
      driverName,
      acceptedAt: Timestamp.now()
    });
  };

  const updateRideStatus = async (requestId: string, status: RideRequest['status']) => {
    const requestRef = doc(db, 'rideRequests', requestId);
    const updateData: any = { status };
    
    if (status === 'completed') {
      updateData.completedAt = Timestamp.now();
    }
    
    await updateDoc(requestRef, updateData);

    // If completed, also create a trip record
    if (status === 'completed') {
      const request = requests.find(r => r.id === requestId);
      if (request) {
        await addDoc(collection(db, 'trips'), {
          driverId: request.driverId,
          riderId: request.riderId,
          pickup: request.pickup,
          destination: request.destination,
          fare: request.fare,
          status: 'completed',
          completedAt: Timestamp.now(),
          driverName: request.driverName,
          riderName: request.riderName
        });
      }
    }
  };

  return {
    requests,
    loading,
    createRideRequest,
    acceptRideRequest,
    updateRideStatus
  };
};

export const useUserTrips = (userId: string, userType: 'driver' | 'rider') => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const field = userType === 'driver' ? 'driverId' : 'riderId';
    const q = query(
      collection(db, 'trips'),
      where(field, '==', userId),
      orderBy('completedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tripsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Trip[];
      
      setTrips(tripsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId, userType]);

  return { trips, loading };
};