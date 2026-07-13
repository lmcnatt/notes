import { NextResponse } from 'next/server';
import { getUserByUsername, updateUserPassword } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const username = request.headers.get('x-user-username');
  if (!username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = getUserByUsername(username);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { newPassword } = await request.json();

  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(newPassword.trim());
  updateUserPassword(username, passwordHash, false);

  return NextResponse.json({ success: true });
}
