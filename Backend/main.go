package main

import (
	"fmt"
	"database/sql"
	"log"
	"net/http"

	"go-shortener-URL/utils"

	"github.com/gin-gonic/gin"
	_ "modernc.org/sqlite"
)


func insertURL(db *sql.DB, originalURL string) (string, error) {
	short := utils.GenShortURL()

	_, err := db.Exec(
		"INSERT INTO url_mapping (shorten_url, original_url) VALUES (?, ?)",
		short,
		originalURL,
	)

	if err != nil {
		return "", err
	}

	return short, nil
}


func getOriginalURL(db *sql.DB, shortenURL string) (string, error) {
	var originalURL string

	err := db.QueryRow(
		"SELECT original_url FROM url_mapping WHERE shorten_url = ?",
		shortenURL,
	).Scan(&originalURL)

	if err != nil {
		if err == sql.ErrNoRows {
			return "", fmt.Errorf("shorten_url não encontrada")
		}
		return "", err
	}

	return originalURL, nil
}


func main() {
	db, err := utils.InitDB("db/urls.db")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	r := gin.Default()

	// Front envia APENAS a string da URL
	r.POST("/shorten", func(c *gin.Context) {
		var originalURL string

		if err := c.ShouldBindJSON(&originalURL); err != nil {
			c.JSON(http.StatusBadRequest, "URL inválida")
			return
		}

		short, err := insertURL(db, originalURL)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		c.JSON(http.StatusOK, "https://gabriellauro.space/"+short)
	})

	// Redirect
	r.GET("/:short", func(c *gin.Context) {
		short := c.Param("short")

		originalURL, err := getOriginalURL(db, short)
		if err != nil {
			c.JSON(http.StatusNotFound, "URL não encontrada")
			return
		}

		c.Redirect(http.StatusMovedPermanently, originalURL)
	})

	r.Run(":8080")
}
 