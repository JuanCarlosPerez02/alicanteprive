-- ============================================================
-- Alicante Privé — Datos de prueba (seed completo)
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- Limpia todo y carga datos de muestra realistas
-- ============================================================

-- Limpiar en orden correcto (FK constraints)
delete from interes_propiedad;
delete from mensajes;
delete from propiedad_fotos;
delete from propiedades;
delete from contactos;

-- ============================================================
-- PROPIEDADES (12)
-- ============================================================
insert into propiedades (referencia, operacion, tipo, titulo, descripcion, precio, zona, direccion, lat, lng, metros, habitaciones, banos, caracteristicas, estado, destacada) values

('AP-001', 'venta', 'atico',
 '{"es":"Ático de lujo con terraza panorámica en Playa de San Juan","en":"Luxury penthouse with panoramic terrace in Playa de San Juan","fr":"Penthouse de luxe avec terrasse panoramique à Playa de San Juan","de":"Luxus-Penthouse mit Panoramaterrasse in Playa de San Juan"}',
 '{"es":"Espectacular ático de 3 habitaciones con una terraza de 80m² desde la que se disfrutan vistas impresionantes al Mediterráneo. Acabados de alta gama, suelos de mármol, cocina de diseño totalmente equipada y domótica de última generación. Imprescindible visita.","en":"Spectacular 3-bedroom penthouse with an 80m² terrace offering breathtaking Mediterranean views. High-end finishes, marble floors, fully equipped designer kitchen and state-of-the-art home automation. A must-see.","fr":"Spectaculaire penthouse de 3 chambres avec une terrasse de 80m² offrant une vue imprenable sur la Méditerranée. Finitions haut de gamme, sols en marbre, cuisine design équipée.","de":"Spektakuläres 3-Zimmer-Penthouse mit 80m² Terrasse und atemberaubendem Meerblick. Hochwertige Ausstattung, Marmorböden, voll ausgestattete Designerküche."}',
 485000, 'Playa San Juan', 'Av. Costa Blanca, Alicante', 38.3780, -0.4285, 130, 3, 2,
 '["ascensor","terraza","piscina","garaje","aire_acondicionado","vistas_al_mar","amueblado"]',
 'disponible', true),

('AP-002', 'venta', 'villa',
 '{"es":"Villa exclusiva con piscina privada en Cabo de las Huertas","en":"Exclusive villa with private pool in Cabo de las Huertas","fr":"Villa exclusive avec piscine privée au Cabo de las Huertas","de":"Exklusive Villa mit privatem Pool in Cabo de las Huertas"}',
 '{"es":"Magnífica villa de 5 dormitorios en la prestigiosa zona de Cabo de las Huertas, a tan solo 200 metros de la playa. Tres plantas con piscina privada, jardín mediterráneo de 600m², garaje para 3 vehículos y espectaculares vistas al mar. Acabados premium.","en":"Magnificent 5-bedroom villa in prestigious Cabo de las Huertas, just 200m from the beach. Three floors with private pool, 600m² Mediterranean garden, garage for 3 vehicles and spectacular sea views. Premium finishes.","fr":"Magnifique villa de 5 chambres dans le prestigieux secteur du Cabo de las Huertas, à 200m de la plage. Piscine privée, jardin de 600m², garage pour 3 véhicules, vues spectaculaires sur la mer.","de":"Wunderbare 5-Schlafzimmer-Villa in Cabo de las Huertas, nur 200m vom Strand. Privatpool, 600m² Garten, Garage für 3 Fahrzeuge, spektakulärer Meerblick."}',
 1350000, 'Cabo de las Huertas', 'Camino del Cabo, Alicante', 38.3548, -0.4108, 380, 5, 4,
 '["piscina","garaje","jardin","aire_acondicionado","calefaccion","vistas_al_mar","primera_linea","armarios"]',
 'disponible', true),

('AP-003', 'venta', 'piso',
 '{"es":"Piso luminoso con terraza en el Ensanche de Alicante","en":"Bright apartment with terrace in the Ensanche of Alicante","fr":"Appartement lumineux avec terrasse dans le quartier Ensanche d Alicante","de":"Helle Wohnung mit Terrasse im Ensanche von Alicante"}',
 '{"es":"Piso de 3 habitaciones completamente reformado en el distinguido barrio del Ensanche. Terraza de 20m², cocina moderna abierta al salón, suelos de parquet. A dos minutos a pie de la Explanada y del centro comercial.","en":"Completely refurbished 3-bedroom apartment in the distinguished Ensanche neighbourhood. 20m² terrace, modern open-plan kitchen, parquet floors. Two-minute walk from the Explanada.","fr":"Appartement de 3 chambres entièrement rénové dans le quartier de l Ensanche. Terrasse de 20m², cuisine moderne ouverte, parquets.","de":"Vollständig renovierte 3-Zimmer-Wohnung im Ensanche-Viertel. 20m² Terrasse, moderne offene Küche, Parkettböden."}',
 295000, 'Ensanche', 'C/ Pintor Lorenzo Casanova, Alicante', 38.3445, -0.4870, 108, 3, 2,
 '["ascensor","terraza","garaje","aire_acondicionado","trastero","exterior","luminoso"]',
 'disponible', true),

