import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { users, students, staff, requestTypes } from "./schema";

async function seed() {
  console.log("Pokrecem unosenje podataka");

  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(connection);

  try {
    console.log("Dodajem tipove zahteva");
    await db.insert(requestTypes).values([
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
    ]);
    console.log("Tipovi zahteva dodati!");

    console.log("Kreiranje admin naloga");
    const adminSifra = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      email: "admin@fon.bg.ac.rs",
      password: adminSifra,
      role: "ADMIN",
    });
    console.log("Admin kreiran!");

    console.log("Kreiranje sluzbenika");
    const sluzbSifra = await bcrypt.hash("staff123", 10);
    const sluzbResult = await db.insert(users).values({
      email: "sluzbenik@fon.bg.ac.rs",
      password: sluzbSifra,
      role: "STAFF",
    });

    await db.insert(staff).values({
      firstName: "Marija",
      lastName: "Markovic",
      position: "Sef studentske sluzbe",
      userId: sluzbResult[0].insertId,
    });
    console.log("Sluzbenik kreiran");

    console.log("Kreiranje test studenta");
    const studSifra = await bcrypt.hash("student123", 10);
    const studResult = await db.insert(users).values({
      email: "student@student.fon.bg.ac.rs",
      password: studSifra,
      role: "STUDENT",
    });

    await db.insert(students).values({
      firstName: "Petar",
      lastName: "Petrovic",
      indexNumber: "2024/0001",
      yearOfStudy: 2,
      userId: studResult[0].insertId,
    });
    console.log("Student kreiran");

   
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