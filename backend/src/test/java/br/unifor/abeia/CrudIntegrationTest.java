package br.unifor.abeia;

import br.unifor.abeia.repository.*;
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
    @Autowired ColmeiaRepository colmeias;
    @Autowired AlertaRepository alertas;
    @Autowired ProducaoRepository producoes;
    @Autowired PerfilRepository perfis;

    @BeforeEach
    void preparar() {
        alertas.limpar();
        producoes.limpar();
        perfis.limpar();
        colmeias.limpar();
        colmeias.semearDadosIniciais();
    }

    @Test
    void alertaPodeSerCriadoConsultadoEditadoResolvidoEExcluido() throws Exception {
        String dados = """
                {"titulo":"Inspeção pendente","motivo":"Conferir os quadros","status":"atencao",
                 "estado":"ativo","origem":"Colmeia D03","colmeiaId":"d03","afetados":["D03"]}
                """;
        String resposta = mvc.perform(post("/api/alertas").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String id = json.readTree(resposta).get("id").asText();
        mvc.perform(get("/api/alertas")).andExpect(jsonPath("$[0].id").value(id));
        JsonNode atualizado = json.readTree(dados.replace("Inspeção pendente", "Inspeção reagendada").replace("\"colmeiaId\":\"d03\"", "\"colmeiaId\":\"\""));
        mvc.perform(put("/api/alertas/" + id).contentType(MediaType.APPLICATION_JSON).content(atualizado.toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.colmeiaId").value(""));
        mvc.perform(get("/api/alertas/" + id)).andExpect(jsonPath("$.titulo").value("Inspeção reagendada"));
        mvc.perform(patch("/api/alertas/" + id + "/estado").contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"resolvido\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.estado").value("resolvido"));
        mvc.perform(patch("/api/alertas/" + id + "/estado").contentType(MediaType.APPLICATION_JSON).content("{\"estado\":\"inexistente\"}"))
                .andExpect(status().isBadRequest());
        mvc.perform(delete("/api/alertas/" + id)).andExpect(status().isNoContent());
        mvc.perform(get("/api/alertas/" + id)).andExpect(status().isNotFound());
        mvc.perform(post("/api/alertas").contentType(MediaType.APPLICATION_JSON).content("{\"titulo\":\" \"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void producaoPodeSerEditadaSemAceitarValoresOuDatasInvalidos() throws Exception {
        String dados = """
                {"colmeiaId":"d03","data":"02/11/2026","quantidade":12.5,"unidade":"kg","observacoes":"Colheita de teste"}
                """;
        String resposta = mvc.perform(post("/api/producoes").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        String id = json.readTree(resposta).get("id").asText();
        mvc.perform(put("/api/producoes/" + id).contentType(MediaType.APPLICATION_JSON).content(dados.replace("12.5", "18.75")))
                .andExpect(status().isOk());
        mvc.perform(get("/api/producoes/" + id)).andExpect(jsonPath("$.quantidade").value(18.75));
        mvc.perform(get("/api/producoes/colmeia/d03")).andExpect(jsonPath("$[0].id").value(id));
        for (String invalido : new String[] { dados.replace("12.5", "-1"), dados.replace("02/11/2026", "31/02/2026"),
                dados.replace("d03", "colmeia-inexistente"), dados.replace("\"kg\"", "\"toneladas\"") }) {
            mvc.perform(put("/api/producoes/" + id).contentType(MediaType.APPLICATION_JSON).content(invalido))
                    .andExpect(status().isBadRequest());
        }
        mvc.perform(get("/api/producoes/" + id)).andExpect(jsonPath("$.quantidade").value(18.75));
        mvc.perform(delete("/api/producoes/" + id)).andExpect(status().isNoContent());
        mvc.perform(get("/api/producoes/" + id)).andExpect(status().isNotFound());
    }

    @Test
    void perfilTemCrudPorIdentificadorSemSobrescreverOutroUsuario() throws Exception {
        String dados = "{\"nome\":\"Ana Silva\",\"email\":\"ana@example.com\",\"telefone\":\"85999999999\"}";
        mvc.perform(get("/api/perfil/usuario-a")).andExpect(status().isNoContent());
        mvc.perform(post("/api/perfil/usuario-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.id").value("usuario-a"))
                .andExpect(jsonPath("$.iniciais").value("AS"));
        mvc.perform(post("/api/perfil/usuario-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isConflict());
        mvc.perform(post("/api/perfil/usuario-b").contentType(MediaType.APPLICATION_JSON).content(dados.replace("Ana Silva", "Bia Lima")))
                .andExpect(status().isCreated());
        mvc.perform(put("/api/perfil/usuario-a").contentType(MediaType.APPLICATION_JSON).content(dados.replace("Ana Silva", "Ana Costa")))
                .andExpect(status().isOk()).andExpect(jsonPath("$.iniciais").value("AC"));
        mvc.perform(get("/api/perfil/usuario-a")).andExpect(jsonPath("$.nome").value("Ana Costa"));
        mvc.perform(put("/api/perfil/usuario-a").contentType(MediaType.APPLICATION_JSON).content(dados.replace("ana@example.com", "invalido")))
                .andExpect(status().isBadRequest());
        mvc.perform(delete("/api/perfil/usuario-a")).andExpect(status().isNoContent());
        mvc.perform(get("/api/perfil/usuario-a")).andExpect(status().isNoContent());
        mvc.perform(get("/api/perfil/usuario-b")).andExpect(jsonPath("$.nome").value("Bia Lima"));
        mvc.perform(put("/api/perfil/usuario-a").contentType(MediaType.APPLICATION_JSON).content(dados))
                .andExpect(status().isNotFound());
    }
}
