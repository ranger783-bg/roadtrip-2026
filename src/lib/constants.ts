import type { IdeaCategory, Stop, DogOk } from "./types";

export const TRIP_START = "2026-08-07";
export const TRIP_END = "2026-09-24";

// Region/leg colors — main stops get a distinct color; transit nights are muted.
const C = {
  flagstaff: "#d59a3c", // amber / desert
  glacier: "#3c6e63", // pine
  yellowstone: "#b5552f", // canyon
  tetons: "#3e7cb1", // big sky
  payson: "#7d6b9c", // plum
  transit: "#b8ad99", // muted sand
  home: "#5b5247", // dark sand
};

export const STOPS: Stop[] = [
  { id: "yuma-start", seq: 1, name: "Home — Yuma", address: "14821 E 54th Dr, Yuma, AZ 85367", city: "Yuma", state: "AZ", lat: 32.6297392, lng: -114.3773444, arrival: "2026-08-07", departure: "2026-08-07", nights: 0, type: "endpoint", color: C.home, blurb: "Departure morning — load Tucker, the cooler, and hitch up the Casita." },
  { id: "flagstaff", seq: 2, name: "Flagstaff KOA Holiday", address: "5803 N US Highway 89, Flagstaff, AZ 86004", city: "Flagstaff", state: "AZ", lat: 35.2341051, lng: -111.5774634, arrival: "2026-08-07", departure: "2026-08-11", nights: 4, type: "main", color: C.flagstaff, blurb: "Four nights at 7,000 ft in the pines. Cool escape, walkable downtown, gateway to the San Francisco Peaks." },
  { id: "beaver", seq: 3, name: "Beaver KOA Journey", address: "1428 N Manderfield Rd, Beaver, UT 84713", city: "Beaver", state: "UT", lat: 38.2945124, lng: -112.6380486, arrival: "2026-08-11", departure: "2026-08-12", nights: 1, type: "overnight", color: C.transit, blurb: "One-night stopover in small-town southern Utah." },
  { id: "brigham", seq: 4, name: "Perry / Brigham City KOA", address: "1040 W 3600 S, Perry, UT 84302", city: "Perry", state: "UT", lat: 41.4649365, lng: -112.032445, arrival: "2026-08-12", departure: "2026-08-13", nights: 1, type: "overnight", color: C.transit, blurb: "Overnight north of Salt Lake, near the fruit-way orchards." },
  { id: "idaho-falls", seq: 5, name: "Snake River RV Park", address: "1440 Lindsay Blvd, Idaho Falls, ID 83402", city: "Idaho Falls", state: "ID", lat: 43.5083074, lng: -112.0550788, arrival: "2026-08-13", departure: "2026-08-14", nights: 1, type: "overnight", color: C.transit, blurb: "Riverwalk along the Snake River; easy in-town stretch for Tucker." },
  { id: "butte-out", seq: 6, name: "Butte KOA Journey", address: "1601 Kaw Ave, Butte, MT 59701", city: "Butte", state: "MT", lat: 45.9934515, lng: -112.5299884, arrival: "2026-08-14", departure: "2026-08-15", nights: 1, type: "overnight", color: C.transit, blurb: "Historic mining town; one night before the Glacier push." },
  { id: "west-glacier", seq: 7, name: "West Glacier RV Park & Cabins", address: "350 River Bend Dr, West Glacier, MT 59936", city: "West Glacier", state: "MT", lat: 48.5036661, lng: -113.9944297, arrival: "2026-08-15", departure: "2026-09-01", nights: 17, type: "main", color: C.glacier, blurb: "The big one — 17 nights at the doorstep of Glacier NP. Note: dogs aren't allowed on park trails, so plan town + forest-road days for Tucker." },
  { id: "butte-return", seq: 8, name: "Butte KOA Journey (return)", address: "1601 Kaw Ave, Butte, MT 59701", city: "Butte", state: "MT", lat: 45.9934515, lng: -112.5299884, arrival: "2026-09-01", departure: "2026-09-02", nights: 1, type: "overnight", color: C.transit, blurb: "One night back in Butte en route to Yellowstone." },
  { id: "yellowstone", seq: 9, name: "Fishing Bridge RV Park", address: "Fishing Bridge RV Park, Yellowstone NP, WY 82190", city: "Yellowstone", state: "WY", lat: 44.5646, lng: -110.3735, arrival: "2026-09-02", departure: "2026-09-07", nights: 5, type: "main", color: C.yellowstone, blurb: "Five nights inside Yellowstone near Lake. Dogs are restricted to roads/parking areas, so pair park drives with dog-friendly outings." },
  { id: "dubois", seq: 10, name: "Longhorn Ranch Lodge & RV Resort", address: "5810 US Highway 26, Dubois, WY 82513", city: "Dubois", state: "WY", lat: 43.5336369, lng: -109.6309651, arrival: "2026-09-07", departure: "2026-09-14", nights: 7, type: "main", color: C.tetons, blurb: "A week in Dubois, the quiet back-door to the Tetons over Togwotee Pass. Big-sky scenic drives." },
  { id: "lyman", seq: 11, name: "Lyman KOA Journey", address: "1545 State Hwy 413, Lyman, WY 82937", city: "Lyman", state: "WY", lat: 41.327367, lng: -110.292835, arrival: "2026-09-14", departure: "2026-09-15", nights: 1, type: "overnight", color: C.transit, blurb: "Overnight in southwest Wyoming." },
  { id: "fillmore", seq: 12, name: "Fillmore KOA Journey", address: "410 W 900 S, Fillmore, UT 84631", city: "Fillmore", state: "UT", lat: 38.9489728, lng: -112.3354563, arrival: "2026-09-15", departure: "2026-09-16", nights: 1, type: "overnight", color: C.transit, blurb: "One night in central Utah." },
  { id: "lake-powell", seq: 13, name: "Lake Powell Gateway RV Resort", address: "25 S Ethan Allen, Big Water, UT 84741", city: "Big Water", state: "UT", lat: 37.0781107, lng: -111.6620289, arrival: "2026-09-16", departure: "2026-09-17", nights: 1, type: "overnight", color: C.transit, blurb: "Overnight near Lake Powell — red-rock country, dog-friendly shoreline access." },
  { id: "payson", seq: 14, name: "Payson Campground & RV Resort", address: "808 E State Hwy 260, Payson, AZ 85541", city: "Payson", state: "AZ", lat: 34.2832269, lng: -111.3322283, arrival: "2026-09-17", departure: "2026-09-24", nights: 7, type: "main", color: C.payson, blurb: "A final week in the cool Mogollon Rim pines before the run home to Yuma." },
  { id: "yuma-end", seq: 15, name: "Home — Yuma", address: "14821 E 54th Dr, Yuma, AZ 85367", city: "Yuma", state: "AZ", lat: 32.6297392, lng: -114.3773444, arrival: "2026-09-24", departure: "2026-09-24", nights: 0, type: "endpoint", color: C.home, blurb: "Home again — 3,312 miles later." },
];