('AP-004', 'venta', 'chalet',
 '{"es":"Chalet independiente con jardín y piscina en Santa Bárbara","en":"Detached chalet with garden and pool in Santa Bárbara","fr":"Chalet individuel avec jardin et piscine à Santa Bárbara","de":"Freistehendes Chalet mit Garten und Pool in Santa Bárbara"}',
 '{"es":"Chalet independiente de 4 dormitorios en la tranquila urbanización de Santa Bárbara. Amplio jardín privado de 400m², piscina, barbacoa y garaje para 2 coches. Interior totalmente renovado con materiales de primera calidad. A 10 minutos del centro.","en":"Detached 4-bedroom chalet in the quiet Santa Bárbara area. Large 400m² private garden, pool, barbecue and garage for 2 cars. Fully renovated interior with top-quality materials. 10 minutes from the city centre.","fr":"Chalet individuel de 4 chambres à Santa Bárbara. Grand jardin de 400m², piscine, barbecue et garage pour 2 voitures. Intérieur entièrement rénové. À 10 minutes du centre.","de":"Freistehendes 4-Schlafzimmer-Chalet in Santa Bárbara. 400m² Garten, Pool, Grill, Garage für 2 Autos. Vollständig renoviert. 10 Minuten vom Zentrum."}',
 620000, 'Santa Bárbara', 'Urb. Santa Bárbara, Alicante', 38.3498, -0.4812, 220, 4, 3,
 '["piscina","garaje","jardin","aire_acondicionado","calefaccion","trastero","armarios","exterior"]',
 'disponible', false),

('AP-005', 'alquiler', 'piso',
 '{"es":"Piso moderno amueblado en el centro de Alicante","en":"Modern furnished apartment in Alicante city centre","fr":"Appartement moderne meublé au centre d Alicante","de":"Modernes möbliertes Apartment im Stadtzentrum Alicante"}',
 '{"es":"Precioso piso de 2 habitaciones totalmente amueblado en el corazón del centro histórico. Reforma integral reciente con cocina americana, baño moderno y salón con balcón. Ideal para parejas o profesionales. Incluye aire acondicionado y calefacción.","en":"Beautiful fully furnished 2-bedroom apartment in the heart of the historic centre. Recently fully renovated with open-plan kitchen, modern bathroom and living room with balcony. Ideal for couples or professionals.","fr":"Bel appartement de 2 chambres entièrement meublé au cœur du centre historique. Entièrement rénové, cuisine américaine, salle de bain moderne, salon avec balcon.","de":"Schöne, vollständig möblierte 2-Zimmer-Wohnung im Herzen des historischen Stadtzentrums. Komplett renoviert, offene Küche, modernes Bad, Wohnzimmer mit Balkon."}',
 1650, 'Alicante Centro', 'C/ Mayor, Alicante', 38.3452, -0.4814, 75, 2, 1,
 '["ascensor","aire_acondicionado","calefaccion","amueblado","exterior","luminoso"]',
 'disponible', false),

('AP-006', 'alquiler', 'atico',
 '{"es":"Ático con piscina comunitaria y vistas al mar en Albufereta","en":"Penthouse with communal pool and sea views in Albufereta","fr":"Penthouse avec piscine commune et vue mer à Albufereta","de":"Penthouse mit Gemeinschaftspool und Meerblick in Albufereta"}',
 '{"es":"Ático de 3 habitaciones con amplia terraza de 50m² y vistas al Mediterráneo. Complejo con piscina comunitaria y jardines. Completamente amueblado, cocina equipada, lavadora y aparcamiento incluido.","en":"3-bedroom penthouse with large 50m² terrace and Mediterranean views. Complex with communal pool and gardens. Fully furnished, equipped kitchen, washing machine and parking included.","fr":"Penthouse de 3 chambres avec grande terrasse de 50m² et vue méditerranéenne. Piscine commune, jardins. Entièrement meublé, cuisine équipée, parking inclus.","de":"3-Zimmer-Penthouse mit 50m² Terrasse und Meerblick. Gemeinschaftspool, Gärten. Vollständig möbliert, Küche, Stellplatz."}',
 2100, 'Albufereta', 'Av. de Villajoyosa, Alicante', 38.3630, -0.4340, 105, 3, 2,
 '["ascensor","terraza","piscina","garaje","aire_acondicionado","vistas_al_mar","amueblado","exterior"]',
 'disponible', true),

