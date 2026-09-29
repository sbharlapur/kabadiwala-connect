import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, RecyclerFacility } from '@kabadiwala/shared';
import { api } from '@kabadiwala/shared';

interface RecyclerAuthContextType {
  user: User | null;
  facility: RecyclerFacility | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  quickDemoLogin: (index: number) => Promise<void>;
  logout: () => void;
}

const RecyclerAuthContext = createContext<RecyclerAuthContextType | undefined>(undefined);

const DEMO_FACILITIES: RecyclerFacility[] = [
  {
    id: 'rec-1',
    user_id: 'u-rec-1',
    facility_name: 'EcoRecycle Solutions Hub (Mayapuri)',
    cpcb_reg_number: 'CPCB/EW/2024/DEL-0891',
    spcb_noc_valid_until: '2028-12-31',
    facility_type: 'RECYCLER',
    address: 'Plot 42, Mayapuri Industrial Phase II, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110064',
    latitude: 28.6289,
    longitude: 77.2065,
    accepted_categories: ['PCB', 'CABLES', 'BATTERIES', 'LCD_LED', 'CRT_TV', 'MOTORS_MAGNETS', 'MIXED_PLASTICS'],
    capacity_kg_per_day: 5000,
    current_stock_kg: 1840,
    phone: '9811223344',
    is_cpcb_verified: true,
    pickup_available: true
  },
  {
    id: 'rec-2',
    user_id: 'u-rec-2',
    facility_name: 'GreenEarth Metal & E-Waste Refiners',
    cpcb_reg_number: 'CPCB/EW/2023/DEL-0142',
    spcb_noc_valid_until: '2027-06-30',
    facility_type: 'DISMANTLER',
    address: 'Kirti Nagar Recycling Cluster, New Delhi',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110015',
    latitude: 28.6500,
    longitude: 77.2300,
    accepted_categories: ['PCB', 'CABLES', 'BATTERIES', 'LCD_LED'],
    capacity_kg_per_day: 3500,
    current_stock_kg: 920,
    phone: '9822334455',
    is_cpcb_verified: true,
    pickup_available: false
  }
];

export const RecyclerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [facility, setFacility] = useState<RecyclerFacility | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('kabadiwala_recycler_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = () => {
      try {
        const savedToken = localStorage.getItem('kabadiwala_recycler_token');
        const savedUser = localStorage.getItem('kabadiwala_recycler_user');
        const savedFacility = localStorage.getItem('kabadiwala_recycler_facility');

        if (savedToken && savedUser && savedFacility) {
          api.setToken(savedToken);
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          setFacility(JSON.parse(savedFacility));
        }
      } catch (err) {
        console.error('Failed to restore recycler session:', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const response = await api.recyclerLogin(email, pass);
      const authUser = response.user;
      const authFacility = response.profile as RecyclerFacility;
      const authToken = response.access_token;

      setUser(authUser);
      setFacility(authFacility || DEMO_FACILITIES[0]);
      setToken(authToken);

      localStorage.setItem('kabadiwala_recycler_token', authToken);
      localStorage.setItem('kabadiwala_recycler_user', JSON.stringify(authUser));
      localStorage.setItem('kabadiwala_recycler_facility', JSON.stringify(authFacility || DEMO_FACILITIES[0]));
    } catch (err: any) {
      console.warn('Backend login failed, using demo fallback:', err.message);
      // Fallback demo recycler
      const demoUser: User = {
        id: 'u-rec-1',
        phone: '9811223344',
        name: 'Harish Mehta (EcoRecycle)',
        role: 'RECYCLER',
        language: 'en',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const mockToken = 'mock_jwt_token_demo_recycler_2026';
      api.setToken(mockToken);
      setUser(demoUser);
      setFacility(DEMO_FACILITIES[0]);
      setToken(mockToken);

      localStorage.setItem('kabadiwala_recycler_token', mockToken);
      localStorage.setItem('kabadiwala_recycler_user', JSON.stringify(demoUser));
      localStorage.setItem('kabadiwala_recycler_facility', JSON.stringify(DEMO_FACILITIES[0]));
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (index: number) => {
    const selected = DEMO_FACILITIES[index] || DEMO_FACILITIES[0];
    const email = index === 0 ? 'delhi@ecorecycle.in' : 'info@greenearthrefiners.in';
    await login(email, 'recycler123');
    setFacility(selected);
  };

  const logout = () => {
    setUser(null);
    setFacility(null);
    setToken(null);
    api.setToken(null);
    localStorage.removeItem('kabadiwala_recycler_token');
    localStorage.removeItem('kabadiwala_recycler_user');
    localStorage.removeItem('kabadiwala_recycler_facility');
  };

  return (
    <RecyclerAuthContext.Provider
      value={{
        user,
        facility,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        quickDemoLogin,
        logout
      }}
    >
      {children}
    </RecyclerAuthContext.Provider>
  );
};

export const useRecyclerAuth = () => {
  const context = useContext(RecyclerAuthContext);
  if (!context) {
    throw new Error('useRecyclerAuth must be used within a RecyclerAuthProvider');
  }
  return context;
};
