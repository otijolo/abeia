package br.unifor.abeia;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ponto de entrada da aplicação Spring Boot - Abeia (Unifor).
 * Arquitetura MVC com Controllers REST, Services e Repositories.
 */
@SpringBootApplication
public class AbeiaApplication {

    public static void main(String[] args) {
        SpringApplication.run(AbeiaApplication.class, args);
    }
}
