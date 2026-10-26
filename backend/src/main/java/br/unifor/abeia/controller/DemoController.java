package br.unifor.abeia.controller;

import br.unifor.abeia.model.Perfil;
import br.unifor.abeia.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller utilitário para povoar ou resetar os dados de teste sob demanda.
 */
@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
@Tag(name = "Demonstração", description = "Utilitários para semear dados de teste e resetar os repositórios em memória")
public class DemoController {

    private final ApiarioRepository apiarioRepository;
    private final ColmeiaRepository colmeiaRepository;
    private final ProducaoRepository producaoRepository;
    private final AlertaRepository alertaRepository;
    private final InspecaoRepository inspecaoRepository;
    private final PerfilRepository perfilRepository;

    public DemoController(ApiarioRepository apiarioRepository,
                          ColmeiaRepository colmeiaRepository,
                          ProducaoRepository producaoRepository,
                          AlertaRepository alertaRepository,
                          InspecaoRepository inspecaoRepository,
                          PerfilRepository perfilRepository) {
        this.apiarioRepository = apiarioRepository;
        this.colmeiaRepository = colmeiaRepository;
        this.producaoRepository = producaoRepository;
        this.alertaRepository = alertaRepository;
        this.inspecaoRepository = inspecaoRepository;
        this.perfilRepository = perfilRepository;
    }

    /**
     * POST /api/demo/seed - Povoa os repositórios com dados de exemplo.
     */
    @PostMapping("/seed")
    @Operation(summary = "Semear dados de demonstração", description = "Preenche os repositórios em memória com apiários, colmeias, inspeções, alertas, produções e perfil de exemplo.")
    public ResponseEntity<Map<String, String>> semear() {
        apiarioRepository.semearDadosIniciais();
        colmeiaRepository.semearDadosIniciais();
        producaoRepository.semearDadosIniciais();
        alertaRepository.semearDadosIniciais();
        inspecaoRepository.semearDadosIniciais();
        perfilRepository.salvar(new Perfil("usr-1", "Ildo Ramos", "ildo@email.com", "IR", "(85) 98888-7777"));

        return ResponseEntity.ok(Map.of("mensagem", "Dados de demonstração inseridos com sucesso!"));
    }

    /**
     * DELETE /api/demo/reset - Limpa todos os dados em memória.
     */
    @DeleteMapping("/reset")
    @Operation(summary = "Resetar todos os dados", description = "Esvazia todos os repositórios em memória.")
    public ResponseEntity<Map<String, String>> resetar() {
        apiarioRepository.limpar();
        colmeiaRepository.limpar();
        producaoRepository.limpar();
        alertaRepository.limpar();
        inspecaoRepository.limpar();
        perfilRepository.limpar();

        return ResponseEntity.ok(Map.of("mensagem", "Todos os dados foram resetados!"));
    }
}