('AP-007', 'venta', 'villa',
 '{"es":"Villa moderna con vistas panorámicas en Gran Alacant","en":"Modern villa with panoramic views in Gran Alacant","fr":"Villa moderne avec vues panoramiques à Gran Alacant","de":"Moderne Villa mit Panoramablick in Gran Alacant"}',
 '{"es":"Moderna villa de nueva construcción en Gran Alacant con impresionantes vistas al mar y al faro de Santa Pola. Cuatro dormitorios en suite, salón de doble altura, cocina abierta de diseño y terraza perimetral. Piscina infinity y jardín paisajístico. A 15 minutos del aeropuerto.","en":"Modern newly built villa in Gran Alacant with impressive sea and Santa Pola lighthouse views. Four en-suite bedrooms, double-height living room, open design kitchen and perimeter terrace. Infinity pool and landscaped garden. 15 minutes from the airport.","fr":"Villa moderne à Gran Alacant avec vues impressionnantes sur la mer. Quatre chambres en suite, salon double hauteur, cuisine ouverte, piscine à débordement.","de":"Moderne Neubau-Villa in Gran Alacant mit beeindruckendem Meerblick. Vier En-Suite-Schlafzimmer, doppelhoher Salon, offene Küche, Infinity-Pool."}',
 520000, 'Gran Alacant', 'Urb. Gran Alacant, Santa Pola', 38.2143, -0.5784, 230, 4, 3,
 '["piscina","terraza","garaje","jardin","aire_acondicionado","vistas_al_mar","exterior"]',
 'disponible', true),

('AP-008', 'venta', 'adosado',
 '{"es":"Adosado 3 hab con patio privado en Vistahermosa","en":"3-bed townhouse with private patio in Vistahermosa","fr":"Maison de ville 3 ch avec patio privé à Vistahermosa","de":"Reihenhaus 3 Zimmer mit Privatpatio in Vistahermosa"}',
 '{"es":"Luminoso adosado en la urbanización de Vistahermosa. Tres dormitorios, dos baños, amplio salón-comedor, cocina con acceso a patio trasero privado. Garaje individual y trastero. Comunidad con piscina y zonas verdes. A 10 minutos de la playa del Postiguet.","en":"Bright townhouse in Vistahermosa. Three bedrooms, two bathrooms, large living-dining room, kitchen opening onto private patio. Individual garage and storage. Community pool and green areas. 10 minutes from Postiguet beach.","fr":"Maison de ville lumineuse à Vistahermosa. Trois chambres, deux salles de bain, salon-salle à manger, cuisine avec patio privé. Garage et débarras. Piscine communautaire.","de":"Helles Reihenhaus in Vistahermosa. Drei Schlafzimmer, zwei Bäder, Wohn-Esszimmer, Küche mit privatem Patio. Einzelgarage, Keller. Gemeinschaftspool."}',
 295000, 'Vistahermosa', 'Urb. Vistahermosa, Alicante', 38.3650, -0.4470, 175, 3, 2,
 '["garaje","trastero","aire_acondicionado","armarios","exterior"]',
 'reservada', false),

('AP-009', 'venta', 'duplex',
 '{"es":"Dúplex ático con terraza 120m² y vistas 360°, Centro","en":"Penthouse duplex with 120m² terrace and 360° views, Centre","fr":"Duplex penthouse avec terrasse 120m² et vue 360°, Centre","de":"Penthouse-Duplex mit 120m² Terrasse und 360°-Aussicht, Zentrum"}',
 '{"es":"Excepcional dúplex ático en el centro histórico de Alicante. Ocupa las dos últimas plantas del edificio con una impresionante terraza de 120m² con vistas de 360° a la ciudad, el Castillo de Santa Bárbara y el mar. Tres dormitorios, dos baños, salón de doble altura y cocina de diseño.","en":"Exceptional penthouse duplex in Alicante''s historic centre. Occupying the top two floors with an impressive 120m² terrace offering 360° views of the city, Santa Bárbara Castle and the sea. Three bedrooms, two bathrooms, double-height living room and designer kitchen.","fr":"Exceptionnel duplex penthouse au centre historique d Alicante. Terrasse de 120m² avec vues à 360° sur la ville et la mer. Trois chambres, deux salles de bain, salon double hauteur.","de":"Außergewöhnlicher Penthouse-Duplex im historischen Zentrum von Alicante. 120m² Terrasse mit 360°-Blick auf Stadt, Burg und Meer. Drei Schlafzimmer, doppelhoher Salon."}',
 385000, 'Alicante Centro', 'C/ del Teatro, Alicante', 38.3456, -0.4802, 160, 3, 2,
 '["terraza","ascensor","aire_acondicionado","vistas_al_mar","luminoso","armarios"]',
 'disponible', true),

