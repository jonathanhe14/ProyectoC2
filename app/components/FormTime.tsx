"use client";
import { time } from "console";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { Input, Label, Flex, Button, useTheme } from "@aws-amplify/ui-react";

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

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Agrega un nuevo horario</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Campos para el horario */}

        <Flex direction="column" width="20rem">
          <Flex direction="column" gap="medium">
            <Label htmlFor="time" color={tokens.colors.white}>
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
            <Label htmlFor="date" color={tokens.colors.white}>
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
            <Label htmlFor="slotsAvailable" color={tokens.colors.white}>
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
  );
};

export default FormTime;

