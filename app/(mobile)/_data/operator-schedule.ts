export const operatorProfile = {
  name: "Sara Conti",
  role: "OSS",
  area: "Milano Nord",
  phone: "+39 333 123 4567",
  email: "sara.conti@carelogix.local",
  activeSince: "2023",
};

export const visits = [
  {
    id: "giulia-marin-0830",
    time: "08:30",
    endTime: "09:30",
    patient: "Giulia Marin",
    address: "Via Solari 18, Milano",
    service: "Igiene e farmaci",
    status: "Prossima",
    priority: "Alta",
    phone: "+39 02 555 0101",
    notes: "Insulina in cucina, contattare figlia prima delle 18.",
    tasks: [
      "Supporto igiene personale",
      "Preparazione colazione",
      "Somministrazione farmaco mattutino",
    ],
  },
  {
    id: "alberto-neri-1100",
    time: "11:00",
    endTime: "12:00",
    patient: "Alberto Neri",
    address: "Corso Buenos Aires 44, Milano",
    service: "Fisioterapia",
    status: "Pianificata",
    priority: "Media",
    phone: "+39 02 555 0102",
    notes: "Ascensore piccolo, usare deambulatore.",
    tasks: [
      "Esercizi mobilita anca",
      "Controllo dolore riferito",
      "Aggiornamento note visita",
    ],
  },
  {
    id: "paolo-gallo-1630",
    time: "16:30",
    endTime: "17:15",
    patient: "Paolo Gallo",
    address: "Via Manzoni 7, Monza",
    service: "Controllo serale",
    status: "Pianificata",
    priority: "Media",
    phone: "+39 039 555 0103",
    notes: "Misurare pressione a ogni visita.",
    tasks: [
      "Misurazione pressione",
      "Verifica terapia serale",
      "Chiusura finestre e controllo sicurezza",
    ],
  },
];

export function getVisitById(id: string) {
  return visits.find((visit) => visit.id === id);
}
