"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { useRouter } from "next/navigation";
import { Input, Label, Flex, Button, useTheme,ThemeProvider,Theme,defaultDarkModeOverride } from "@aws-amplify/ui-react";

interface TimeSlot {
  id?: string;
  timeSlotId?: string | null;
  time?: string | null;
  date?: string | null;
  slotsAvailable?: number | null;
  classId: string | null; // Add this line
}

interface ClassData {
  id: string;
}

const client = generateClient<Schema>({
  authMode: "apiKey",
});

const FormTime: React.FC<ClassData> = ({ id }) => {
  const { tokens } = useTheme();
  const router = useRouter();

  // Inicializamos `timeSlot` como un solo objeto
  const [timeSlot, setTimeSlot] = useState<TimeSlot>({
    time: "",
    date: "",
    slotsAvailable: 1,
    classId: "",
  });

  const handleTimeSlotChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTimeSlot((prevTimeSlot) => ({
      ...prevTimeSlot,
      [name]: name === "slotsAvailable" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Horario:", timeSlot);
    createTimeSlot();
    router.push("/dashboard");
  };

const createTimeSlot = async () => {
  try {
    console.log(id);
    const { data: newTimeSlot } = await client.models.TimeSlot.create({
      timeSlotId: crypto.randomUUID(),
      classId: id, // Ensure this is correctly passed
      time: timeSlot.time,
      date: timeSlot.date,
      slotsAvailable: timeSlot.slotsAvailable,
    });
    console.log("Horario creado:", newTimeSlot);
  } catch (error) {
    console.error("Error al crear el horario", error);
  }
};

const theme: Theme = {
  name: 'Auth Example Theme',
  overrides: [defaultDarkModeOverride],
};


  return (
    <ThemeProvider theme={theme}colorMode="light">
            <h2 className="text-3xl font-bold mb-5 text-black">Agrega un nuevo horario</h2>
    <div  className="max-w-lg p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-slate-50 dark:border-slate-100 mx-auto">

      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Campos para el horario */}

        <Flex direction="column" width="20rem">
          <Flex direction="column" gap="medium">
            <Label htmlFor="time">
              Horario (ej: 10:00 AM):
            </Label>
            <Input
              type="text"
              name="time"
              value={timeSlot.time ?? ""}
              onChange={handleTimeSlotChange}
              required
            />
          </Flex>

          <Flex direction="column" gap="medium">
            <Label htmlFor="date" >
              Fecha (YYYY-MM-DD):
            </Label>
            <Input
              type="date"
              name="date"
              value={timeSlot.date ?? ""}
              onChange={handleTimeSlotChange}
              required
            />
          </Flex>

          <Flex direction="column" gap="medium">
            <Label htmlFor="slotsAvailable" >
              Cupos Disponibles:
            </Label>
            <Input
              type="number"
              name="slotsAvailable"
              value={timeSlot.slotsAvailable ?? ""}
              onChange={handleTimeSlotChange}
              required
            />
          </Flex>

          <Button type="submit" value="Agregar Horario" variation="primary">
            Agregar Horario
          </Button>
        </Flex>
      </form>
    </div>
    </ThemeProvider>
  );
};

export default FormTime;