('AP-010', 'venta', 'villa',
 '{"es":"Villa en primera línea de playa con acceso privado, Guardamar","en":"Beachfront villa with private access, Guardamar del Segura","fr":"Villa en bord de mer avec accès privé, Guardamar del Segura","de":"Strandvilla mit privatem Strandzugang, Guardamar del Segura"}',
 '{"es":"Excepcional villa de lujo en primera línea de playa en Guardamar del Segura. Una de las pocas propiedades con acceso privado directo a la playa. Cinco dormitorios, cuatro baños, gran salón, cocina profesional, piscina climatizada y garaje para tres vehículos. El parque natural de las dunas a un paso.","en":"Exceptional luxury villa on the beachfront in Guardamar del Segura. One of the few properties with direct private beach access. Five bedrooms, four bathrooms, large living room, professional kitchen, heated pool and garage for three vehicles.","fr":"Exceptionnelle villa de luxe en première ligne de plage à Guardamar del Segura. Accès privé direct à la plage. Cinq chambres, quatre salles de bain, piscine chauffée, garage pour trois véhicules.","de":"Außergewöhnliche Luxusvilla in erster Strandlinie in Guardamar del Segura. Privater Strandzugang. Fünf Schlafzimmer, vier Bäder, beheizter Pool, Garage für drei Fahrzeuge."}',
 750000, 'Guardamar del Segura', 'Av. del Mar, Guardamar del Segura', 38.0860, -0.6559, 380, 5, 4,
 '["piscina","garaje","terraza","jardin","primera_linea","vistas_al_mar","calefaccion","aire_acondicionado","amueblado"]',
 'disponible', true),

('AP-011', 'venta', 'piso',
 '{"es":"Piso de lujo con vistas al puerto, Marina Deportiva","en":"Luxury flat with port views, Marina Deportiva","fr":"Appartement de luxe avec vue sur le port, Marina Deportiva","de":"Luxuswohnung mit Hafenblick, Marina Deportiva"}',
 '{"es":"Elegante piso en el exclusivo complejo de la Marina Deportiva. Acabados de lujo: suelos de mármol, cocina Bulthaup, baños Porcelanosa. Vistas directas al puerto deportivo desde el salón y la terraza. Dos dormitorios en suite, trastero y plaza de garaje incluida. Conserjería 24h.","en":"Elegant flat in the exclusive Marina Deportiva complex. Luxury finishes: marble floors, Bulthaup kitchen, Porcelanosa bathrooms. Direct marina views from living room and terrace. Two en-suite bedrooms, storage and parking. 24h concierge.","fr":"Élégant appartement dans le complexe Marina Deportiva. Finitions de luxe: marbre, cuisine Bulthaup, salles de bain Porcelanosa. Vue directe sur le port. Deux chambres en suite, parking, conciergerie 24h.","de":"Elegante Wohnung im Marina Deportiva Komplex. Luxuriöse Ausstattung: Marmor, Bulthaup-Küche, Porcelanosa-Bäder. Direkter Blick auf den Sporthafen. Zwei En-Suite-Schlafzimmer, 24h-Concierge."}',
 495000, 'Marina Deportiva', 'Muelle Poniente, Alicante', 38.3346, -0.4803, 110, 2, 2,
 '["terraza","garaje","trastero","ascensor","aire_acondicionado","vistas_al_mar","portero","luminoso"]',
 'vendida', false),

('AP-012', 'alquiler', 'estudio',
 '{"es":"Estudio amueblado en alquiler, Alicante Centro","en":"Furnished studio for rent, Alicante Centre","fr":"Studio meublé à louer, Centre d Alicante","de":"Möbliertes Studio zur Miete, Stadtzentrum Alicante"}',
 '{"es":"Moderno estudio completamente amueblado y equipado en el centro de Alicante. Ideal para profesionales o estudiantes. Cocina americana con todos los electrodomésticos, zona de trabajo, baño completo y cama de matrimonio. Wifi y gastos de comunidad incluidos.","en":"Modern fully furnished and equipped studio in the centre of Alicante. Ideal for professionals or students. Open kitchen with all appliances, work area, full bathroom and double bed. Wifi and community fees included.","fr":"Studio moderne entièrement meublé au centre d Alicante. Idéal pour professionnels ou étudiants. Cuisine avec électroménager, coin travail, salle de bain, lit double. Wifi inclus.","de":"Modernes, vollständig möbliertes Studio im Zentrum Alicantes. Ideal für Berufstätige oder Studenten. Offene Küche, Arbeitsbereich, Bad, Doppelbett. WLAN inklusive."}',
 750, 'Alicante Centro', 'C/ San Francisco, Alicante', 38.3451, -0.4812, 45, 1, 1,
 '["amueblado","aire_acondicionado","ascensor","luminoso","portero"]',
 'alquilada', false);

