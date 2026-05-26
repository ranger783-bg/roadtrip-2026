-- Seed: 3 profiles, 15 fixed stops, starter ideas near the main stops.
set search_path = public;

-- ---------- Profiles (replace placeholder emails with real ones before inviting) ----------
insert into profiles (id, email, name, display_color) values
  ('00000000-0000-0000-0000-0000000000a1', 'mom@example.com',     'Mom',   '#3c6e63'),
  ('00000000-0000-0000-0000-0000000000a2', 'dad@example.com',     'Dad',   '#3e7cb1'),
  ('00000000-0000-0000-0000-0000000000a3', 'ranger783@gmail.com', 'Brian', '#b5552f')
on conflict (id) do nothing;

-- ---------- Stops (mirror of src/lib/constants.ts STOPS) ----------
insert into stops (id, seq, name, address, city, state, lat, lng, arrival, departure, nights, type, color, blurb) values
  ('yuma-start',1,'Home — Yuma','14821 E 54th Dr, Yuma, AZ 85367','Yuma','AZ',32.6297392,-114.3773444,'2026-08-07','2026-08-07',0,'endpoint','#5b5247','Departure morning — load Tucker, the cooler, and hitch up the Casita.'),
  ('flagstaff',2,'Flagstaff KOA Holiday','5803 N US Highway 89, Flagstaff, AZ 86004','Flagstaff','AZ',35.2341051,-111.5774634,'2026-08-07','2026-08-11',4,'main','#d59a3c','Four nights at 7,000 ft in the pines. Cool escape, walkable downtown, gateway to the San Francisco Peaks.'),
  ('beaver',3,'Beaver KOA Journey','1428 N Manderfield Rd, Beaver, UT 84713','Beaver','UT',38.2945124,-112.6380486,'2026-08-11','2026-08-12',1,'overnight','#b8ad99','One-night stopover in small-town southern Utah.'),
  ('brigham',4,'Perry / Brigham City KOA','1040 W 3600 S, Perry, UT 84302','Perry','UT',41.4649365,-112.032445,'2026-08-12','2026-08-13',1,'overnight','#b8ad99','Overnight north of Salt Lake, near the fruit-way orchards.'),
  ('idaho-falls',5,'Snake River RV Park','1440 Lindsay Blvd, Idaho Falls, ID 83402','Idaho Falls','ID',43.5083074,-112.0550788,'2026-08-13','2026-08-14',1,'overnight','#b8ad99','Riverwalk along the Snake River; easy in-town stretch for Tucker.'),
  ('butte-out',6,'Butte KOA Journey','1601 Kaw Ave, Butte, MT 59701','Butte','MT',45.9934515,-112.5299884,'2026-08-14','2026-08-15',1,'overnight','#b8ad99','Historic mining town; one night before the Glacier push.'),
  ('west-glacier',7,'West Glacier RV Park & Cabins','350 River Bend Dr, West Glacier, MT 59936','West Glacier','MT',48.5036661,-113.9944297,'2026-08-15','2026-09-01',17,'main','#3c6e63','The big one — 17 nights at the doorstep of Glacier NP. Dogs are not allowed on park trails, so plan town + forest-road days for Tucker.'),
  ('butte-return',8,'Butte KOA Journey (return)','1601 Kaw Ave, Butte, MT 59701','Butte','MT',45.9934515,-112.5299884,'2026-09-01','2026-09-02',1,'overnight','#b8ad99','One night back in Butte en route to Yellowstone.'),
  ('yellowstone',9,'Fishing Bridge RV Park','Fishing Bridge RV Park, Yellowstone NP, WY 82190','Yellowstone','WY',44.5646,-110.3735,'2026-09-02','2026-09-07',5,'main','#b5552f','Five nights inside Yellowstone near Lake. Dogs are restricted to roads/parking, so pair park drives with dog-friendly outings.'),
  ('dubois',10,'Longhorn Ranch Lodge & RV Resort','5810 US Highway 26, Dubois, WY 82513','Dubois','WY',43.5336369,-109.6309651,'2026-09-07','2026-09-14',7,'main','#3e7cb1','A week in Dubois, the quiet back-door to the Tetons over Togwotee Pass. Big-sky scenic drives.'),
  ('lyman',11,'Lyman KOA Journey','1545 State Hwy 413, Lyman, WY 82937','Lyman','WY',41.327367,-110.292835,'2026-09-14','2026-09-15',1,'overnight','#b8ad99','Overnight in southwest Wyoming.'),
  ('fillmore',12,'Fillmore KOA Journey','410 W 900 S, Fillmore, UT 84631','Fillmore','UT',38.9489728,-112.3354563,'2026-09-15','2026-09-16',1,'overnight','#b8ad99','One night in central Utah.'),
  ('lake-powell',13,'Lake Powell Gateway RV Resort','25 S Ethan Allen, Big Water, UT 84741','Big Water','UT',37.0781107,-111.6620289,'2026-09-16','2026-09-17',1,'overnight','#b8ad99','Overnight near Lake Powell — red-rock country, dog-friendly shoreline access.'),
  ('payson',14,'Payson Campground & RV Resort','808 E State Hwy 260, Payson, AZ 85541','Payson','AZ',34.2832269,-111.3322283,'2026-09-17','2026-09-24',7,'main','#7d6b9c','A final week in the cool Mogollon Rim pines before the run home to Yuma.'),
  ('yuma-end',15,'Home — Yuma','14821 E 54th Dr, Yuma, AZ 85367','Yuma','AZ',32.6297392,-114.3773444,'2026-09-24','2026-09-24',0,'endpoint','#5b5247','Home again — 3,312 miles later.')
