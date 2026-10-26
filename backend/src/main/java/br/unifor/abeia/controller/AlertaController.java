package br.unifor.abeia.controller;

import br.unifor.abeia.model.Alerta;
import br.unifor.abeia.service.AlertaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST de Alertas na arquitetura MVC.
 * Endpoint base: /api/alertas
 */
@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
@Tag(name = "Alertas", description = "Endpoints para gerenciamento e acompanhamento de alertas apícolas")
public class AlertaController {

    private final AlertaService alertaService;

    public AlertaController(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    /**
     * GET /api/alertas - Lista todos os alertas
     */
    @GetMapping
    @Operation(summary = "Listar alertas", description = "Retorna todos os alertas cadastrados no sistema.")
    public ResponseEntity<List<Alerta>> listar() {
        return ResponseEntity.ok(alertaService.listarTodos());
    }

    /**
     * GET /api/alertas/{id} - Busca um alerta pelo ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Buscar alerta por ID", description = "Retorna os detalhes de um alerta específico.")
    public ResponseEntity<Alerta> buscarPorId(@PathVariable String id) {
        return alertaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/alertas - Cria um novo alerta
     */
    @PostMapping
    @Operation(summary = "Criar alerta", description = "Cadastra um novo alerta para monitoramento.")
    public ResponseEntity<Alerta> criar(@RequestBody Alerta alerta) {
        Alerta criado = alertaService.criar(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * PUT /api/alertas/{id} - Atualiza um alerta existente
     */
    @PutMapping("/{id}")
    @Operation(summary = "Atualizar alerta", description = "Atualiza os dados completos de um alerta existente.")
    public ResponseEntity<Alerta> atualizar(@PathVariable String id, @RequestBody Alerta dados) {
        return alertaService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /api/alertas/{id}/estado - Atualiza apenas o estado do alerta (ativo/resolvido/ignorado)
     */
    @PatchMapping("/{id}/estado")
    @Operation(summary = "Atualizar estado do alerta", description = "Altera o estado do alerta (ex.: ativo, resolvido, ignorado).")
    public ResponseEntity<Alerta> atualizarEstado(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String novoEstado = payload.get("estado");
        if (novoEstado == null || novoEstado.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return alertaService.atualizarEstado(id, novoEstado)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/alertas/{id} - Exclui um alerta
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir alerta", description = "Remove um alerta do sistema permanentemente.")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        if (alertaService.excluir(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
