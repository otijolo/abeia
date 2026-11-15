package br.unifor.abeia.service;

import br.unifor.abeia.model.Colmeia;
import br.unifor.abeia.repository.ColmeiaRepository;
import br.unifor.abeia.repository.ApiarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Camada de serviço de Colmeias na arquitetura MVC.
 */
@Service
public class ColmeiaService {

    private final ColmeiaRepository repository;
    private final ApiarioRepository apiarios;

    public ColmeiaService(ColmeiaRepository repository, ApiarioRepository apiarios) {
        this.repository = repository;
        this.apiarios = apiarios;
    }

    public List<Colmeia> listarTodas() {
        return repository.listarTodas();
    }

    public List<Colmeia> listarPorApiario(String apiarioId) {
        return repository.listarPorApiario(apiarioId);
    }

    public Optional<Colmeia> buscarPorId(String id) {
        return repository.buscarPorId(id);
    }

    public Colmeia criar(Colmeia colmeia) {
        conferirApiario(colmeia.getApiarioId());
        colmeia.setId(null);
        Colmeia criada = repository.salvar(colmeia);
        atualizarContagem(criada.getApiarioId());
        return criada;
    }

    public Optional<Colmeia> atualizar(String id, Colmeia dados) {
        return repository.buscarPorId(id).map(existente -> {
            String apiarioAnterior = existente.getApiarioId();
            if (dados.getApiarioId() != null) conferirApiario(dados.getApiarioId());
            if (dados.getNome() != null) existente.setNome(dados.getNome());
            if (dados.getApiarioId() != null) existente.setApiarioId(dados.getApiarioId());
            if (dados.getTipo() != null) existente.setTipo(dados.getTipo());
            if (dados.getPosicao() != null) existente.setPosicao(dados.getPosicao());
            if (dados.getInstaladaEm() != null) existente.setInstaladaEm(dados.getInstaladaEm());
            if (dados.getObservacoes() != null) existente.setObservacoes(dados.getObservacoes());
            if (dados.getStatus() != null) existente.setStatus(dados.getStatus());
            if (dados.getPrazoInspecao() != null) existente.setPrazoInspecao(dados.getPrazoInspecao());
            if (dados.getResumoInspecao() != null) existente.setResumoInspecao(dados.getResumoInspecao());
            if (dados.getProducaoPeriodoKg() != null) existente.setProducaoPeriodoKg(dados.getProducaoPeriodoKg());
            if (dados.getProblemas() != null) existente.setProblemas(dados.getProblemas());
            Colmeia atualizada = repository.salvar(existente);
            atualizarContagem(apiarioAnterior);
            if (!java.util.Objects.equals(apiarioAnterior, atualizada.getApiarioId())) {
                atualizarContagem(atualizada.getApiarioId());
            }
            return atualizada;
        });
    }

    public boolean excluir(String id) {
        return repository.buscarPorId(id).map(colmeia -> {
            boolean excluida = repository.excluir(id);
            if (excluida) atualizarContagem(colmeia.getApiarioId());
            return excluida;
        }).orElse(false);
    }

    private void conferirApiario(String id) {
        if (id == null || !apiarios.existe(id)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.BAD_REQUEST, "O apiário selecionado não existe.");
        }
    }

    private void atualizarContagem(String apiarioId) {
        if (apiarioId == null) return;
        apiarios.buscarPorId(apiarioId).ifPresent(apiario -> {
            apiario.setTotalColmeias(repository.listarPorApiario(apiarioId).size());
            apiarios.salvar(apiario);
        });
    }
}