export const STOPS_BY_ID: Record<string, Stop> = Object.fromEntries(STOPS.map((s) => [s.id, s]));

/** Main stops in route order, for assembling a Google Maps directions URL within the ~10-point limit. */
export const MAIN_ROUTE = STOPS.filter((s) => s.type === "main" || s.type === "endpoint");

export const CATEGORIES: Record<IdeaCategory, string> = {
  scenic_drive: "Scenic drive",
  sight: "Sight / landmark",
  town: "In town",
  food: "Food & drink",
  grocery: "Groceries",
  fuel: "Gas / fuel",
  hike: "Easy walk",
  water: "Lake / river",
  wildlife: "Wildlife",
  forest_road: "Forest road (dog OK)",
  rest: "Rest stop",
};

export const DOG_LABEL: Record<DogOk, string> = {
  yes: "Dog OK",
  maybe: "Dog: maybe",
  no: "No dogs",
};

export const TIME_BLOCK_LABEL = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  all_day: "All day",
} as const;

// ----- helpers -----

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export interface TripDay {
  date: string;
  stop: Stop | null; // where they sleep that night
}

export function tripDays(): TripDay[] {
  const [sy, sm, sd] = TRIP_START.split("-").map(Number);
  const [ey, em, ed] = TRIP_END.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  const days: TripDay[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const date = ymd(new Date(t));
    const stop =
      STOPS.find((s) => s.nights > 0 && date >= s.arrival && date < s.departure) ?? null;
    days.push({ date, stop });
  }
  return days;
}

export function mapQueryForIdea(i: { title: string; map_query?: string | null; address?: string | null; stop_id?: string | null }): string {
  if (i.map_query && i.map_query.trim()) return i.map_query.trim();
  if (i.address && i.address.trim()) return i.address.trim();
  const stop = i.stop_id ? STOPS_BY_ID[i.stop_id] : null;
  const place = stop ? `${stop.city}, ${stop.state}` : "USA";
  return `${i.title.replace(/\s*\(.*?\)\s*/g, " ").trim()}, ${place}`;
}

/** Google Maps directions URL for the main-stop route (origin/dest + waypoints, <=10 points). */
export function googleRouteUrl(points: Stop[]): string {
  if (points.length < 2) return "https://www.google.com/maps";
  const origin = `${points[0].lat},${points[0].lng}`;
  const destination = `${points[points.length - 1].lat},${points[points.length - 1].lng}`;
  const mids = points.slice(1, -1).slice(0, 8); // Google allows ~8 waypoints
  const waypoints = mids.map((s) => `${s.lat},${s.lng}`).join("|");
  const base = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  return waypoints ? `${base}&waypoints=${encodeURIComponent(waypoints)}` : base;
}

/** Quick "what's nearby" Google Maps searches for a stop. */
export function essentialsLinks(stop: Stop): { label: string; query: string; url: string }[] {
  const near = `${stop.city}, ${stop.state}`;
  const make = (label: string, term: string) => ({
    label,
    query: `${term} near ${near}`,
    url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${term} near ${near}`)}`,
  });
  return [
    make("Groceries", "grocery store"),
    make("Gas", "gas station"),
    make("Propane", "propane refill"),
    make("Dump station", "RV dump station"),
    make("Vet", "veterinarian"),
  ];
}
