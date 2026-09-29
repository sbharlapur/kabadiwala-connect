import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, CollectorProfile } from '@kabadiwala/shared';
import { api } from '@kabadiwala/shared';
import { db } from '../services/db';

interface GeoLocationState {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  isFallback?: boolean;
}

interface AuthContextType {
  user: User | null;
  collectorProfile: CollectorProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  location: GeoLocationState;
  login: (phone: string, pin: string) => Promise<void>;
  quickDemoLogin: (profileIndex: number) => Promise<void>;
  logout: () => void;
  updateLocation: () => Promise<void>;
}

const DEFAULT_LOCATIONS: GeoLocationState[] = [
  { latitude: 28.6139, longitude: 77.2090, city: 'Delhi NCR (Mayapuri)', isFallback: true },
  { latitude: 12.9716, longitude: 77.5946, city: 'Bengaluru (Peenya)', isFallback: true },
  { latitude: 19.0760, longitude: 72.8777, city: 'Mumbai (Dharavi)', isFallback: true }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [collectorProfile, setCollectorProfile] = useState<CollectorProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kabadiwala_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<GeoLocationState>(DEFAULT_LOCATIONS[0]);

  // Track GPS
  const updateLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            city: 'Live GPS Location',
            isFallback: false
          });
        },
        (err) => {
          console.warn('Geolocation error or permission denied, using default hub location:', err.message);
          setLocation(DEFAULT_LOCATIONS[0]);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  // Restore session
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('kabadiwala_token');
        const savedUser = localStorage.getItem('kabadiwala_user');
        const savedProfile = localStorage.getItem('kabadiwala_collector_profile');

        if (savedToken && savedUser && savedProfile) {
          api.setToken(savedToken);
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setCollectorProfile(JSON.parse(savedProfile));
        }
      } catch (e) {
        console.error('Failed to restore auth session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (phone: string, pin: string) => {
    setIsLoading(true);
    try {
      const response = await api.collectorLogin(phone, pin);
      const authUser = response.user;
      const profile = response.profile as CollectorProfile;
      const authToken = response.access_token;

      setUser(authUser);
      setCollectorProfile(profile);
      setToken(authToken);

      localStorage.setItem('kabadiwala_token', authToken);
      localStorage.setItem('kabadiwala_user', JSON.stringify(authUser));
      localStorage.setItem('kabadiwala_collector_profile', JSON.stringify(profile));

      if (profile) {
        await db.profile.put(profile);
      }
    } catch (err: any) {
      console.warn('Online login failed, attempting local demo fallback:', err.message);
      // Offline / Demo fallback
      if (phone === '9876543210' || phone.length >= 10) {
        const demoUser: User = {
          id: 'u-collector-demo-1',
          name: 'रमेश कुमार (Ramesh Kumar)',
          phone: phone,
          role: 'COLLECTOR',
          language: 'hi',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        const demoProfile: CollectorProfile = {
          id: 'cp-demo-1',
          user_id: demoUser.id,
          badge_number: 'DEL-KAB-0042',
          is_verified: true,
          operating_city: 'Delhi',
          total_kg_recycled: 85.5,
          total_earnings: 4250,
          upi_id: `${phone}@upi`,
          rating: 4.85,
          vehicle_type: 'E-RICKSHAW'
        };
        const mockToken = 'mock_jwt_token_demo_collector_2026';
        api.setToken(mockToken);
        setUser(demoUser);
        setCollectorProfile(demoProfile);
        setToken(mockToken);

        localStorage.setItem('kabadiwala_token', mockToken);
        localStorage.setItem('kabadiwala_user', JSON.stringify(demoUser));
        localStorage.setItem('kabadiwala_collector_profile', JSON.stringify(demoProfile));
        await db.profile.put(demoProfile);
      } else {
        throw new Error('Invalid credentials or collector not registered');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (profileIndex: number) => {
    const demos = [
      { phone: '9876543210', pin: '1234', name: 'रमेश कुमार (Ramesh Kumar - Mayapuri)', city: 'Delhi' },
      { phone: '9876543211', pin: '1234', name: 'सुनीता देवी (Sunita Devi - Peenya)', city: 'Bengaluru' },
      { phone: '9876543212', pin: '1234', name: 'अब्दुल कलाम (Abdul Kalam - Dharavi)', city: 'Mumbai' }
    ];
    const chosen = demos[profileIndex] || demos[0];
    await login(chosen.phone, chosen.pin);
  };

  const logout = () => {
    setUser(null);
    setCollectorProfile(null);
    setToken(null);
    api.setToken(null);
    localStorage.removeItem('kabadiwala_token');
    localStorage.removeItem('kabadiwala_user');
    localStorage.removeItem('kabadiwala_collector_profile');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        collectorProfile,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        location,
        login,
        quickDemoLogin,
        logout,
        updateLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
