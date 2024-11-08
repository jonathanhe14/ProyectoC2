"use client";
import { time } from "console";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import { UUID } from "crypto";
import { useRouter } from "next/navigation";
import { Input, Label, Flex, Button, useTheme } from "@aws-amplify/ui-react";

interface TimeSlot {
  time: string;
  date: string;
  slotsAvailable: number;
}

interface ClassData {
  classId: string | null;
}

const client = generateClient<Schema>({
  authMode: "apiKey",
});

const FormTime: React.FC<ClassData> = ({ classId }) => {
  const { tokens } = useTheme();

  const router = useRouter();

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "", date: "", slotsAvailable: 0 },
  ]);

  const handleTimeSlotChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Verificamos que el "name" es una clave válida en TimeSlot
    if (name === "time" || name === "date" || name === "slotsAvailable") {
      const newTimeSlots = [...timeSlots];

      newTimeSlots[index] = {
        ...newTimeSlots[index],
        [name]: name === "slotsAvailable" ? parseInt(value) : value,
      };

      setTimeSlots(newTimeSlots);
    }
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { time: "", date: "", slotsAvailable: 1 }]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("Horarios:", timeSlots);
    createTimeSlot();
    router.push("/dashboard");
  };

  const createTimeSlot = async () => {
    try {
      const newTimeSlots = await client.models.TimeSlot.create({
        timeSlotId: crypto.randomUUID(),
        classId: classId,
        time: timeSlots[0].time,
        date: timeSlots[0].date,
        slotsAvailable: timeSlots[0].slotsAvailable,
      });
      console.log("Horario creado:", newTimeSlots);
    } catch (error) {
      console.error("Error al crear el horario", error);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Ingresar Clase y Horarios</h2>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        {/* Campos dinámicos para los horarios */}

        <div>
          <h3 className="text-xl font-bold mb-4">Horarios:</h3>
          {timeSlots.map((slot, index) => (
            <div key={index} className="timeSlot">
              <Flex direction="column" width="20rem">
                <Flex direction="column" gap="medium">
                  <Label
                    htmlFor="time"
                    color={tokens.colors.white}
                    className="mb-5"
                  >
                    Horario (ej: 10:00 AM):
                  </Label>
                  <Input
                    type="text"
                    name="time"
                    value={slot.time}
                    onChange={(e) => handleTimeSlotChange(index, e)}
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
                    value={slot.date}
                    onChange={(e) => handleTimeSlotChange(index, e)}
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
                  value={slot.slotsAvailable}
                  onChange={(e) => handleTimeSlotChange(index, e)}
                  required
                />
                </Flex>
                <Button type="submit" value="Agregar Horario" variation="primary"> Agregar Horario</Button>
              </Flex>
            </div>
          ))}
        </div>
        
      </form>
    </div>
  );
};

export default FormTime;
