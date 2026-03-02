import { redirect } from 'next/navigation';

const DEFAULT_HASH = process.env.BACKEND_HASH || 'b2e9f4';

export default function Home() {
  redirect(`/${DEFAULT_HASH}`);
}
