CREATE TABLE ElectricVehicles (
    City VARCHAR(255),
    State VARCHAR(255),
    "Postal Code" VARCHAR(10),
    "Model Year" INT,
    Make VARCHAR(255),
    Model VARCHAR(255),
    "Electric Vehicle Type" VARCHAR(255),
    "Electric Range" INT,
    Latitude DECIMAL(10, 6),
    Longitude DECIMAL(10, 6),
    "Fuel Type Code" INT,
    ZIP INT,
    "Groups With Access Code" INT,
    "EV Network" INT,
    "EV Network Web" INT,
    "Open Date" INT,
    Country VARCHAR(255),
    "Access Code" INT,
    "Access Detail Code" INT,
    "Facility Type" VARCHAR(255),
    "EV Pricing" DECIMAL(10, 2),
    "EV On-Site Renewable Source" VARCHAR(255),
    "Restricted Access" DECIMAL(10, 2)
);

SELECT * FROM ElectricVehicles;

DROP TABLE ElectricVehicles;

