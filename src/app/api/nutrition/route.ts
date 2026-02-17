import { NextRequest, NextResponse } from 'next/server';
import { getNutritionData } from '@/lib/nutrition';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
  
  try {
    const data = getNutritionData(date);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nutrition data' },
      { status: 500 }
    );
  }
}
