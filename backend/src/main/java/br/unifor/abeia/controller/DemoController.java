package br.unifor.abeia.controller;

import br.unifor.abeia.model.Perfil;
import br.unifor.abeia.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller utilitário para povoar ou resetar os dados de teste sob demanda.
 */
@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
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
