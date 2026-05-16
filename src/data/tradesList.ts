export const PREWRITTEN_TRADES = [
  "chef", "plumber", "dj", "nurse", "developer", "teacher", "mechanic", 
  "designer", "farmer", "trucker", "electrician", "paramedic", "firefighter", 
  "architect", "photographer", "musician", "writer", "fisherman", "librarian", 
  "artist", "realtor", "contractor", "coach", "barber", "bartender", "therapist", 
  "veterinarian", "welder", "pharmacist", "journalist", "accountant", "carpenter", 
  "surgeon", "lawyer", "barista", "pilot", "insurance", "real estate", "student"
];

export interface TradeResult {
  slug: string;
  display_name: string;
  aliases?: string[];
  hook: string;
  act1_title: string;
  act1_body: string;
  act1_tag: string;
  act2_title: string;
  act2_body: string;
  act2_tag: string;
  act3_title: string;
  act3_body: string;
  act3_tag: string;
  category: string;
  translation_count: number;
  is_featured: boolean;
}
