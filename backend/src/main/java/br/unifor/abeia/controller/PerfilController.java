package br.unifor.abeia.controller;

import br.unifor.abeia.model.Perfil;
import br.unifor.abeia.service.PerfilService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
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
    @GetMapping
    @Operation(summary = "Obter perfil", description = "Retorna os dados do perfil do usuário logado (ou 204 se ainda não cadastrado).")
    public ResponseEntity<Perfil> obter() {
        return perfilService.obterPerfil()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    /**
     * POST /api/perfil - Salva ou cria o perfil
     */
    @PostMapping
    @Operation(summary = "Salvar perfil", description = "Cria ou substitui o perfil do usuário.")
    public ResponseEntity<Perfil> salvar(@RequestBody Perfil perfil) {
        return ResponseEntity.ok(perfilService.salvarPerfil(perfil));
    }

    /**
     * PUT /api/perfil - Atualiza os dados do perfil
     */
    @PutMapping
    @Operation(summary = "Atualizar perfil", description = "Atualiza os dados cadastrais do perfil do usuário.")
    public ResponseEntity<Perfil> atualizar(@RequestBody Perfil perfil) {
        return ResponseEntity.ok(perfilService.atualizarPerfil(perfil));
    }

    /**
     * DELETE /api/perfil - Limpa os dados do perfil
     */
    @DeleteMapping
    @Operation(summary = "Limpar perfil", description = "Remove as informações de perfil salvas em memória.")
    public ResponseEntity<Void> limpar() {
        perfilService.limparPerfil();
        return ResponseEntity.noContent().build();
    }
}
