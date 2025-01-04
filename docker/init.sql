CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    author TEXT NOT NULL,
    author_id UUID NOT NULL,
    created_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL,
    ingredients TEXT[] NOT NULL,
    steps TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    login TEXT NOT NULL,
    full_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    recipes INTEGER NOT NULL,
    created_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    rating INTEGER,
    comment TEXT,
    created_date TIMESTAMP NOT NULL,
    updated_date TIMESTAMP NOT NULL,
    UNIQUE (user_id, recipe_id)
);

INSERT INTO recipes (id, name, created_date, updated_date, ingredients, author, author_id, steps, description) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Spaghetti Bolognese', '2023-01-01 12:00:00', '2023-01-01 12:00:00', '{"spaghetti", "mielone mięso", "sos pomidorowy"}', 'Jan Kowalski', '550e8400-e29b-41d4-a716-446655440001', '{"Ugotuj spaghetti", "Usmaż mięso", "Wymieszaj z sosem"}', 'Klasyczne włoskie danie makaronowe.'),
('123e4567-e89b-12d3-a456-426614174000', 'Kurczak Curry', '2023-01-02 12:00:00', '2023-01-02 12:00:00', '{"kurczak", "przyprawa curry", "mleko kokosowe"}', 'Anna Nowak', '123e4567-e89b-12d3-a456-426614174001', '{"Usmaż kurczaka", "Dodaj przyprawę curry", "Wlej mleko kokosowe"}', 'Pikantne i aromatyczne curry.'),
('9b2e4d6c-8f3b-4a2e-9f3b-4a2e9f3b4a2e', 'Tacos z Wołowiną', '2023-01-03 12:00:00', '2023-01-03 12:00:00', '{"tortille", "mielona wołowina", "sałata", "ser"}', 'Carlos Mendez', '9b2e4d6c-8f3b-4a2e-9f3b-4a2e9f3b4a2f', '{"Usmaż wołowinę", "Złóż tacos", "Podaj z dodatkami"}', 'Pyszne meksykańskie tacos.'),
('1b4e28ba-2fa1-11d2-883f-0016d3cca427', 'Warzywne Stir Fry', '2023-01-04 12:00:00', '2023-01-04 12:00:00', '{"brokuły", "marchewki", "papryki", "sos sojowy"}', 'Alicja Kowalska', '1b4e28ba-2fa1-11d2-883f-0016d3cca428', '{"Pokrój warzywa", "Smaż z sosem sojowym", "Podaj na gorąco"}', 'Zdrowe i szybkie stir fry.'),
('6fa459ea-ee8a-3ca4-894e-db77e160355e', 'Naleśniki', '2023-01-05 12:00:00', '2023-01-05 12:00:00', '{"mąka", "mleko", "jajka", "syrop"}', 'Robert Brązowy', '6fa459ea-ee8a-3ca4-894e-db77e160355f', '{"Wymieszaj składniki", "Smaż na patelni", "Podaj z syropem"}', 'Puszyste naleśniki na śniadanie.') ON CONFLICT (id) DO NOTHING;
