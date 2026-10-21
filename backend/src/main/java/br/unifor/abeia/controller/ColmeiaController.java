package br.unifor.abeia.controller;

import br.unifor.abeia.model.Colmeia;
import br.unifor.abeia.service.ColmeiaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST de Colmeias na arquitetura MVC.
 * Endpoint base: /api/colmeias
 */
@RestController
@RequestMapping("/api/colmeias")
@CrossOrigin(origins = "*")
public class ColmeiaController {

    private final ColmeiaService colmeiaService;

    public ColmeiaController(ColmeiaService colmeiaService) {
        this.colmeiaService = colmeiaService;
    }

    /**
     * GET /api/colmeias - Lista todas as colmeias (com filtro opcional por apiarioId)
     */
    @GetMapping
    public ResponseEntity<List<Colmeia>> listar(@RequestParam(required = false) String apiarioId) {
        if (apiarioId != null && !apiarioId.isBlank()) {
            return ResponseEntity.ok(colmeiaService.listarPorApiario(apiarioId));
        }
        return ResponseEntity.ok(colmeiaService.listarTodas());
    }

    /**
     * GET /api/colmeias/{id} - Busca uma colmeia por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Colmeia> buscarPorId(@PathVariable String id) {
        return colmeiaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/colmeias - Cadastra uma nova colmeia
     */
    @PostMapping
    public ResponseEntity<Colmeia> criar(@RequestBody Colmeia colmeia) {
        Colmeia criada = colmeiaService.criar(colmeia);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    /**
     * PUT /api/colmeias/{id} - Atualiza uma colmeia existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Colmeia> atualizar(@PathVariable String id, @RequestBody Colmeia dados) {
        return colmeiaService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/colmeias/{id} - Exclui uma colmeia
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        if (colmeiaService.excluir(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
