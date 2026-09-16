const bcrypt = require('bcrypt');
const prisma = require('./db');

const demoUsers = [
  ['superadmin', 'superadmin@carepulse.com', 'SuperAdmin@123', 'SUPER_ADMIN'],
  ['admin', 'admin@carepulse.com', 'Admin@123', 'HOSPITAL_ADMIN'],
  ['doctor', 'doctor@hospital.local', 'Doctor@123', 'DOCTOR'],
  ['nurse', 'nurse@hospital.local', 'Nurse@123', 'NURSE'],
  ['reception', 'reception@carepulse.com', 'Reception@123', 'RECEPTIONIST'],
  ['lab', 'lab@carepulse.com', 'Lab@123', 'LAB_TECHNICIAN'],
  ['radiology', 'radiology@carepulse.com', 'Radiology@123', 'RADIOLOGY_TECHNICIAN'],
  ['pharmacy', 'pharmacy@carepulse.com', 'Pharmacy@123', 'PHARMACIST'],
  ['finance', 'finance@carepulse.com', 'Finance@123', 'CASHIER'],
  ['patient', 'patient@carepulse.com', 'Patient@123', 'PATIENT'],
];

async function seedUsers() {
  for (const [username, email, password, roleName] of demoUsers) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.upsert({
      where: { username },
      update: { email, passwordHash, roleId: role.id, isActive: true },
      create: { username, email, passwordHash, roleId: role.id },
    });
  }
}

module.exports = seedUsers;