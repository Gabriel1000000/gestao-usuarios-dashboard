package com.example.users.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI usersOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Users Management API")
                .description("API para CRUD de usuários e estatísticas (desafio)")
                .version("1.0.0")
                .contact(new Contact().name("Gabriel Alves Varella da Costa").email("gabriel.varella@gmail.com")).license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0.html"))

            ).externalDocs(new ExternalDocumentation()
                .description("Repositório no GitHub")
                .url("https://github.com/Gabriel1000000/gestao-usuarios-dashboard"));
            
    }
}
