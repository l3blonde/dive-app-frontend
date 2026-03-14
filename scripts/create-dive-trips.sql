-- Create dive_trips table
CREATE TABLE IF NOT EXISTS dive_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'Land-based', 'Liveaboard', 'Day Trip'
  difficulty TEXT, -- 'Beginner', 'Intermediate', 'Advanced', 'Expedition'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  description TEXT,
  marine_life TEXT, -- JSON array: '["whale-shark","manta-ray","reef-shark"]'
  price_usd DECIMAL(10,2),
  spots_total INTEGER,
  spots_left INTEGER,
  image_url TEXT,
  location TEXT,
  latitude DECIMAL(10,6),
  longitude DECIMAL(10,6),
  dive_site_ids TEXT, -- JSON array of linked dive site UUIDs
  rating DECIMAL(2,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert 20 dive trips
INSERT INTO dive_trips (name, type, difficulty, start_date, end_date, description, marine_life, price_usd, spots_total, spots_left, image_url, location, latitude, longitude, rating, review_count) VALUES

-- MALDIVES (6 trips)
('Dhigurah Island Trip', 'Land-based', 'Beginner', '2026-04-07', '2026-04-11', 'Relaxed island vibe + chance to see whale sharks, manta rays, and reef sharks in crystal clear waters.', '["whale-shark","manta-ray","reef-shark"]', 1450.00, 12, 8, '/images/trips/dhigurah-island.jpg', 'Dhigurah, Maldives', 3.5042, 72.9288, 4.9, 214),

('Maldives Liveaboard', 'Liveaboard', 'Advanced', '2026-04-15', '2026-04-22', 'Remote reefs + chance to see whale sharks, manta rays, and tiger sharks. Expedition style diving.', '["whale-shark","manta-ray","tiger-shark"]', 2290.00, 16, 6, '/images/trips/maldives-liveaboard.jpg', 'Male Atoll, Maldives', 4.1755, 73.5093, 4.8, 156),

('South Ari Atoll Explorer', 'Liveaboard', 'Intermediate', '2026-05-01', '2026-05-08', 'Best whale shark encounters in the Maldives. Daily sightings guaranteed or next trip free.', '["whale-shark","manta-ray","hammerhead-shark"]', 2650.00, 20, 12, '/images/trips/south-ari.jpg', 'South Ari Atoll, Maldives', 3.4833, 72.8167, 4.9, 342),

('Hanifaru Bay Day Trip', 'Day Trip', 'Beginner', '2026-06-15', '2026-06-15', 'UNESCO Biosphere Reserve. Witness the famous manta ray feeding aggregation.', '["manta-ray","whale-shark"]', 295.00, 8, 4, '/images/trips/hanifaru-bay.jpg', 'Baa Atoll, Maldives', 5.2500, 72.9333, 5.0, 89),

('Fuvahmulah Tiger Shark Expedition', 'Land-based', 'Advanced', '2026-07-10', '2026-07-15', 'The only place where tiger sharks are seen year-round. Deep dives with oceanic mantas.', '["tiger-shark","oceanic-manta","thresher-shark"]', 1890.00, 10, 5, '/images/trips/fuvahmulah.jpg', 'Fuvahmulah, Maldives', -0.2983, 73.4247, 4.7, 78),

('North Male Atoll Safari', 'Liveaboard', 'Intermediate', '2026-08-05', '2026-08-10', 'Classic Maldives route with pristine reefs, channels, and big fish action.', '["grey-reef-shark","eagle-ray","napoleon-wrasse"]', 1750.00, 18, 10, '/images/trips/north-male.jpg', 'North Male Atoll, Maldives', 4.4000, 73.5000, 4.6, 198),

-- RED SEA / EGYPT (5 trips)
('Brothers Islands Expedition', 'Liveaboard', 'Advanced', '2026-04-20', '2026-04-27', 'Legendary dive sites with hammerheads, oceanic whitetips, and stunning walls.', '["hammerhead-shark","oceanic-whitetip","grey-reef-shark"]', 1595.00, 22, 14, '/images/trips/brothers-islands.jpg', 'Brothers Islands, Egypt', 26.3167, 34.8500, 4.8, 267),

('Elphinstone Reef Day Trip', 'Day Trip', 'Intermediate', '2026-05-12', '2026-05-12', 'Famous plateau with oceanic whitetips and seasonal hammerhead sharks.', '["oceanic-whitetip","hammerhead-shark","barracuda"]', 175.00, 12, 7, '/images/trips/elphinstone.jpg', 'Marsa Alam, Egypt', 25.0833, 34.9167, 4.7, 156),

('Daedalus Reef Safari', 'Liveaboard', 'Intermediate', '2026-06-01', '2026-06-05', 'Remote offshore reef with schooling hammerheads and thresher sharks at dawn.', '["hammerhead-shark","thresher-shark","silky-shark"]', 1295.00, 24, 18, '/images/trips/daedalus.jpg', 'Daedalus Reef, Egypt', 24.9167, 35.8500, 4.6, 189),

('SS Thistlegorm Wreck Dive', 'Day Trip', 'Beginner', '2026-06-20', '2026-06-20', 'Iconic WWII wreck with motorcycles, tanks, and abundant marine life.', '["batfish","lionfish","moray-eel"]', 145.00, 16, 11, '/images/trips/thistlegorm.jpg', 'Sharm El Sheikh, Egypt', 27.8167, 33.9167, 4.9, 412),

-- INDONESIA (5 trips)
('Raja Ampat Explorer', 'Liveaboard', 'Intermediate', '2026-05-15', '2026-05-24', 'The most biodiverse marine region on Earth. Over 1,500 fish species.', '["manta-ray","wobbegong-shark","pygmy-seahorse"]', 3450.00, 14, 6, '/images/trips/raja-ampat.jpg', 'Raja Ampat, Indonesia', -0.2333, 130.5167, 5.0, 287),

('Komodo Dragon & Dive', 'Land-based', 'Intermediate', '2026-06-10', '2026-06-16', 'World-class diving with manta rays plus land excursions to see Komodo dragons.', '["manta-ray","reef-shark","giant-trevally"]', 1895.00, 10, 4, '/images/trips/komodo.jpg', 'Labuan Bajo, Indonesia', -8.4539, 119.8772, 4.8, 234),

('Nusa Penida Day Trip', 'Day Trip', 'Beginner', '2026-07-05', '2026-07-05', 'Manta Point and Crystal Bay. Chance to see mola mola (ocean sunfish) in season.', '["manta-ray","mola-mola","blue-spotted-ray"]', 125.00, 8, 5, '/images/trips/nusa-penida.jpg', 'Nusa Penida, Indonesia', -8.7275, 115.5444, 4.7, 178),

('Banda Sea Expedition', 'Liveaboard', 'Expedition', '2026-08-20', '2026-09-01', 'Remote expedition to pristine reefs, hammerhead schools, and sea snakes.', '["hammerhead-shark","sea-snake","bumphead-parrotfish"]', 4200.00, 12, 3, '/images/trips/banda-sea.jpg', 'Banda Islands, Indonesia', -4.5258, 129.8958, 4.9, 67),

('Lembeh Strait Muck Diving', 'Land-based', 'Intermediate', '2026-09-10', '2026-09-15', 'Critter capital of the world. Bizarre creatures you wont see anywhere else.', '["mimic-octopus","frogfish","blue-ringed-octopus"]', 1150.00, 8, 6, '/images/trips/lembeh.jpg', 'Lembeh, Indonesia', 1.4669, 125.2264, 4.8, 145),

-- CARIBBEAN (2 trips)
('Roatan Shark Dive', 'Land-based', 'Intermediate', '2026-05-20', '2026-05-25', 'Caribbean reef sharks guaranteed. Stunning wall dives and vibrant coral.', '["caribbean-reef-shark","nurse-shark","eagle-ray"]', 1095.00, 10, 7, '/images/trips/roatan.jpg', 'Roatan, Honduras', 16.3333, -86.5333, 4.6, 123),

('Bahamas Tiger Beach', 'Liveaboard', 'Advanced', '2026-06-25', '2026-06-30', 'Face-to-face encounters with tiger sharks in crystal clear shallow water.', '["tiger-shark","lemon-shark","great-hammerhead"]', 2750.00, 14, 9, '/images/trips/tiger-beach.jpg', 'Grand Bahama, Bahamas', 26.6500, -78.5167, 4.9, 198),

-- THAILAND (2 trips)
('Similan Islands Safari', 'Liveaboard', 'Beginner', '2026-04-10', '2026-04-14', 'Thailands premier dive destination with pristine reefs and gentle currents.', '["leopard-shark","manta-ray","whale-shark"]', 895.00, 20, 15, '/images/trips/similan.jpg', 'Similan Islands, Thailand', 8.6500, 97.6333, 4.7, 356),

('Richelieu Rock Day Trip', 'Day Trip', 'Intermediate', '2026-04-18', '2026-04-18', 'Thailands most famous dive site. Whale sharks and purple soft corals.', '["whale-shark","seahorse","harlequin-shrimp"]', 195.00, 12, 8, '/images/trips/richelieu.jpg', 'Surin Islands, Thailand', 9.3667, 97.8500, 4.8, 267);
