package br.unifor.abeia.controller;

import br.unifor.abeia.model.Apiario;
import br.unifor.abeia.service.ApiarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST de Apiários na arquitetura MVC.
 * Endpoint base: /api/apiarios
 */
@RestController
@RequestMapping("/api/apiarios")
@CrossOrigin(origins = "*")
public class ApiarioController {

    private final ApiarioService apiarioService;

    public ApiarioController(ApiarioService apiarioService) {
        this.apiarioService = apiarioService;
    }

    /**
     * GET /api/apiarios - Lista todos os apiários
     */
    @GetMapping
    public ResponseEntity<List<Apiario>> listar() {
        return ResponseEntity.ok(apiarioService.listarTodos());
    }

    /**
     * GET /api/apiarios/{id} - Busca um apiário por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Apiario> buscarPorId(@PathVariable String id) {
        return apiarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/apiarios - Cadastra um novo apiário
     */
    @PostMapping
    public ResponseEntity<Apiario> criar(@RequestBody Apiario apiario) {
        Apiario criado = apiarioService.criar(apiario);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    /**
     * PUT /api/apiarios/{id} - Atualiza um apiário existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<Apiario> atualizar(@PathVariable String id, @RequestBody Apiario dados) {
        return apiarioService.atualizar(id, dados)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/apiarios/{id} - Exclui um apiário
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        if (apiarioService.excluir(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
