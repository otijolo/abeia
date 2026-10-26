package br.unifor.abeia.controller;

import br.unifor.abeia.model.Producao;
import br.unifor.abeia.service.ProducaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Produção", description = "Endpoints para registro e acompanhamento de colheitas e produção")
public class ProducaoController {

    private final ProducaoService producaoService;

    public ProducaoController(ProducaoService producaoService) {
        this.producaoService = producaoService;
    }

    /**
     * GET /api/producoes - Lista todas as produções
     */
    @GetMapping
    @Operation(summary = "Listar produções", description = "Retorna todos os registros de colheita/produção.")
    public ResponseEntity<List<Producao>> listar() {
        return ResponseEntity.ok(producaoService.listarTodas());
    }

    /**
     * GET /api/producoes/{id} - Busca uma produção pelo ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Buscar produção por ID", description = "Retorna os detalhes de um registro de produção específico.")
    public ResponseEntity<Producao> buscarPorId(@PathVariable String id) {
        return producaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/producoes/colmeia/{colmeiaId} - Lista produções de uma colmeia
     */
    @GetMapping("/colmeia/{colmeiaId}")
    @Operation(summary = "Listar produções por colmeia", description = "Retorna o histórico de colheitas de uma colmeia específica.")
    public ResponseEntity<List<Producao>> listarPorColmeia(
            @Parameter(description = "ID da colmeia")
            @PathVariable String colmeiaId) {
        return ResponseEntity.ok(producaoService.listarPorColmeia(colmeiaId));
    }

    /**
     * POST /api/producoes - Registra uma nova produção
     */
    @PostMapping
    @Operation(summary = "Registrar colheita", description = "Cadastra uma nova colheita de mel ou produto apícola.")
    public ResponseEntity<Producao> criar(@RequestBody Producao producao) {
        Producao criada = producaoService.criar(producao);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    /**
     * PUT /api/producoes/{id} - Atualiza uma produção existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar produção", description = "Atualiza os dados de um registro de colheita existente.")
    public ResponseEntity<Producao> atualizar(@PathVariable String id, @RequestBody Producao dados) {
        return producaoService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/producoes/{id} - Exclui uma produção
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir produção", description = "Remove um registro de produção do sistema.")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        if (producaoService.excluir(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
