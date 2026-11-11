import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth(['SUPER_ADMIN', 'ADMIN']);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { leads: true },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required.' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Failed to fetch admin users.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    const body = await req.json();
    const { name, email, password, role = 'ADMIN', phone, isActive = true } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: 'Email / Login ID is required.' }, { status: 400 });
    }

    if (!password || password.trim().length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check collision
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: `User with login ID ${normalizedEmail} already exists.` },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password.trim(), 10);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role,
        phone: phone?.trim() || null,
        isActive: Boolean(isActive),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: currentUser.userId,
        action: 'CREATE',
        entity: 'USER',
        entityId: newUser.id,
        details: `Created admin account: ${newUser.name} (${newUser.email}) with role ${newUser.role}`,
      },
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create user account.' }, { status: 500 });
  }
}
