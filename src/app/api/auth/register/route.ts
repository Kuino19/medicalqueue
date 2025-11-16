import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { db, insertUser } from '@/lib/db';
import { hospitals } from '@/lib/schema';
import { hashPassword } from '@/lib/auth';

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hospitalName: z.string().min(2, "Hospital name must be at least 2 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error.flatten().fieldErrors }, { status: 400 });
    }

    const { fullName, email, password, hospitalName } = parsedData.data;

    // Check if a user with this email already exists
    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }
    
    // Create the hospital first
    const [newHospital] = await db.insert(hospitals).values({
      name: hospitalName,
    }).returning({ id: hospitals.id });

    if (!newHospital || !newHospital.id) {
      return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
    }

    const hashedPassword = await hashPassword(password);

    // Create the user with the doctor role and associate with the new hospital
    await insertUser({
      fullName,
      email,
      password: hashedPassword,
      role: 'doctor',
      hospitalId: newHospital.id,
    });

    return NextResponse.json({ message: 'Hospital and doctor registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('[REGISTER_POST]', error);
    // Check for unique constraint errors specifically
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed: users.email')) {
       return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
