import { type ClientSchema, a, defineData } from "@aws-amplify/backend";


const schema = a.schema({
  Class: a.model({
    classId: a.id().required(),                 // ID de Clase (PK)
    className: a.string(),
    level: a.string(),
    description: a.string(),
    instructor: a.string(),
    timeSlots: a.hasMany('TimeSlot','classId'),
  }),
  TimeSlot: a.model({
    timeSlotId: a.id(),              // ID de Horario (PK)                // ID de Clase (FK)
    time: a.string(),
    date: a.string(),                 // Fecha como string
    slotsAvailable: a.integer(),
    classId: a.id().required(),              // ID de Clase (FK)
    class: a.belongsTo('Class','classId'), 
    attendees: a.hasMany('Attendee','timeSlotId')     // Clase a la que pertenece
  }),
  Attendee: a.model({
    attendeeId: a.id(),              // ID de Asistente (PK)
    className:a.string(),               // ID de Clase (FK)
    userName: a.string(),
    timeSlotId: a.id().required(),              // ID de Horario (FK)
    timeSlot: a.belongsTo('TimeSlot','timeSlotId')             // ID de Horario (FK
  })
}).authorization((allow) => allow.publicApiKey());





export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});