-- ============================================================
-- FOTOS (usando subquery sobre referencia para evitar UUIDs hardcoded)
-- ============================================================

-- AP-001 Ático Playa San Juan
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap001a/1200/800', 0, true  from propiedades where referencia='AP-001';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap001b/1200/800', 1, false from propiedades where referencia='AP-001';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap001c/1200/800', 2, false from propiedades where referencia='AP-001';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap001d/1200/800', 3, false from propiedades where referencia='AP-001';

-- AP-002 Villa Cabo de las Huertas
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap002a/1200/800', 0, true  from propiedades where referencia='AP-002';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap002b/1200/800', 1, false from propiedades where referencia='AP-002';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap002c/1200/800', 2, false from propiedades where referencia='AP-002';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap002d/1200/800', 3, false from propiedades where referencia='AP-002';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap002e/1200/800', 4, false from propiedades where referencia='AP-002';

-- AP-003 Piso Ensanche
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap003a/1200/800', 0, true  from propiedades where referencia='AP-003';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap003b/1200/800', 1, false from propiedades where referencia='AP-003';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap003c/1200/800', 2, false from propiedades where referencia='AP-003';

-- AP-004 Chalet Santa Bárbara
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap004a/1200/800', 0, true  from propiedades where referencia='AP-004';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap004b/1200/800', 1, false from propiedades where referencia='AP-004';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap004c/1200/800', 2, false from propiedades where referencia='AP-004';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap004d/1200/800', 3, false from propiedades where referencia='AP-004';

-- AP-005 Piso alquiler Centro
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap005a/1200/800', 0, true  from propiedades where referencia='AP-005';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap005b/1200/800', 1, false from propiedades where referencia='AP-005';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap005c/1200/800', 2, false from propiedades where referencia='AP-005';

-- AP-006 Ático alquiler Albufereta
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap006a/1200/800', 0, true  from propiedades where referencia='AP-006';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap006b/1200/800', 1, false from propiedades where referencia='AP-006';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap006c/1200/800', 2, false from propiedades where referencia='AP-006';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap006d/1200/800', 3, false from propiedades where referencia='AP-006';

-- AP-007 Villa Gran Alacant
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap007a/1200/800', 0, true  from propiedades where referencia='AP-007';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap007b/1200/800', 1, false from propiedades where referencia='AP-007';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap007c/1200/800', 2, false from propiedades where referencia='AP-007';

-- AP-008 Adosado Vistahermosa
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap008a/1200/800', 0, true  from propiedades where referencia='AP-008';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap008b/1200/800', 1, false from propiedades where referencia='AP-008';

-- AP-009 Dúplex Centro
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap009a/1200/800', 0, true  from propiedades where referencia='AP-009';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap009b/1200/800', 1, false from propiedades where referencia='AP-009';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap009c/1200/800', 2, false from propiedades where referencia='AP-009';

-- AP-010 Villa Guardamar
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap010a/1200/800', 0, true  from propiedades where referencia='AP-010';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap010b/1200/800', 1, false from propiedades where referencia='AP-010';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap010c/1200/800', 2, false from propiedades where referencia='AP-010';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap010d/1200/800', 3, false from propiedades where referencia='AP-010';

-- AP-011 Piso Marina Deportiva (vendida)
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap011a/1200/800', 0, true  from propiedades where referencia='AP-011';
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap011b/1200/800', 1, false from propiedades where referencia='AP-011';

-- AP-012 Estudio alquiler Centro (alquilada)
insert into propiedad_fotos (propiedad_id, url, orden, es_portada)
select id, 'https://picsum.photos/seed/ap012a/1200/800', 0, true  from propiedades where referencia='AP-012';

-- ============================================================
-- CONTACTOS (8)
-- ============================================================
insert into contactos (nombre, email, telefono, origen, notas, preferencias, created_at) values

('Carlos Martínez López', 'carlos.martinez@gmail.com', '+34 653 421 780', 'web',
 'Busca villa en primera línea o cerca del mar. Presupuesto flexible. Interesado en compra para residencia habitual. Visitó AP-002 y AP-010.',
 '{"activo":true,"operacion":"venta","tipo":["villa","chalet"],"presupuesto_max":1000000,"metros_min":200,"habitaciones_min":4,"zonas_preferidas":[{"nombre":"Cabo de las Huertas","lat":38.3567,"lng":-0.4152,"radio_km":3},{"nombre":"Guardamar del Segura","lat":38.086,"lng":-0.6559,"radio_km":5}]}',
 now() - interval '60 days'),

