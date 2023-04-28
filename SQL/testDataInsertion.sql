SET search_path TO cars;
INSERT INTO avatar(image) VALUES ('image1');
INSERT INTO avatar(image) VALUES ('image2');

INSERT INTO car(password, query_id, pseudo, id_avatar) VALUES ('1234', '4356', 'PlayerOne', 1);
INSERT INTO car(password, query_id, pseudo, id_avatar) VALUES ('4321', '4357', 'PlayerTwo', 2);

INSERT INTO section(label, password) VALUES ('Informatique', '$2a$12$gtnqqRe8dLCkTAyN9nmMF.Ugvc6gr2a2fqD.TYLJ3onjKFxgqWhmW');
INSERT INTO section(label, password) VALUES ('Automatique', '$2a$12$ZqkedbzE3tPHR.xTX2pgmu9DEF2ErmbU/SfzH4EB8ZOQPRzhx0fY2');
INSERT INTO section(label, password) VALUES ('Horlogerie', '$2a$12$9.wBt3QzyLOpPLJulJ82e.zd1ZS2UIaoZJJRuBskvZyJn2/0lXjxS');
INSERT INTO section(label, password) VALUES ('Electronique', '$2a$12$xE2VXGD6E7C56oa.Yeq1DOu5B3w.zk98IF..yqsyQFb/kmsAMaCD6');
INSERT INTO section(label, password) VALUES ('Micromécanique', '$2a$12$L9HsTZhPjQveaGL/owD83eHsx9xCMzUKDkyEVD94BSvxMhBqTTHsm');
INSERT INTO section(label, password) VALUES ('Laborantin', '$2a$12$yNRyGjnlgDqsFuE9JqvMCO4kDXP0hTO08w1ld6L9uum7GwOSXbaQK');
INSERT INTO section(label, password) VALUES ('Dessinateur', '$2a$12$dkt1tp0LW54GtQ6qoPYwgOkBMj1/x/qb/1nLeNa2hvGsdBqCYLlNm');

INSERT INTO activity(label, id_section) VALUES ('Informer', 1);
INSERT INTO activity(label, id_section) VALUES ('Automatiser', 2);
INSERT INTO activity(label, id_section) VALUES ('Horlogifier', 3);
INSERT INTO activity(label, id_section) VALUES ('Electroniser', 4);
INSERT INTO activity(label, id_section) VALUES ('Micromécaniser', 5);
INSERT INTO activity(label, id_section) VALUES ('Laborantiser', 6);
INSERT INTO activity(label, id_section) VALUES ('Dessiner', 7);

INSERT INTO realise(id_car, id_activity, date_time) VALUES (1, 1, '2023-03-31 09:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (1, 2, '2023-03-31 10:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (1, 3, '2023-03-31 11:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (1, 4, '2023-03-31 12:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (1, 5, '2023-03-31 13:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (1, 6, '2023-03-31 14:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (1, 7, '2023-03-31 15:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (2, 1, '2023-03-31 09:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (2, 3, '2023-03-31 10:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (2, 2, '2023-03-31 11:25:32');
INSERT INTO realise(id_car, id_activity, date_time) VALUES (2, 7, '2023-03-31 11:55:32');

INSERT INTO race(id_car, realisation_date_time, sector_one) VALUES (1, '2023-03-31 12:55:32', '00:25.125');
INSERT INTO race(id_car, realisation_date_time, sector_one) VALUES (2, '2023-03-31 11:55:32', '00:24.125');
INSERT INTO race(id_car, realisation_date_time, sector_one) VALUES (1, '2023-03-31 13:55:32', '00:23.125');

