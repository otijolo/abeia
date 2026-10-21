package br.unifor.abeia.controller;

import br.unifor.abeia.model.Producao;
import br.unifor.abeia.service.ProducaoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST de Produção na arquitetura MVC.
 * Endpoint base: /api/producoes
 */
@RestController
@RequestMapping("/api/producoes")
@CrossOrigin(origins = "*")
public class ProducaoController {

    private final ProducaoService producaoService;

    public ProducaoController(ProducaoService producaoService) {
        this.producaoService = producaoService;
    }

    /**
     * GET /api/producoes - Lista todas as produções
     */
    @GetMapping
    public ResponseEntity<List<Producao>> listar() {
        return ResponseEntity.ok(producaoService.listarTodas());
    }

    /**
     * GET /api/producoes/{id} - Busca uma produção pelo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Producao> buscarPorId(@PathVariable String id) {
        return producaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/producoes/colmeia/{colmeiaId} - Lista produções de uma colmeia
     */
    @GetMapping("/colmeia/{colmeiaId}")
    public ResponseEntity<List<Producao>> listarPorColmeia(@PathVariable String colmeiaId) {
        return ResponseEntity.ok(producaoService.listarPorColmeia(colmeiaId));
    }

    /**
     * POST /api/producoes - Registra uma nova produção
     */
    @PostMapping
    public ResponseEntity<Producao> criar(@RequestBody Producao producao) {
        Producao criada = producaoService.criar(producao);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    /**
     * PUT /api/producoes/{id} - Atualiza uma produção existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Producao> atualizar(@PathVariable String id, @RequestBody Producao dados) {
        return producaoService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/producoes/{id} - Exclui uma produção
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        if (producaoService.excluir(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