('Sarah Johnson', 'sarah.johnson@outlook.com', '+44 7700 123456', 'idealista',
 'British buyer relocating to Alicante for retirement. Interested in 3+ bed properties near beach. Pre-approved mortgage from UK bank. Very motivated buyer.',
 '{"activo":true,"operacion":"venta","tipo":["piso","atico"],"presupuesto_max":500000,"metros_min":100,"habitaciones_min":3,"zonas_preferidas":[{"nombre":"Playa San Juan","lat":38.372,"lng":-0.4175,"radio_km":5}]}',
 now() - interval '55 days'),

('Hans Mueller', 'hans.mueller@web.de', '+49 170 5678901', 'fotocasa',
 'Alemán. Busca segunda residencia vacacional. Presupuesto hasta 650K. Visita Alicante cada verano. Habla español básico, mejor inglés.',
 '{"activo":true,"operacion":"venta","tipo":["villa","chalet","adosado"],"presupuesto_max":650000,"metros_min":150,"habitaciones_min":3,"zonas_preferidas":[{"nombre":"El Campello","lat":38.437,"lng":-0.3942,"radio_km":10},{"nombre":"Gran Alacant","lat":38.2143,"lng":-0.5784,"radio_km":8}]}',
 now() - interval '48 days'),

('María García Pérez', 'mgarcia@hotmail.es', '+34 689 345 217', 'web',
 'Clienta local. Vende piso actual e invierte en algo más grande. Niños en edad escolar, prefiere zona norte de Alicante. Espera vender antes de comprometerse.',
 '{"activo":true,"operacion":"venta","tipo":["piso","chalet","adosado"],"presupuesto_max":320000,"metros_min":90,"habitaciones_min":3}',
 now() - interval '40 days'),

('Pierre Dupont', 'p.dupont@free.fr', '+33 6 12 34 56 78', 'web',
 'Francés buscando propiedad de inversión para alquiler turístico. Quiere zona con alta demanda vacacional. Conoce bien el mercado español.',
 '{"activo":true,"operacion":"venta","tipo":["piso","atico"],"presupuesto_max":250000,"metros_min":60,"habitaciones_min":2,"zonas_preferidas":[{"nombre":"Playa San Juan","lat":38.372,"lng":-0.4175,"radio_km":3}]}',
 now() - interval '35 days'),

('Ana Rodríguez Sánchez', 'ana.rodriguez@icloud.com', '+34 612 876 543', 'idealista',
 'Busca piso en alquiler larga duración. Trabaja en el centro. Presupuesto hasta 1.000€/mes. Prefiere no compartir. Tiene coche.',
 '{"activo":true,"operacion":"alquiler","tipo":["piso","estudio"],"presupuesto_max":1000,"habitaciones_min":1,"zonas_preferidas":[{"nombre":"Alicante Centro","lat":38.3452,"lng":-0.481,"radio_km":2}]}',
 now() - interval '28 days'),

('James Wilson', 'jwilson@btinternet.com', '+44 7912 456789', 'manual',
 'British expat ya residente en Alicante. Busca villa más grande. Puede considerar áticos de lujo con vistas. Referido por cliente anterior.',
 '{"activo":true,"operacion":"venta","tipo":["villa","atico","chalet"],"presupuesto_max":900000,"metros_min":200,"habitaciones_min":4}',
 now() - interval '20 days'),

('Elena Ferrer Molina', 'elena.ferrer@gmail.com', '+34 677 234 891', 'fotocasa',
 'Inversora local. Busca pisos para reformar y revender. Interesa precio bajo mercado o reforma necesaria. Tiene equipo de reformas propio.',
 '{"activo":false}',
 now() - interval '15 days');

-- ============================================================
-- MENSAJES (12)
-- Usamos subqueries para evitar UUIDs hardcoded
-- ============================================================

-- Carlos → AP-002 (villa Cabo)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'web',
  'Buenos días, he visto la villa AP-002 en Cabo de las Huertas y me gustaría concertar una visita. Tengo disponibilidad cualquier tarde esta semana. ¿Es posible? Muchas gracias.',
  true, now() - interval '55 days'
from contactos c, propiedades p
where c.email='carlos.martinez@gmail.com' and p.referencia='AP-002';

-- Sarah → AP-001 (ático PSJ)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'idealista',
  'Hello, I am very interested in the penthouse at Playa San Juan (AP-001). Could you provide more information about the building fees and whether there is a parking space? I would also like to arrange a viewing. Kind regards, Sarah.',
  true, now() - interval '50 days'
from contactos c, propiedades p
where c.email='sarah.johnson@outlook.com' and p.referencia='AP-001';

