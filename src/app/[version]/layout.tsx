import { notFound } from 'next/navigation';
import { ProfileProvider } from '@/context/ProfileContext';
import backendProfile from '@/config/profile.backend.json';
import fullstackProfile from '@/config/profile.fullstack.json';

function buildHashMap() {
  const map: Record<string, typeof backendProfile | typeof fullstackProfile> = {};
  if (process.env.BACKEND_HASH) map[process.env.BACKEND_HASH] = backendProfile;
  if (process.env.FULLSTACK_HASH) map[process.env.FULLSTACK_HASH] = fullstackProfile;
  return map;
}

export function generateStaticParams() {
  const hashes = [process.env.BACKEND_HASH, process.env.FULLSTACK_HASH].filter(Boolean);
  return hashes.map((version) => ({ version }));
}

export default async function VersionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  const hashMap = buildHashMap();
  const profile = hashMap[version];

  if (!profile) notFound();

  return (
    <ProfileProvider initialProfile={profile}>
      {children}
    </ProfileProvider>
  );
}
