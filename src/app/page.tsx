import { getNutritionData } from '@/lib/nutrition';
import Dashboard from '@/components/Dashboard';

// Server-side data fetching - no client-side loading delay
export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  
  // Get Berlin date
  const getBerlinDate = () => {
    const now = new Date();
    return now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });
  };
  
  const date = params.date || getBerlinDate();
  const data = getNutritionData(date);
  
  return <Dashboard initialData={data} initialDate={date} />;
}
