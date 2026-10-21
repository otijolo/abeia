package br.unifor.abeia.controller;

import br.unifor.abeia.model.Perfil;
import br.unifor.abeia.service.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST de Perfil na arquitetura MVC.
 * Endpoint base: /api/perfil
 */
@RestController
@RequestMapping("/api/perfil")
@CrossOrigin(origins = "*")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    /**
     * GET /api/perfil - Obtém os dados do perfil do usuário
     */
    @GetMapping
    public ResponseEntity<Perfil> obter() {
        return perfilService.obterPerfil()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new Perfil("usr-1", "Ildo Ramos", "ildo@email.com", "IR", "")));
    }

    /**
     * POST /api/perfil - Salva ou cria o perfil
     */
    @PostMapping
    public ResponseEntity<Perfil> salvar(@RequestBody Perfil perfil) {
        return ResponseEntity.ok(perfilService.salvarPerfil(perfil));
    }

    /**
     * PUT /api/perfil - Atualiza os dados do perfil
     */
    @PutMapping
    public ResponseEntity<Perfil> atualizar(@RequestBody Perfil perfil) {
        return ResponseEntity.ok(perfilService.atualizarPerfil(perfil));
    }

    /**
     * DELETE /api/perfil - Limpa os dados do perfil
     */
    @DeleteMapping
    public ResponseEntity<Void> limpar() {
        perfilService.limparPerfil();
        return ResponseEntity.noContent().build();
    }
}
