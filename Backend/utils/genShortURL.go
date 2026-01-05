package utils

import (
	"math/rand"
	"time"
)

func GenShortURL() string {
	rand.Seed(time.Now().UnixNano())

	caracteres := []rune{
		'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j',
		'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u',
		'v', 'w', 'x', 'y', 'z',
		'1', '2', '3', '4', '5', '6', '7', '8', '9',
	}

	codigo := make([]rune, 6)
	for i := 0; i < 6; i++ {
		indice := rand.Intn(len(caracteres))
		codigo[i] = caracteres[indice]
	}

	return string(codigo)
}