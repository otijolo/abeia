package br.unifor.abeia.controller;

import br.unifor.abeia.model.Perfil;
import br.unifor.abeia.service.PerfilService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST de Perfil na arquitetura MVC.
 * Endpoint base: /api/perfil
 */
@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "*")
@Tag(name = "Perfil", description = "Endpoints para gerenciamento do perfil do usuário produtor")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    /**
     * GET /api/perfil - Obtém os dados do perfil do usuário
     */
    @GetMapping({"", "/{id}"})
    @Operation(summary = "Obter perfil", description = "Retorna os dados do perfil do usuário logado (ou 204 se ainda não cadastrado).")
    public ResponseEntity<Perfil> obter(@PathVariable(required = false) String id) {
        return perfilService.obterPerfil(id == null ? "usr-1" : id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    /**
     * POST /api/perfil - Salva ou cria o perfil
     */
    @PostMapping({"", "/{id}"})
    @Operation(summary = "Criar perfil", description = "Cria o perfil do identificador informado. Retorna 409 se já existir.")
    public ResponseEntity<Perfil> salvar(@PathVariable(required = false) String id, @Valid @RequestBody Perfil perfil) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(perfilService.criarPerfil(id == null ? "usr-1" : id, perfil));
    }

    /**
     * PUT /api/perfil - Atualiza os dados do perfil
     */
    @PutMapping({"", "/{id}"})
    @Operation(summary = "Atualizar perfil", description = "Atualiza os dados cadastrais do perfil do usuário.")
    public ResponseEntity<Perfil> atualizar(@PathVariable(required = false) String id, @Valid @RequestBody Perfil perfil) {
        return perfilService.atualizarPerfil(id == null ? "usr-1" : id, perfil)
                .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/perfil - Limpa os dados do perfil
     */
    @DeleteMapping({"", "/{id}"})
    @Operation(summary = "Excluir perfil", description = "Remove apenas o perfil do identificador informado, sem excluir sua conta Firebase.")
    public ResponseEntity<Void> limpar(@PathVariable(required = false) String id) {
        return perfilService.excluirPerfil(id == null ? "usr-1" : id)
                ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