-- Hans → AP-004 (chalet Santa Bárbara)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'fotocasa',
  'Guten Tag, ich interessiere mich sehr für das Chalet in Santa Bárbara (AP-004). Ich plane, im Juli nach Alicante zu kommen und würde gerne einen Besichtigungstermin vereinbaren. Können Sie mir bitte mehr Details über die Gemeinschaftskosten mitteilen? Mit freundlichen Grüßen, Hans Mueller.',
  true, now() - interval '44 days'
from contactos c, propiedades p
where c.email='hans.mueller@web.de' and p.referencia='AP-004';

-- María → AP-003 (piso Ensanche)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'web',
  'Hola, me interesa el piso del Ensanche (AP-003). Actualmente tenemos piso propio que vamos a vender. ¿Podríais ayudarnos también con la venta? ¿Hacéis tasaciones? Gracias.',
  false, now() - interval '38 days'
from contactos c, propiedades p
where c.email='mgarcia@hotmail.es' and p.referencia='AP-003';

-- Pierre → AP-001 (ático PSJ, inversión)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'web',
  'Bonjour, je cherche un appartement pour investissement locatif. Cet ático me semble intéressant. Quelle est la rentabilité locative estimée pour cette zone? Y a-t-il une licence touristique ou est-il possible d en obtenir une? Cordialement, Pierre.',
  false, now() - interval '30 days'
from contactos c, propiedades p
where c.email='p.dupont@free.fr' and p.referencia='AP-001';

-- Ana → AP-005 (piso alquiler Centro)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'idealista',
  'Hola, me interesa el piso de alquiler en el centro (AP-005). ¿Está disponible para entrar el 1 de septiembre? ¿Se permiten mascotas pequeñas? Gracias.',
  true, now() - interval '25 days'
from contactos c, propiedades p
where c.email='ana.rodriguez@icloud.com' and p.referencia='AP-005';

-- James → AP-002 (villa Cabo)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'manual',
  'Hi, James Wilson here. I was referred to you by a friend who bought through you last year. I''m looking at the Cabo de las Huertas villa (AP-002) but it might be slightly over budget. Do you have anything similar in the 700-850K range with sea views? Happy to visit anytime.',
  true, now() - interval '18 days'
from contactos c, propiedades p
where c.email='jwilson@btinternet.com' and p.referencia='AP-002';

-- Elena → AP-003 (piso Ensanche, negociación)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'fotocasa',
  'Hola, soy inversora y el piso del Ensanche (AP-003) me interesa. ¿Cuánto llevan de reforma? ¿Hay ITE pendiente o derramas previstas? ¿Aceptaría el propietario una oferta por debajo del precio? Gracias.',
  false, now() - interval '14 days'
from contactos c, propiedades p
where c.email='elena.ferrer@gmail.com' and p.referencia='AP-003';

-- Carlos → AP-010 (villa Guardamar)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'web',
  'Buenos días, también me ha llamado la atención la villa de Guardamar (AP-010). Primera línea de playa es exactamente lo que busco. ¿Cuánto llevan en el mercado? ¿Hay margen de negociación en el precio?',
  false, now() - interval '10 days'
from contactos c, propiedades p
where c.email='carlos.martinez@gmail.com' and p.referencia='AP-010';

-- Sarah → AP-009 (dúplex Centro)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'idealista',
  'Hello again, I also noticed the duplex penthouse in the historic centre (AP-009). The 360° terrace sounds amazing. Is it possible to visit both AP-001 and AP-009 on the same day? I''m planning to fly to Alicante in two weeks.',
  true, now() - interval '7 days'
from contactos c, propiedades p
where c.email='sarah.johnson@outlook.com' and p.referencia='AP-009';

-- María → sin propiedad concreta (consulta general)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, null, 'web',
  'Hola, además de lo que os pregunté por el piso del Ensanche, ¿tenéis algún adosado o casa con jardín por menos de 300.000€ en zona norte de Alicante? Gracias de nuevo.',
  false, now() - interval '4 days'
from contactos c
where c.email='mgarcia@hotmail.es';

-- Hans → AP-007 (villa Gran Alacant)
insert into mensajes (contacto_id, propiedad_id, origen, texto, leido, recibido_en)
select c.id, p.id, 'fotocasa',
  'Hallo, ich habe auch die Villa in Gran Alacant gesehen (AP-007). Der Preis ist sehr interessant. Ist es möglich, AP-004 und AP-007 an einem Tag zu besichtigen? Ich könnte den 15. Juli vorschlagen.',
  false, now() - interval '1 day'
from contactos c, propiedades p
where c.email='hans.mueller@web.de' and p.referencia='AP-007';

-- ============================================================
-- INTERESES / LEADS (15)
-- Respetamos unique(contacto_id, propiedad_id)
-- ============================================================

