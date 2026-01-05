package utils

import (
	"database/sql"
	"fmt"
	"os"

	_ "modernc.org/sqlite"
)

func InitDB(dbPath string) (*sql.DB, error) {
	// Criar pasta se não existir
	if _, err := os.Stat("db"); os.IsNotExist(err) {
		err := os.Mkdir("db", os.ModePerm)
		if err != nil {
			return nil, fmt.Errorf("erro ao criar pasta db: %v", err)
		}
	}

	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("erro ao abrir banco: %v", err)
	}

	createTableSQL := `
	CREATE TABLE IF NOT EXISTS url_mapping (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		shorten_url TEXT NOT NULL UNIQUE,
		original_url TEXT NOT NULL
	);
	`
	_, err = db.Exec(createTableSQL)
	if err != nil {
		return nil, fmt.Errorf("erro ao criar tabela: %v", err)
	}

	return db, nil
}
