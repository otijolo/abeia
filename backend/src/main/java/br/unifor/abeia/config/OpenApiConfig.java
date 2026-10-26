package br.unifor.abeia.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Configuração do OpenAPI 3 / Swagger para documentação dos endpoints da API Abeia.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI abeiaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("API Abeia - Gestão Apícola (Unifor)")
                        .description("Documentação interativa da API REST do projeto Abeia. " +
                                "Endpoints para gerenciamento de apiários, colmeias, inspeções, alertas, produção e perfil.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipe Abeia - Unifor")
                                .email("suporte@abeia.unifor.br"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
                .servers(List.of(
                        new Server().url("http://localhost:8088").description("Ambiente Local de Desenvolvimento")
                ));
    }
}
