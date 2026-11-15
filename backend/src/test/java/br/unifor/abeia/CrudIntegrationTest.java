package br.unifor.abeia;

import com.sun.net.httpserver.HttpServer;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.AfterAll;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Exercita os endpoints com o mesmo JSON enviado pelos formulários. */
@SpringBootTest
@AutoConfigureMockMvc
class CrudIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    static final ObjectMapper fixtureJson = new ObjectMapper();
    static final Map<String, JsonNode> dados = new ConcurrentHashMap<>();
    static volatile boolean bancoIndisponivel;
    static final HttpServer firebase = iniciarFirebase();

    static HttpServer iniciarFirebase() {
        try {
            HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            server.createContext("/", exchange -> {
                String path = exchange.getRequestURI().getPath();
                String body = "null";
                int status = 200;
                if (path.equals("/accounts:lookup")) {
                    String token = fixtureJson.readTree(exchange.getRequestBody()).path("idToken").asText();
                    if (!token.equals("token-a") && !token.equals("token-b")) status = 400;
                    else body = "{\"users\":[{\"localId\":\"usuario-" + token.substring(6) + "\"}]}";
                } else if (bancoIndisponivel) {
                    status = 503;
                } else {
                    String chave = path.replaceFirst("^/usuarios/", "").replaceFirst("\\.json$", "");
                    String uid = chave.split("/")[0];
                    if (!exchange.getRequestURI().getQuery().equals("auth=token-" + uid.substring(8))) status = 401;
                    else switch (exchange.getRequestMethod()) {
                        case "GET" -> {
                            if (dados.containsKey(chave)) body = dados.get(chave).toString();
                            else {
                                ObjectNode resultado = fixtureJson.createObjectNode();
                                String prefixo = chave + "/";
                                dados.forEach((key, valor) -> {
                                    if (key.startsWith(prefixo) && !key.substring(prefixo.length()).contains("/"))
                                        resultado.set(key.substring(prefixo.length()), valor);
                                });
                                if (!resultado.isEmpty()) body = resultado.toString();
                            }
                        }
                        case "PUT" -> {
                            dados.put(chave, fixtureJson.readTree(exchange.getRequestBody()));
                            body = dados.get(chave).toString();
                        }
                        case "DELETE" -> dados.keySet().removeIf(key -> key.equals(chave) || key.startsWith(chave + "/"));
                        default -> status = 405;
                    }
                }
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(status, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.close();
            });
            server.start();
            return server;
        } catch (Exception error) { throw new IllegalStateException(error); }
    }

    @DynamicPropertySource
    static void propriedades(DynamicPropertyRegistry registry) {
        String url = "http://127.0.0.1:" + firebase.getAddress().getPort();
        registry.add("firebase.auth-url", () -> url);
        registry.add("firebase.database-url", () -> url);
    }

    @AfterAll
    static void finalizar() { firebase.stop(0); }

    @BeforeEach
    void preparar() throws Exception {
        dados.clear();
        bancoIndisponivel = false;
        dados.put("usuario-a/colmeias/d03", fixtureJson.readTree("{\"id\":\"d03\",\"nome\":\"Colmeia D03\",\"apiarioId\":\"sabia\"}"));
    }

    @Test
    void alertaPodeSerCriadoConsultadoEditadoResolvidoEExcluido() throws Exception {
        String dados = """
                {"titulo":"Inspeção pendente","motivo":"Conferir os quadros","status":"atencao",
                 "estado":"ativo","origem":"Colmeia D03","colmeiaId":"d03","afetados":["D03"]}
                """;
        String resposta = mvc.perform(post("/api/alertas").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String id = json.readTree(resposta).get("id").asText();
        mvc.perform(get("/api/alertas").header("Authorization", "Bearer token-a")).andExpect(jsonPath("$[0].id").value(id));
        JsonNode atualizado = json.readTree(dados.replace("Inspeção pendente", "Inspeção reagendada").replace("\"colmeiaId\":\"d03\"", "\"colmeiaId\":\"\""));
        mvc.perform(put("/api/alertas/" + id).header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(atualizado.toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.colmeiaId").value(""));
        mvc.perform(get("/api/alertas/" + id).header("Authorization", "Bearer token-a")).andExpect(jsonPath("$.titulo").value("Inspeção reagendada"));
        mvc.perform(patch("/api/alertas/" + id + "/estado").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"resolvido\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.estado").value("resolvido"));
        mvc.perform(patch("/api/alertas/" + id + "/estado").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"inexistente\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(delete("/api/alertas/" + id).header("Authorization", "Bearer token-a")).andExpect(status().isNoContent());
        mvc.perform(get("/api/alertas/" + id).header("Authorization", "Bearer token-a")).andExpect(status().isNotFound());
        mvc.perform(post("/api/alertas").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content("{\"titulo\":\" \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void producaoPodeSerEditadaSemAceitarValoresOuDatasInvalidos() throws Exception {
        String dados = """
                {"colmeiaId":"d03","data":"02/11/2026","quantidade":12.5,"unidade":"kg","observacoes":"Colheita de teste"}
                """;
        String resposta = mvc.perform(post("/api/producoes").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String id = json.readTree(resposta).get("id").asText();
        mvc.perform(put("/api/producoes/" + id).header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados.replace("12.5", "18.75")))
                .andExpect(status().isOk());
        mvc.perform(get("/api/producoes/" + id).header("Authorization", "Bearer token-a")).andExpect(jsonPath("$.quantidade").value(18.75));
        mvc.perform(get("/api/producoes/colmeia/d03").header("Authorization", "Bearer token-a")).andExpect(jsonPath("$[0].id").value(id));
        for (String invalido : new String[] { dados.replace("12.5", "-1"), dados.replace("02/11/2026", "31/02/2026"),
                dados.replace("d03", "colmeia-inexistente"), dados.replace("\"kg\"", "\"toneladas\"") }) {
            mvc.perform(put("/api/producoes/" + id).header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(invalido))
                    .andExpect(status().isBadRequest());
        }
        mvc.perform(get("/api/producoes/" + id).header("Authorization", "Bearer token-a")).andExpect(jsonPath("$.quantidade").value(18.75));
        mvc.perform(delete("/api/producoes/" + id).header("Authorization", "Bearer token-a")).andExpect(status().isNoContent());
        mvc.perform(get("/api/producoes/" + id).header("Authorization", "Bearer token-a")).andExpect(status().isNotFound());
    }

    @Test
    void perfilTemCrudPorIdentificadorSemSobrescreverOutroUsuario() throws Exception {
        String dados = "{\"nome\":\"Ana Silva\",\"email\":\"ana@example.com\",\"telefone\":\"85999999999\"}";
        mvc.perform(get("/api/perfil/usuario-a").header("Authorization", "Bearer token-a")).andExpect(status().isNoContent());
        mvc.perform(post("/api/perfil/usuario-a").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.id").value("usuario-a"))
                .andExpect(jsonPath("$.iniciais").value("AS"));
        mvc.perform(post("/api/perfil/usuario-a").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isConflict());
        mvc.perform(post("/api/perfil/usuario-b").header("Authorization", "Bearer token-b").contentType(MediaType.APPLICATION_JSON).content(dados.replace("Ana Silva", "Bia Lima")))
                .andExpect(status().isCreated());
        mvc.perform(put("/api/perfil/usuario-a").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados.replace("Ana Silva", "Ana Costa")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.iniciais").value("AC"));
        mvc.perform(get("/api/perfil/usuario-a").header("Authorization", "Bearer token-a")).andExpect(jsonPath("$.nome").value("Ana Costa"));
        mvc.perform(put("/api/perfil/usuario-a").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados.replace("ana@example.com", "invalido")))
                .andExpect(status().isBadRequest());
        mvc.perform(delete("/api/perfil/usuario-a").header("Authorization", "Bearer token-a")).andExpect(status().isNoContent());
        mvc.perform(get("/api/perfil/usuario-a").header("Authorization", "Bearer token-a")).andExpect(status().isNoContent());
        mvc.perform(get("/api/perfil/usuario-b").header("Authorization", "Bearer token-b")).andExpect(jsonPath("$.nome").value("Bia Lima"));
        mvc.perform(put("/api/perfil/usuario-a").header("Authorization", "Bearer token-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isNotFound());
    }

    @Test
    void apiExigeTokenESeparaDadosEntreUsuarios() throws Exception {
        mvc.perform(get("/api/apiarios")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/apiarios").header("Authorization", "Bearer token-falso"))
                .andExpect(status().isUnauthorized());
        String resposta = mvc.perform(post("/api/apiarios").header("Authorization", "Bearer token-a")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Meu apiário\",\"cidade\":\"Fortaleza\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String id = json.readTree(resposta).path("id").asText();
        assertTrue(dados.containsKey("usuario-a/apiarios/" + id));
        mvc.perform(get("/api/apiarios/" + id).header("Authorization", "Bearer token-b"))
                .andExpect(status().isNotFound());
        mvc.perform(delete("/api/apiarios/" + id).header("Authorization", "Bearer token-b"))
                .andExpect(status().isNotFound());
        mvc.perform(get("/api/apiarios").header("Authorization", "Bearer token-b"))
                .andExpect(content().json("[]"));
        mvc.perform(get("/api/perfil/usuario-a").header("Authorization", "Bearer token-b"))
                .andExpect(status().isForbidden());
        mvc.perform(get("/health")).andExpect(status().isOk());
        mvc.perform(get("/api-docs")).andExpect(status().isOk())
                .andExpect(jsonPath("$.components.securitySchemes.firebase.scheme").value("bearer"));
    }

    @Test
    void falhaNoBancoNaoViraListaVaziaNemGravacaoBemSucedida() throws Exception {
        bancoIndisponivel = true;
        mvc.perform(get("/api/apiarios").header("Authorization", "Bearer token-a"))
                .andExpect(status().isBadGateway());
        mvc.perform(post("/api/apiarios").header("Authorization", "Bearer token-a")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Teste\"}"))
                .andExpect(status().isBadGateway());
    }

    @Test
    void preflightPermiteSomenteOrigensDoAplicativo() throws Exception {
        mvc.perform(options("/api/apiarios").header("Origin", "https://abeia-cc22d.web.app")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://abeia-cc22d.web.app"));
        mvc.perform(options("/api/apiarios").header("Origin", "https://outro.example")
                        .header("Access-Control-Request-Method", "POST"))
                .andExpect(status().isForbidden());
    }

    @Test
    void colmeiaMantemContagemERecebeResumoDaInspecao() throws Exception {
        dados.put("usuario-a/apiarios/sabia", fixtureJson.readTree("{\"id\":\"sabia\",\"nome\":\"Sabiá\",\"totalColmeias\":1}"));
        String resposta = mvc.perform(post("/api/colmeias").header("Authorization", "Bearer token-a")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nome\":\"Colmeia nova\",\"apiarioId\":\"sabia\"}"))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String id = json.readTree(resposta).path("id").asText();
        mvc.perform(get("/api/apiarios/sabia").header("Authorization", "Bearer token-a"))
                .andExpect(jsonPath("$.totalColmeias").value(2));
        mvc.perform(post("/api/inspecoes").header("Authorization", "Bearer token-a")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"colmeiaId\":\"" + id + "\",\"status\":\"normal\",\"resumo\":\"Colônia forte\",\"quadrosCria\":4}"))
                .andExpect(status().isCreated());
        mvc.perform(get("/api/colmeias/" + id).header("Authorization", "Bearer token-a"))
                .andExpect(jsonPath("$.ultimaInspecao.resumo").value("Colônia forte"))
                .andExpect(jsonPath("$.ultimaInspecao.detalhes[0]").value("4 quadros com cria"));
        mvc.perform(delete("/api/colmeias/" + id).header("Authorization", "Bearer token-a"))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/apiarios/sabia").header("Authorization", "Bearer token-a"))
                .andExpect(jsonPath("$.totalColmeias").value(1));
    }
}
