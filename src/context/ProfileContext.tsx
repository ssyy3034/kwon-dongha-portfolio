"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import defaultProfile from "@/config/profile.json";

type ProfileData = typeof defaultProfile;

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (newData: Partial<ProfileData>) => void;
  resetProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({
  children,
  initialProfile = defaultProfile,
}: {
  children: ReactNode;
  initialProfile?: ProfileData;
}) {
  const [profile, setProfile] = useState<ProfileData>(initialProfile);

  const updateProfile = (newData: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...newData }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
