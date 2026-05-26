-- Photos for the 18 seed ideas. Wikimedia Commons (CC/PD, hotlink-safe), all verified 200 + image/jpeg.
set search_path = public;

update ideas i set photo_url = v.url
from (values
  ('Historic Downtown Flagstaff',           'https://upload.wikimedia.org/wikipedia/commons/5/5a/Flagstaff_AZ_-_downtown_hotel.jpg'),
  ('Lake Mary Road scenic drive',           'https://upload.wikimedia.org/wikipedia/commons/6/64/Sunflowers_at_Lake_Mary.jpg'),
  ('Sunset Crater & Wupatki loop',          'https://upload.wikimedia.org/wikipedia/commons/d/db/Sunsetcrater13.JPG'),
  ('Lowell Observatory',                    'https://upload.wikimedia.org/wikipedia/commons/a/a1/Clark_dome.jpg'),
  ('Going-to-the-Sun Road',                 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Going-to-the-Sun_Road_-_Glacier_National_Park.jpg'),
  ('Apgar Village & Lake McDonald',         'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Lake_McDonald_winter.jpg/3840px-Lake_McDonald_winter.jpg'),
  ('Whitefish town day',                    'https://upload.wikimedia.org/wikipedia/commons/f/fa/Downtown-whitefish-2006.jpg'),
  ('Hungry Horse Reservoir forest drive',   'https://upload.wikimedia.org/wikipedia/commons/8/8c/Hngryh2.jpg'),
  ('Geyser basins driving loop',            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Yellowstone_National_Park_%28WY%2C_USA%29%2C_Old_Faithful_Geyser_--_2022_--_2599.jpg/3840px-Yellowstone_National_Park_%28WY%2C_USA%29%2C_Old_Faithful_Geyser_--_2022_--_2599.jpg'),
  ('Hayden & Lamar Valley wildlife drive',  'https://upload.wikimedia.org/wikipedia/commons/f/ff/HaydenValley1977JSchmidt.jpg'),
  ('Lake Yellowstone at Fishing Bridge',    'https://upload.wikimedia.org/wikipedia/commons/5/50/Visitors_walking_on_shore_of_Yellowstone_Lake_%287543310824%29.jpg'),
  ('Togwotee Pass & Teton overlooks',       'https://upload.wikimedia.org/wikipedia/commons/6/60/Grand_Teton_GTNP1.jpg'),
  ('Brooks Lake Road',                      'https://upload.wikimedia.org/wikipedia/commons/6/6a/Pinnacle_Buttes%2C_Wyoming.jpg'),
  ('Dubois town & Bighorn Sheep Center',    'https://upload.wikimedia.org/wikipedia/commons/3/36/Dubois%2C_Wyoming.jpg'),
  ('Mogollon Rim Road (FR 300)',            'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/The_Mogollon_Rim_northeast_of_Payson%2C_Arizona.jpg/3840px-The_Mogollon_Rim_northeast_of_Payson%2C_Arizona.jpg'),
  ('Woods Canyon Lake',                     'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Woods_Canyon_Lake_Arizona.jpg/3840px-Woods_Canyon_Lake_Arizona.jpg'),
  ('Tonto Natural Bridge State Park',       'https://upload.wikimedia.org/wikipedia/commons/7/76/Tonto_Natural_Bridge_%2824102183557%29.jpg'),
  ('Green Valley Park, Payson',             'https://upload.wikimedia.org/wikipedia/commons/0/0d/Green_Valley_Park%2C_Payson_Arizona.jpg')
) as v(title, url)
where i.title = v.title;

select count(*) filter (where photo_url is not null) as with_photo, count(*) as total from ideas;
