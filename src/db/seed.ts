import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { users, students, staff, requestTypes } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Pokrecem unosenje podataka");

  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection);

  try {
   console.log("Dodajem tipove zahteva (ako ne postoje)");

    const tipovi = [
      {
        name: "Uverenje o studiranju",
        description: "Potvrda da je student upisan na fakultet",
        requiresPayment: true,
        price: 500,
      },
      {
        name: "Potvrda o upisu",
        description: "Potvrda o upisu na tekucu godinu",
        requiresPayment: false,
        price: null,
      },
      {
        name: "Uverenje o polozenim ispitima",
        description: "Lista svih polozenih ispita",
        requiresPayment: true,
        price: 1000,
      },
      {
        name: "Potvrda za stipendiju",
        description: "Potvrda za konkurisanje za stipendiju",
        requiresPayment: false,
        price: null,
      },
      {
        name: "Duplikat indeksa",
        description: "Izdavanje duplikata indeksa",
        requiresPayment: true,
        price: 2000,
      },
    ];

    for (const t of tipovi) {
      const postoji = await db
        .select({ id: requestTypes.id })
        .from(requestTypes)
        .where(eq(requestTypes.name, t.name))
        .limit(1);

      if (postoji.length === 0) {
        await db.insert(requestTypes).values(t);
      }
    }

    console.log("Tipovi zahteva OK");

    console.log("Kreiranje admin naloga (ako ne postoji)");
    const adminEmail = "admin@fon.bg.ac.rs";

    const adminPostoji = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (adminPostoji.length === 0) {
      const adminSifra = await bcrypt.hash("admin123", 10);
      await db.insert(users).values({
        email: adminEmail,
        password: adminSifra,
        role: "ADMIN",
      });
      console.log("Admin kreiran!");
    } else {
      console.log("Admin već postoji.");
    }

    console.log("Kreiranje sluzbenika (ako ne postoji)");
    const staffEmail = "sluzbenik@fon.bg.ac.rs";

    const staffUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, staffEmail))
      .limit(1);

    let staffUserId: number;

    if (staffUser.length === 0) {
      const sluzbSifra = await bcrypt.hash("staff123", 10);
      const res = await db.insert(users).values({
        email: staffEmail,
        password: sluzbSifra,
        role: "STAFF",
      });
      staffUserId = res[0].insertId;
      console.log("STAFF user kreiran.");
    } else {
      staffUserId = staffUser[0].id;
      console.log("STAFF user već postoji.");
    }

    
    const staffRow = await db
      .select({ id: staff.id })
      .from(staff)
      .where(eq(staff.userId, staffUserId))
      .limit(1);

    if (staffRow.length === 0) {
      await db.insert(staff).values({
        firstName: "Marija",
        lastName: "Markovic",
        position: "Sef studentske sluzbe",
        userId: staffUserId,
      });
      console.log("Sluzbenik row kreiran.");
    } else {
      console.log("Sluzbenik row već postoji.");
    }

    console.log("Kreiranje test studenta (ako ne postoji)");
    const studentEmail = "student@student.fon.bg.ac.rs";

    const studUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, studentEmail))
      .limit(1);

    let studentUserId: number;

    if (studUser.length === 0) {
      const studSifra = await bcrypt.hash("student123", 10);
      const res = await db.insert(users).values({
        email: studentEmail,
        password: studSifra,
        role: "STUDENT",
      });
      studentUserId = res[0].insertId;
      console.log("STUDENT user kreiran.");
    } else {
      studentUserId = studUser[0].id;
      console.log("STUDENT user već postoji.");
    }

    const studRow = await db
      .select({ id: students.id })
      .from(students)
      .where(eq(students.userId, studentUserId))
      .limit(1);

    if (studRow.length === 0) {
      await db.insert(students).values({
        firstName: "Petar",
        lastName: "Petrovic",
        indexNumber: "2024/0001",
        yearOfStudy: 2,
        userId: studentUserId,
      });
      console.log("Student row kreiran.");
    } else {
      console.log("Student row već postoji.");
    }

   
    console.log("UNOSENJE ZAVRSENO");
    console.log("Test nalozi:");
    console.log("  Admin: admin@fon.bg.ac.rs / admin123");
    console.log("  Sluzbenik: sluzbenik@fon.bg.ac.rs / staff123");
    console.log("  Student: student@student.fon.bg.ac.rs / student123");

  } catch (error) {
    console.error("Greska:", error);
  } finally {
    await connection.end();
    process.exit(0);
  }
}

seed();