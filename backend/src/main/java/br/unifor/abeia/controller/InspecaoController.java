package br.unifor.abeia.controller;

import br.unifor.abeia.model.Inspecao;
import br.unifor.abeia.service.InspecaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST de Inspeções na arquitetura MVC.
 * Endpoint base: /api/inspecoes
 */
@RestController
@RequestMapping("/api/inspecoes")
@CrossOrigin(origins = "*")
@Tag(name = "Inspeções", description = "Endpoints para registro e acompanhamento de inspeções apícolas")
public class InspecaoController {

    private final InspecaoService inspecaoService;

    public InspecaoController(InspecaoService inspecaoService) {
        this.inspecaoService = inspecaoService;
    }

    /**
     * GET /api/inspecoes - Lista todas as inspeções (opcional por colmeiaId)
     */
    @GetMapping
    @Operation(summary = "Listar inspeções", description = "Retorna o histórico de inspeções, com filtro opcional por colmeia.")
    public ResponseEntity<List<Inspecao>> listar(
            @Parameter(description = "ID da colmeia para filtrar o histórico de inspeções")
            @RequestParam(required = false) String colmeiaId) {
        if (colmeiaId != null && !colmeiaId.isBlank()) {
            return ResponseEntity.ok(inspecaoService.listarPorColmeia(colmeiaId));
        }
        return ResponseEntity.ok(inspecaoService.listarTodas());
    }

    /**
     * GET /api/inspecoes/{id} - Busca uma inspeção por ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Buscar inspeção por ID", description = "Retorna os detalhes de uma inspeção específica.")
    public ResponseEntity<Inspecao> buscarPorId(@PathVariable String id) {
        return inspecaoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/inspecoes - Cadastra uma nova inspeção
     */
    @PostMapping
    @Operation(summary = "Registrar inspeção", description = "Cadastra uma nova ficha de inspeção técnica de colmeia.")
    public ResponseEntity<Inspecao> criar(@RequestBody Inspecao inspecao) {
        Inspecao criada = inspecaoService.criar(inspecao);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    /**
     * DELETE /api/inspecoes/{id} - Exclui uma inspeção
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir inspeção", description = "Remove um registro de inspeção do histórico.")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        if (inspecaoService.excluir(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