-- Carlos → AP-002 (visitó, negocia precio)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'web', 'visito',
  'Visitó en mayo. Le encantó pero negocia el precio. Quiere cerrar por debajo de 1.280.000€.'
from contactos c, propiedades p
where c.email='carlos.martinez@gmail.com' and p.referencia='AP-002';

-- Carlos → AP-010 (nuevo, pendiente visita)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'web', 'nuevo',
  'Acaba de preguntar. Pendiente de confirmar visita presencial.'
from contactos c, propiedades p
where c.email='carlos.martinez@gmail.com' and p.referencia='AP-010';

-- Carlos → AP-008 (descartado)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'web', 'descartado',
  'No le convenció. Prefiere primera línea de mar, no zona interior.'
from contactos c, propiedades p
where c.email='carlos.martinez@gmail.com' and p.referencia='AP-008';

-- Sarah → AP-001 (visita pendiente)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'idealista', 'visita_pendiente',
  'Viene a Alicante en 2 semanas. Visita programada para AP-001 y AP-009 el mismo día.'
from contactos c, propiedades p
where c.email='sarah.johnson@outlook.com' and p.referencia='AP-001';

-- Sarah → AP-009 (contactado)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'idealista', 'contactado',
  'Interesada en visitar junto con AP-001.'
from contactos c, propiedades p
where c.email='sarah.johnson@outlook.com' and p.referencia='AP-009';

-- Sarah → AP-010 (sugerida por agencia)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'manual', 'nuevo',
  'Sugerida por nosotros ya que cumple su perfil. Pendiente de feedback.'
from contactos c, propiedades p
where c.email='sarah.johnson@outlook.com' and p.referencia='AP-010';

-- Hans → AP-004 (visitó, pendiente banco)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'fotocasa', 'visito',
  'Visitó en julio. Muy interesado, pendiente de confirmación de financiación de su banco alemán.'
from contactos c, propiedades p
where c.email='hans.mueller@web.de' and p.referencia='AP-004';

-- Hans → AP-007 (visita pendiente)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'fotocasa', 'visita_pendiente',
  'Quiere verla el mismo día que AP-004 en julio.'
from contactos c, propiedades p
where c.email='hans.mueller@web.de' and p.referencia='AP-007';

-- María → AP-003 (contactado, espera venta)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'web', 'contactado',
  'Interesada pero espera vender su piso actual. Seguimiento previsto para septiembre.'
from contactos c, propiedades p
where c.email='mgarcia@hotmail.es' and p.referencia='AP-003';

-- Pierre → AP-001 (nuevo, consulta rentabilidad)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'web', 'nuevo',
  'Consulta sobre rentabilidad para alquiler turístico. Pendiente de respuesta sobre licencia.'
from contactos c, propiedades p
where c.email='p.dupont@free.fr' and p.referencia='AP-001';

-- Ana → AP-005 (cerrado, fechas no encajan)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'idealista', 'cerrado',
  'Finalmente no encaja. Necesita entrada en septiembre y el piso ya está comprometido hasta octubre.'
from contactos c, propiedades p
where c.email='ana.rodriguez@icloud.com' and p.referencia='AP-005';

-- Ana → AP-012 (estudio, contactado)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'manual', 'contactado',
  'Alternativa sugerida: estudio AP-012. Le enviamos info.'
from contactos c, propiedades p
where c.email='ana.rodriguez@icloud.com' and p.referencia='AP-012';

-- James → AP-002 (contactado, referido)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'manual', 'contactado',
  'Referido. Le interesa pero busca algo más económico. Enviarle villa AP-007 como alternativa.'
from contactos c, propiedades p
where c.email='jwilson@btinternet.com' and p.referencia='AP-002';

-- James → AP-007 (nuevo, sugerida)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'manual', 'nuevo',
  'Alternativa sugerida a AP-002. Pendiente de que la vea.'
from contactos c, propiedades p
where c.email='jwilson@btinternet.com' and p.referencia='AP-007';

-- Elena → AP-003 (no visitó)
insert into interes_propiedad (contacto_id, propiedad_id, origen, estado, notas)
select c.id, p.id, 'fotocasa', 'no_visito',
  'Preguntó por precio y margen de negociación. Enviamos info pero no respondió.'
from contactos c, propiedades p
where c.email='elena.ferrer@gmail.com' and p.referencia='AP-003';

-- ============================================================
-- Verificación rápida
-- ============================================================
select
  (select count(*) from propiedades)       as propiedades,
  (select count(*) from propiedad_fotos)   as fotos,
  (select count(*) from contactos)         as contactos,
  (select count(*) from mensajes)          as mensajes,
  (select count(*) from interes_propiedad) as intereses;