on conflict (id) do nothing;

-- ---------- Starter ideas ----------
insert into ideas (title, description, category, stop_id, map_query, cost_low, cost_high, dog_ok, in_town, low_walking, indoor, external_link) values
-- Flagstaff
('Historic Downtown Flagstaff','Walkable old-town blocks around Heritage Square — cafes, bookshops, breweries with dog-friendly patios. Flat and easy.','town','flagstaff','Heritage Square, Flagstaff, AZ',0,0,'yes',true,true,false,'https://www.flagstaffarizona.org/'),
('Lake Mary Road scenic drive','Easy paved drive south of town past Lower & Upper Lake Mary and into Coconino NF — pull-offs, picnic spots, gravel forest roads to wander with Tucker.','scenic_drive','flagstaff','Lake Mary Road, Flagstaff, AZ',0,0,'yes',false,true,false,null),
('Sunset Crater & Wupatki loop','35-mile paved loop past a cinder-cone volcano and ancestral pueblos. Mostly a windshield + short-walk outing; dogs stay on roads/parking and leashed.','scenic_drive','flagstaff','Sunset Crater Volcano National Monument, AZ',25,25,'maybe',false,true,false,'https://www.nps.gov/sucr/index.htm'),
('Lowell Observatory','Evening stargazing on Mars Hill — accessible, indoor + outdoor. Service dogs only. A good night out while Tucker rests at the camper.','sight','flagstaff','Lowell Observatory, Flagstaff, AZ',29,29,'no',true,true,true,'https://lowell.edu/'),
-- West Glacier / Glacier NP
('Going-to-the-Sun Road','The classic drive over Logan Pass. Stunning from the truck — but dogs are only allowed in the vehicle and parking areas, never on trails. Go early for parking.','scenic_drive','west-glacier','Going-to-the-Sun Road, Glacier National Park, MT',35,35,'maybe',false,true,false,'https://www.nps.gov/glac/planyourvisit/goingtothesunroad.htm'),
('Apgar Village & Lake McDonald','Easy paved village at the foot of Lake McDonald — pebble beach, benches, ice cream. Dogs OK on paved/developed areas; perfect low-key afternoon.','water','west-glacier','Apgar Village, Glacier National Park, MT',0,0,'yes',false,true,false,null),
('Whitefish town day','30 min from camp — walkable downtown, grocery runs, dog-friendly patios, lakeside city beach. Great for a resupply + easy day with Tucker.','town','west-glacier','Downtown Whitefish, MT',0,0,'yes',true,true,false,'https://explorewhitefish.com/'),
('Hungry Horse Reservoir forest drive','Outside the park in Flathead NF, so Tucker is welcome. Gravel forest roads circle a big reservoir — easy pull-offs, water access, no crowds.','forest_road','west-glacier','Hungry Horse Reservoir, MT',0,0,'yes',false,true,false,null),
-- Yellowstone
('Geyser basins driving loop','Old Faithful and the Upper/Midway basins by car with short boardwalk stops. Note: dogs are not allowed on boardwalks, so this is a take-turns day.','scenic_drive','yellowstone','Old Faithful, Yellowstone National Park, WY',0,0,'no',false,true,false,'https://www.nps.gov/yell/planyourvisit/exploring.htm'),
('Hayden & Lamar Valley wildlife drive','Best wildlife viewing in the park — bison, elk, often bears and wolves — all from pullouts along the road. Dogs ride along; bring binoculars.','wildlife','yellowstone','Hayden Valley, Yellowstone National Park, WY',0,0,'maybe',false,true,false,null),
('Lake Yellowstone at Fishing Bridge','Right by camp — stroll the lakeshore and historic Fishing Bridge area. Flat and quick.','water','yellowstone','Fishing Bridge, Yellowstone National Park, WY',0,0,'maybe',false,true,false,null),
-- Dubois / Tetons
('Togwotee Pass & Teton overlooks','Drive US-26/287 west over the pass for jaw-dropping Teton views from pullouts — no park entry needed, dogs welcome at the overlooks.','scenic_drive','dubois','Togwotee Pass, WY',0,0,'yes',false,true,false,null),
('Brooks Lake Road','A gravel forest road off the highway to a stunning lake ringed by cliffs, in Shoshone NF (not the park) — so Tucker can join. Easy lakeside strolling.','forest_road','dubois','Brooks Lake, Dubois, WY',0,0,'yes',false,true,false,null),
('Dubois town & Bighorn Sheep Center','Quirky small western town with a boardwalk, the National Bighorn Sheep Center, and easy cafes. Flat, in-town, dog-friendly outdoors.','town','dubois','National Bighorn Sheep Center, Dubois, WY',0,15,'maybe',true,true,true,'https://bighorn.org/'),
-- Payson / Mogollon Rim
('Mogollon Rim Road (FR 300)','The famous gravel rim road with overlook after overlook across the Tonto NF — dog-friendly, easy to drive in the F150, endless pull-offs.','forest_road','payson','Rim Road FR 300, Mogollon Rim, AZ',0,0,'yes',false,true,false,null),
('Woods Canyon Lake','Cool pine-rimmed lake atop the Rim with a flat, mostly-level shoreline trail. Dogs on leash welcome; popular but calm midweek.','water','payson','Woods Canyon Lake, AZ',8,8,'yes',false,true,false,null),
('Tonto Natural Bridge State Park','The world''s largest travertine arch. Steep trails to the bottom, but great viewpoints up top with minimal walking. Dogs allowed in day-use/parking areas.','sight','payson','Tonto Natural Bridge State Park, AZ',7,7,'maybe',false,true,false,'https://azstateparks.com/tonto/'),
('Green Valley Park, Payson','In-town park with three little lakes, paved paths, shade, and benches — an easy evening stroll with Tucker and a grocery stop nearby.','town','payson','Green Valley Park, Payson, AZ',0,0,'yes',true,true,false,null)
on conflict do nothing;
