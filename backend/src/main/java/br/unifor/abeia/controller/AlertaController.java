package br.unifor.abeia.controller;

import br.unifor.abeia.model.Alerta;
import br.unifor.abeia.service.AlertaService;
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
public class AlertaController {

    private final AlertaService alertaService;

    public AlertaController(AlertaService alertaService) {
        this.alertaService = alertaService;
    }

    /**
     * GET /api/alertas - Lista todos os alertas
     */
    @GetMapping
    public ResponseEntity<List<Alerta>> listar() {
        return ResponseEntity.ok(alertaService.listarTodos());
    }

    /**
     * GET /api/alertas/{id} - Busca um alerta pelo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Alerta> buscarPorId(@PathVariable String id) {
        return alertaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/alertas - Cria um novo alerta
     */
    @PostMapping
    public ResponseEntity<Alerta> criar(@RequestBody Alerta alerta) {
        Alerta criado = alertaService.criar(alerta);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * PUT /api/alertas/{id} - Atualiza um alerta existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Alerta> atualizar(@PathVariable String id, @RequestBody Alerta dados) {
        return alertaService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PATCH /api/alertas/{id}/estado - Atualiza apenas o estado do alerta (ativo/resolvido/ignorado)
     */
    @PatchMapping("/{id}/estado")
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
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        if (alertaService.excluir(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
